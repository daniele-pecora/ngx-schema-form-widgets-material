import {Component, ElementRef, OnInit, Renderer2, ViewChild, Inject} from '@angular/core';
import {ActionObjectLayoutWidgetComponent} from '../_base/action-object-layout.widget.component'
import {MenuItem} from '../_domain/menuitem'
import {SeverityNameConverterPipe} from '../_converters/_severity/SeverityNames'
import {IconNameConverterPipe} from '../_converters/_icon/IconNames'
import { ButtonTypeTransformerService } from '../_converters/_button/button-type-transformer.service'
import { MatStepper } from '@angular/material/stepper';
import {ActionRegistry} from 'ngx-schema-form'
import {FormProperty} from 'ngx-schema-form/lib/model/formproperty'
import {Action} from 'ngx-schema-form/lib/model/action'
import { DOCUMENT } from '@angular/common'

@Component({
  selector: 'ngx-ui-wizard-widget',
  templateUrl: './wizard.widget.html',
  styleUrls: ['./wizard.widget.scss'],
  providers: [IconNameConverterPipe, SeverityNameConverterPipe]
})
export class WizardWidgetComponent extends ActionObjectLayoutWidgetComponent implements OnInit {

  currentPage = 0
  private startPage = 0

  //
  items: MenuItem[]
  readOnly: boolean


  @ViewChild('wizardStepper') wizardStepper: MatStepper
  @ViewChild('scrollHook') scrollHook: ElementRef

  constructor(private this_actionRegistry: ActionRegistry
    , iconNameConverter: IconNameConverterPipe
    , severityNameConverter: SeverityNameConverterPipe
    , buttonTypesConverter: ButtonTypeTransformerService
    , private renderer: Renderer2
    , @Inject(DOCUMENT) private document) {
    super(this_actionRegistry, iconNameConverter, severityNameConverter, buttonTypesConverter)
  }

  ngOnInit() {
    super.ngOnInit()

    this.items = []

    for (let i = 0; i < this.schema.fieldsets.length; i++) {
      const fs = this.schema.fieldsets[i]
      const item: WizardMenuItem = {
        label: (this.schema.widget['stepper'] || {})[fs.id] || fs.name || fs.title,
        command: (event: any) => {
          let setIndex = null
          const id = fs.id
          const visibleItems = this.filterHiddenItems(this.schema.fieldsets)
          for (let i = 0; i < visibleItems.length; i++) {
            if (id === visibleItems[i]['id']) {
              setIndex = i
              break
            }
          }
          this.currentPage = null !== setIndex ? setIndex : i
        },
        fieldset: this.schema.fieldsets[i]
      }
      this.items.push(item)
    }

    this.readOnly = this.schema.readOnly

    if (this.schema.widget.startPage && this.schema.widget.startPage > 0 && this.schema.widget.startPage < this.filterHiddenItems(this.items).length)
      this.startPage = this.schema.widget.startPage

    this.currentPage = this.startPage || 0
  }

  previousPage() {
    this.processAction('prev', this.addNavigationInfoPageIds({ fromPage: this.currentPage, toPage: this.currentPage - 1 }))
    if (this.currentPage > 0) {
      --this.currentPage
    }
    this._onPageChange()
  }

  nextPage() {
    this.processAction('next', this.addNavigationInfoPageIds({ fromPage: this.currentPage, toPage: this.currentPage + 1 }))
    if (this.hasNextPage()) {
      ++this.currentPage
    }
    this._onPageChange()
  }

  finishPage() {
    this.processAction('finish', this.addNavigationInfoPageIds({ fromPage: this.currentPage, toPage: this.currentPage + 1 }))
    if (this.hasNextPage()) {
      ++this.currentPage
    }
    this._onPageChange()
  }

  private _onPageChange() {
    // onPageChange callback
  }

  hasPreviousPage() {
    return this.currentPage > 0
  }

