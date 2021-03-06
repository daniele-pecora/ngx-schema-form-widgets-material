/**
 * Created by daniele on 14.04.19.
 */
import { Component, Injectable, OnDestroy, ElementRef, Inject, ViewChild } from '@angular/core'
import { ObjectLayoutWidget, FormProperty, ArrayProperty } from 'ngx-schema-form'
import { Subject, Subscription } from 'rxjs'
import { SafeHtml } from '@angular/platform-browser'
import { JEXLExpressionCompiler } from '../_service/expression-complier.service'
import { DataConverterRegistryPipe, Converter } from '../_converters/_data/data-converter-registry.pipe'
import { DataConverterTransformerRegistry } from '../_converters/_data/data-converter-transformer.registry'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { MatSortHeaderIntl } from '@angular/material/sort'
import { DOCUMENT } from "@angular/common";
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator'

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    // /**
    //  * Stream to emit from when labels are changed. Use this to notify components when the labels have
    //  * changed after initialization.
    //  */
    // readonly changes: Subject<void>
    /** A label for the page size selector. */
    itemsPerPageLabel: string = '->Items per page'
    /** A label for the button that increments the current page. */
    nextPageLabel: string = '->Next page'
    /** A label for the button that decrements the current page. */
    previousPageLabel: string = '->Previous page'
    /** A label for the button that moves to the first page. */
    firstPageLabel: string = '->First page'
    /** A label for the button that moves to the last page. */
    lastPageLabel: string = '->Last page'
    /** A label for the range of items within the current page and the length of the whole list. */
    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (this.report) {
            /**
             Available placeholders are:
            `{currentPage}`  the index of the current page
            `{totalPages}`   the amount of total pages
            `{rows}`         the amount of entry per page
            `{first}`        the index of the first entry of the current page
            `{last}`         the index of the last entry of the current page
            `{totalRecords}` the number of total entries
             */
            let value = this.report
            const currentPage = page + 1 // make index start at 1 and not 0 
            const lastPageEntries = length % pageSize
            const totalPages = Math.floor((length / pageSize) + (lastPageEntries > 0 ? 1 : 0))
            const first = ((currentPage * pageSize) - pageSize) + 1 // make index start at 1 and not 0 
            const last = currentPage === totalPages && lastPageEntries !== 0
                ? ((pageSize * (totalPages - 1)) + lastPageEntries) // all full pages + the rest of the last page
                : (currentPage * pageSize) // only even full pages present :-)
            const rows = currentPage === totalPages && lastPageEntries !== 0 ? lastPageEntries : pageSize // of current page

            value = value
                .replace(new RegExp('{currentPage}', 'ig'), `${currentPage}`)
                .replace(new RegExp('{totalPages}', 'ig'), `${totalPages}`)
                .replace(new RegExp('{rows}', 'ig'), `${rows}`)
                .replace(new RegExp('{first}', 'ig'), `${first}`)
                .replace(new RegExp('{last}', 'ig'), `${last}`)
                .replace(new RegExp('{totalRecords}', 'ig'), `${length}`)
            return value
        }
        return `->page:${page} pageSize:${pageSize} length:${length}`
    }

    // Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords}
    // eg: "Showing {first} to {last} of {totalRecords} entries"
    report: string

    load(options: { next: string, prev: string, first: string, last: string, perPage?: string, report?: string }) {
        this.nextPageLabel = options.next
        this.previousPageLabel = options.prev
        this.firstPageLabel = options.first
        this.lastPageLabel = options.last
        this.itemsPerPageLabel = options.perPage
        this.report = options.report
    }
}

@Injectable()
export class CustomMatSortHeaderIntl {
    mappings: {
        [column: string]: {
            sortAriaLabel: string
            sortAriaLabelAsc: string
            sortAriaLabelDesc: string
        }
    }
    states: {
        [columns: string]: string
    } = {}

    changes: Subject<void> = new Subject<void>()
    sortButtonLabel(id: string) {
        let keyString = 'sortAriaLabel'
        if (this.states[id] === 'asc') {
            keyString = 'sortAriaLabelAsc'
        } else if (this.states[id] === 'desc') {
            keyString = 'sortAriaLabelDesc'
        }
        return this.mappings[id] ? this.mappings[id][keyString] : null
    }
}

@Component({
    selector: 'ngx-ui-form-table',
    templateUrl: './table.widget.html',
    styleUrls: ['./table.widget.scss'],
    providers: [JEXLExpressionCompiler, DataConverterRegistryPipe, DataConverterTransformerRegistry,
        { provide: MatSortHeaderIntl, useClass: CustomMatSortHeaderIntl }
    ]
})
export class TableWidgetComponent extends ObjectLayoutWidget implements OnDestroy {
    model = {
        cols: [],
        values: []
    }

