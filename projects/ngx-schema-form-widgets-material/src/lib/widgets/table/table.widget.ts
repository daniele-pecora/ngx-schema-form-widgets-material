/**
 * Created by daniele on 14.04.19.
 */
import { Component, OnDestroy } from "@angular/core";
import { ObjectLayoutWidget, FormProperty, ArrayProperty } from "ngx-schema-form";
import { Subscription } from 'rxjs'
import { SafeHtml } from '@angular/platform-browser'
import { JEXLExpressionCompiler } from "../_service/expression-complier.service"
import { DataConverterRegistryPipe, Converter } from '../_converters/_data/data-converter-registry.pipe'
import { DataConverterTransformerRegistry } from '../_converters/_data/data-converter-transformer.registry'
import { MatTable } from "@angular/material/table";
import { MatSortHeaderIntl } from "@angular/material/sort";

@Component({
    selector: 'ngx-ui-form-table',
    templateUrl: './table.widget.html',
    styleUrls: ['./table.widget.scss'],
    providers: [JEXLExpressionCompiler, DataConverterRegistryPipe, DataConverterTransformerRegistry, MatSortHeaderIntl]
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

    constructor(private dataConverterTransformerRegistry: DataConverterTransformerRegistry
        , private matSortService: MatSortHeaderIntl) {
        super()
    }

    ngAfterViewInit() {
        super.ngAfterViewInit()

        // init model
        const style = ((this.schema || {}).widget || {}).style
        if (!style || style === 'default' || style === 'normal') {
            this.initModel()
        }
    }

    initModel(): any {

        this.unsubscribe()

        const modelPath = (this.schema.widget.model || { path: '' }).path
        const modelTable = (this.schema.widget.model || { table: null }).table

        if (modelPath) {
            /**
             * something like : /complexTypes/wizard/property-2
             */
            const modelProperty = this.formProperty.searchProperty(modelPath)
            this.subs.push(modelProperty.valueChanges.subscribe(() => {
                this.getModelFromPath(modelProperty, modelPath)
            }))
        } else if (modelTable) {
            this.getModelFromTableModel(modelTable)
        } else {
            console.warn('No model.path or model.table defined')
        }
    }

    private getModelFromTableModel(modelTable: any) {
        this.model.cols = this.processIncludesExcludes(modelTable.columns)
        this.model.values = modelTable.data

        this.updateColIds()
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

    private getModelFromPath(modelProperty: FormProperty, modelPath: string) {
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
    }

    isEmptyRow(index: number, item: any) {
        const this_formProperty = this.formProperty || /** 'this' is here type of MatRowDef when used in matRowDefWhen */this['template']._parentView.component.formProperty
        const _value = item.value === '' ? '' : (item.value || (item.valuePath ? this_formProperty.searchProperty(item.valuePath).value : ''))
        const _label = item.label === '' ? '' : (item.label || (item.labelPath ? (this_formProperty.searchProperty(item.labelPath).parent.schema.items.title || this_formProperty.searchProperty(item.labelPath).schema.title) : '') || (item.valuePath ? (this_formProperty.searchProperty(item.valuePath).parent.schema.items.title || this_formProperty.searchProperty(item.valuePath).schema.title) : ''))
        const _empty = ((!item.empty && item.empty !== '') ? false : ((item.empty === true) ? '' : item.empty))
        const _transform = item.transform
        const _transformLabel = item.transformLabel

        return !(_value || _empty!==false)
    }

    updateColIds() {
        const colIds = []
        for (const col of this.model.cols) {
            colIds.push(col.field)
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
        let sortButtonLabel = ''
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
        this.matSortService.sortButtonLabel(sortButtonLabel)
        table.renderRows()
    }
}