  hasNextPage() {
    return this.currentPage + 1 < this.filterHiddenItems(this.schema.fieldsets).length
  }

  getCurrentIndex() {

    return this.currentPage
  }

  logPage(stepIndex) {
    // console.log('logPage(index)', stepIndex)
  }

  isCurrentPageValid() {
    return this.isPageValid(this.currentPage)
  }

  isPageValid(index) {
    const visibleItems = this.filterHiddenItems(this.schema.fieldsets)
    for (const fieldId of /*this.schema.fieldsets*/visibleItems[index]['fields']) {
      const childProp: FormProperty = this.formProperty.getProperty(fieldId);
      if (!childProp) {
        /**
         * This may happen when setting formProperty children has not been processed yet.<br/>
         * This method will be called a second time with existing children, so for now just skip ...
         */
        return false
      }
      if (!childProp.valid) {
        return false
      }
    }
    return true
  }

  hasPageNext(index) {
    return index + 1 < this.filterHiddenItems(this.schema.fieldsets).length
  }

  hasPagePrevious(index) {
    return index > 0
  }

  selectionChange(event) {
    const index = event.selectedIndex
    if (index !== this.currentPage) {
      const pageNav: WizardPageNavInfo = { fromPage: 0, toPage: 0 }
      pageNav.fromPage = this.currentPage
      pageNav.toPage = index
      this.processAction(index < this.currentPage ? 'prev' : 'next', this.addNavigationInfoPageIds(pageNav))
    }
    this.currentPage = index
    this.scrollIntoView()
  }

  processAction(actionName, params?: any) {
    const actionId = ((this.schema.widget.buttons || {})[actionName] || {}).actionId
    if (actionId) {
      const action: Action = this.this_actionRegistry.get(actionId)
      if (action) {
        action(this.formProperty, params)
      }
    }
  }

  getLabel(topLabel: string, buttonProp: object, buttonName: string) {
    if (topLabel || topLabel === '') {
      return topLabel
    }
    if (buttonProp && (buttonProp['label'] || buttonProp['label'] === '')) {
      return buttonProp['label']
    }
    return buttonName
  }

  scrollIntoView() {
    const scrollDisabled = (this.schema.widget.hasOwnProperty('disableScrollToTop') && this.schema.widget.disableScrollToTop === true)
    if (scrollDisabled)
      return
    const scrollOptions = { behavior: 'smooth', inline: 'start', block: 'start' }
    if(this.scrollHook && this.scrollHook.nativeElement)
      if (this.scrollHook.nativeElement.scrollIntoViewIfNeeded) {
        this.scrollHook.nativeElement.scrollIntoViewIfNeeded()
      } else {
        this.scrollHook.nativeElement.scrollIntoView(scrollOptions)
      }
  }

  filterHiddenItems(items): object[] {
    if (true !== this.schema.widget['live']) {
      return items
    }
    const filteredItems = items.filter((item, index, all) => {
      return !item.hidden
    })
    return filteredItems
  }

  filterHiddenSteps(items: WizardMenuItem[]): WizardMenuItem[] {
    if (true !== this.schema.widget['live']) {
      return items
    }
    const filteredItems = items.filter((item, index, all) => {
      return !item.fieldset.hidden
    })
    return filteredItems
  }

  addNavigationInfoPageIds(navInfo: WizardPageNavInfo): WizardPageNavInfo {
    const visiblePages = this.filterHiddenItems(this.schema.fieldsets) || []
    navInfo.fromPageId = (visiblePages[navInfo.fromPage] || { id: undefined })['id']
    navInfo.toPageId = (visiblePages[navInfo.toPage] || { id: undefined })['id']
    return navInfo
  }
}

export interface WizardPageNavInfo {
  fromPage: number
  toPage: number
  fromPageId?: string
  toPageId?: string
}

export interface WizardMenuItem extends MenuItem {
  fieldset: any
}