    subs: Subscription[] = []
    expressionPathSubs: {
        [key: string]: Subscription
    } = {}

    /** col-group */
    get colGroupWidth(): number {
        return this.calculateColGroupWidth()
    }
    colGroupWidthCalculated: boolean

    @ViewChild(MatPaginator) paginator!: MatPaginator
    @ViewChild('tableDefault') tableDefault: MatTable<any>
    @ViewChild('tableKeyValue') tableKeyValue: MatTable<any>
    tableDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([])
    tableDataSourceKeyValue: MatTableDataSource<any> = new MatTableDataSource<any>([])

    constructor(private dataConverterTransformerRegistry: DataConverterTransformerRegistry
        , private matSortService: MatSortHeaderIntl
        , @Inject(DOCUMENT) private document: Document
        , private elementRef: ElementRef) {
        super()
    }

    syncPrimaryPaginator(event: PageEvent) {
        this.paginator.pageIndex = event.pageIndex;
        this.paginator.pageSize = event.pageSize;
        this.paginator.page.emit(event);
    }

    ngAfterViewInit() {
        super.ngAfterViewInit()

        const style = ((this.schema || {}).widget || {}).style
        const isModelBasedTable = !style || style === 'default' || style === 'normal'


        const callbackAfterPreparedModel = () => {
            if (this.paginator && this.schema.widget.paging && this.schema.widget.paging.labels) {
                const _intl = new CustomMatPaginatorIntl()
                _intl.load(this.schema.widget.paging.labels)
                this.paginator._intl = _intl
            }
            if (isModelBasedTable) {
                this.tableDataSource = new MatTableDataSource<any>(this.model.values)
                if (this.paginator)
                    this.tableDataSource.paginator = this.paginator
            } else {
                const keyValue = ((this.schema || {}).widget || {}).keyValue || {}
                this.tableDataSourceKeyValue = new MatTableDataSource<any>(keyValue)
                if (this.paginator)
                    this.tableDataSourceKeyValue.paginator = this.paginator
            }
        }

        // init model
        if (isModelBasedTable) {
            this.initModel(callbackAfterPreparedModel)
        } else {
            // init datasource for key value table
            callbackAfterPreparedModel()
        }
    }

    initModel(callback?: () => void): any {

        this.unsubscribe()

        const modelPath = (this.schema.widget.model || { path: '' }).path
        const modelTable = (this.schema.widget.model || { table: null }).table

        if (modelPath) {
            /**
             * something like : /complexTypes/wizard/property-2
             */
            const modelProperty = this.formProperty.searchProperty(modelPath)
            this.subs.push(modelProperty.valueChanges.subscribe(() => {
                this.getModelFromPath(modelProperty, modelPath, callback)
            }))
        } else if (modelTable) {
            this.getModelFromTableModel(modelTable, callback)
        } else {
            console.warn('No model.path or model.table defined')
        }
    }

    private getModelFromTableModel(modelTable: any, callback?: () => void) {
        this.model.cols = this.processIncludesExcludes(modelTable.columns)
        this.model.values = modelTable.data

        this.updateColIds()
        if (callback) {
            callback()
        }
    }

    private processIncludesExcludes(columns: any) {
        const includes = this.schema.widget.model.includes as Array<string>
        const excludes = this.schema.widget.model.excludes as Array<string>

        if (!(includes || []).length && !(excludes || []).length)
            return columns

        let cols = [...columns]
        cols = cols.filter((item, index, all) => {
            return (!(includes || []).length || -1 !== includes.indexOf(item.field)) &&
                (!(excludes || []).length || -1 === excludes.indexOf(item.field));
        })
        return cols
    }

    private getModelFromPath(modelProperty: FormProperty, modelPath: string, callback?: () => void) {
        const getColsInfo = (modelFormProp) => {

            const createPath = (path: string): string => {
                return path
                    // remove the trailing target object path
                    .replace(modelPath, '')
                    // remove any trailing array indicator
                    .replace(new RegExp('^/?\\*?/?'), '')
                    // replace array indicator to point to the first item
                    .replace(new RegExp('\\*/', 'g'), '0/')
            }

            let _cols = []
            if ((modelFormProp as any).hasOwnProperty('propertiesId') /** is an object: 'propertiesId' contains the properties order */) {
                for (const pId of modelFormProp['propertiesId']) {
                    const formProp = modelFormProp['properties'][pId] as FormProperty
                    if ((formProp as any).hasOwnProperty('propertiesId')) {
                        const colVal = getColsInfo(formProp)
                        _cols = _cols.concat(colVal.cols)
                    } else {
                        _cols.push({
                            field: createPath(formProp.path)
                            , header: formProp.schema.title || formProp.path
                        })
                    }
                }
            } else if (modelProperty instanceof ArrayProperty /** is an array */) {
                if (modelProperty.schema.items.type === 'object') {
                    const formProps = modelProperty['properties']
                    let colsSet = false
                    for (const prop of formProps as FormProperty[]) {
                        const colVal = getColsInfo(prop)
                        if (!colsSet)
                            _cols = _cols.concat(colVal.cols)
                        colsSet = true
                    }
                } else {
                    _cols.push({
                        field: createPath(modelProperty.path)
                        , header: modelProperty.schema.items.title || modelProperty.path
                    })
                }
            } else /** is a simple property */ {
                _cols.push({
                    field: createPath(modelProperty.path)
                    , header: modelProperty.schema.items.title || modelProperty.path
                })
            }
            return { cols: _cols }
        }

        // get colums
        const colsInfo = getColsInfo(modelProperty)
        colsInfo.cols = this.processIncludesExcludes(colsInfo.cols)
        this.model.cols = colsInfo.cols

        // get values
        let formProps = []
        if (modelProperty instanceof ArrayProperty /** is an array */) {
            formProps = formProps.concat(formProps, modelProperty['properties'])
        } else {
            formProps.push(modelProperty)
        }

        const values = []

        for (const formProp of formProps) {
            const row = {}
            for (const col of colsInfo.cols) {
                if (formProp.getProperty) {
                    const prop = formProp.getProperty(col.field)
                    row[col.field] = prop.value
                }
            }
            values.push(row)
        }
        this.model.values = values

        this.updateColIds()

        if (callback) {
            callback()
        }
    }

    isEmptyRow(index: number, item: any) {
        const this_formProperty = this.formProperty || /** 'this' is here type of MatRowDef when used in matRowDefWhen */this['template']._parentView.component.formProperty
        const _value = item.value === '' ? '' : (item.value || (item.valuePath ? this_formProperty.searchProperty(item.valuePath).value : ''))
        const _label = item.label === '' ? '' : (item.label || (item.labelPath ? (this_formProperty.searchProperty(item.labelPath).parent.schema.items.title || this_formProperty.searchProperty(item.labelPath).schema.title) : '') || (item.valuePath ? (this_formProperty.searchProperty(item.valuePath).parent.schema.items.title || this_formProperty.searchProperty(item.valuePath).schema.title) : ''))
        const _empty = ((!item.empty && item.empty !== '') ? false : ((item.empty === true) ? '' : item.empty))
        const _transform = item.transform
        const _transformLabel = item.transformLabel

        return !(_value || _empty !== false)
    }

    updateColIds() {
        const msortservice = this.matSortService as CustomMatSortHeaderIntl
        msortservice.mappings = msortservice.mappings || {} as {
            [column: string]: {
                sortAriaLabel: string
                sortAriaLabelAsc: string
                sortAriaLabelDesc: string
            }
        }
        const colIds = []
        for (const col of this.model.cols) {
            colIds.push(col.field)
            msortservice.mappings[col.field] = col
        }
        this.model['colIds'] = colIds
    }


    unsubscribe() {
        if (this.subs) {
            try {
                for (const sub of this.subs) {
                    sub.unsubscribe()
                }
            } catch (error) {
                console.warn(error)
            }
        }
        if (this.expressionPathSubs) {
            try {
                for (const subKey of Object.keys(this.expressionPathSubs)) {
                    if (this.expressionPathSubs[subKey])
                        this.expressionPathSubs[subKey].unsubscribe()
                }
            } catch (error) {
                console.warn(error)
            }
        }
    }

    ngOnDestroy() {
        this.unsubscribe()
    }
    /**
     * This method may be used instead of the pipe <code>DataConverter</code> since
     * when used then the content has change detection otherwise it no change are recognized.
     * @param value
     * @param formProperty
     * @param transformer
     */
    calculateValue(value: any, formProperty: FormProperty, transformer: any): any | SafeHtml {
        if (!transformer)
            return value
        const val = this.dataConverterTransformerRegistry.getTransformer(transformer.type).transform(value, formProperty, transformer as Converter)
        return val
    }

    transformerStatus(transformer: any): boolean {
        if (!transformer)
            return false

        if (transformer.path) {
            const a = this.formProperty.findRoot().searchProperty(transformer.path)
            if (a) {
                if ((transformer.type || '') === 'expression') {
                    /*
                    this.expressionPathSubs[transformer.path] = this.expressionPathSubs[transformer.path] || a.valueChanges.subscribe(() => {
                        console.log('++++++HAS CHANGED', transformer, a, this)
                    })
                    const watcher: boolean = !(!this.expressionPathSubs[transformer.path])
                    */
                }
            } else {
                console.warn(`Form-property not found. Can't register a watcher on the property path '${transformer.path}' defined in transformer '${transformer.type}'.`, transformer.path)
            }
        }

        const found = this.dataConverterTransformerRegistry.findTransformer('bbcode', transformer)
        return found
    }

    onMatSortChange(event, table: MatTable<any>) {
        const activeCol = event.active
        const direction = event.direction
        if (!table['_orgmodel']) {
            table['_orgmodel'] = { cols: [], values: [] }
            table['_orgmodel'].cols = [].concat(this.model.cols)
            table['_orgmodel'].values = [].concat(this.model.values)
            table['_orgmodel']['colIds'] = [].concat(this.model['colIds'])
        }
        const msortservice = this.matSortService as CustomMatSortHeaderIntl
        msortservice.states[activeCol] = direction

        if (!direction) {
            this.model = {
                cols: [],
                values: []
            }
            this.model['colIds'] = [].concat(table['_orgmodel']['colIds'])
            this.model['cols'] = [].concat(table['_orgmodel']['cols'])
            this.model['values'] = [].concat(table['_orgmodel']['values'])
        } else if ('asc' === direction) {
            this.model.values.sort((item1, item2) => {
                return item1[activeCol].localeCompare(item2[activeCol])
            })
        } else if ('desc' === direction) {
            this.model.values.sort((item1, item2) => {
                return item2[activeCol].localeCompare(item1[activeCol])
            })
        }

        table.renderRows()
    }

    /**
     * should only be called if `this.formProperty.schema.widget.keyColGroup` is set
     */
    calculateColGroupWidth(largestOrSmallest: boolean = true) {
        // console.log('this.elementRef.nativeElement', this.elementRef.nativeElement)
        const els = this.elementRef.nativeElement.querySelectorAll(`[data-colGroup=${this.formProperty.schema.widget.keyColGroup}]`)
        let width = -1
        if (els) {
            for (let i = 0; i < els.length; i++) {
                // console.log('els[i].offsetWidth', els[i].offsetWidth)
                if (largestOrSmallest) {
                    width = els[i].offsetWidth > width ? els[i].offsetWidth : width
                } else {
                    width = width > 0 && els[i].offsetWidth < width ? els[i].offsetWidth : width
                }
            }
        }
        return width
    }

    getGlobalStyleDef(): HTMLElement {
        const head = this.document.getElementsByTagName('head')[0];
        let style = head.querySelector(`[data-globalStyleColGroup=${this.formProperty.schema.widget.keyColGroup}]`) as HTMLElement
        if (!style) {
            style = this.document.createElement('style');
            style.setAttribute('data-globalStyleColGroup', `${this.formProperty.schema.widget.keyColGroup}`)
            style['type'] = 'text/css'
            head.appendChild(style)

            // convenience...
            style['getColWidth'] = () => {
                return Number.parseInt(style.getAttribute('data-globalStyleColGroupWidth') || '-1')
            }
            style['updateColWidth'] = (colWidth: number) => {
                style.setAttribute('data-globalStyleColGroupWidth', `${colWidth}`)
                style.innerHTML = `
                .dataColGroupTable [data-colGroup=${this.formProperty.schema.widget.keyColGroup}]{
                    width: ${colWidth}px;
                }
            `
            }
            style['colWidthStyleBackup'] = () => {
                style.innerHTML = style.innerHTML.replace(
                    `[data-styleColGroup=${this.formProperty.schema.widget.keyColGroup}]`,
                    `[data-styleColGroup=____${this.formProperty.schema.widget.keyColGroup}]`
                )
            }
            style['colWidthStyleRestore'] = () => {
                style.innerHTML = style.innerHTML.replace(
                    `[data-styleColGroup=____${this.formProperty.schema.widget.keyColGroup}]`,
                    `[data-styleColGroup=${this.formProperty.schema.widget.keyColGroup}]`
                )
            }
        }

        return style
    }

    calculateColGroupStyle() {
        const keyColWidth = `${this.formProperty.schema.widget.keyColWidth}`
        if ('max' !== keyColWidth && 'min' !== keyColWidth) {
            return ''
        }

        const largestOrSmallestCol = 'max' === keyColWidth

        const style = this.getGlobalStyleDef() as any

        // 1. deactivate global style definition
        style.colWidthStyleBackup()

        // 2. calculate col cell width
        const _colwidth = this.calculateColGroupWidth()

        // 3. set col width
        if (largestOrSmallestCol && _colwidth > style.getColWidth()) {
            style.updateColWidth(_colwidth)
        } else if (!largestOrSmallestCol && (_colwidth < style.getColWidth() || style.getColWidth() < 0)) {
            style.updateColWidth(_colwidth)
        } else {
            // ... or restore
            style.colWidthStyleRestore()
        }
        this.colGroupWidthCalculated = true
        return ''
    }
}