import {ArrayLayoutWidget} from 'ngx-schema-form'
import {AfterViewInit, Component} from '@angular/core'
import {IconNameConverterPipe} from '../_converters/_icon/IconNames'
import {SeverityNameConverterPipe} from '../_converters/_severity/SeverityNames'
import {FormProperty} from 'ngx-schema-form/lib/model/formproperty'
import { ButtonTypeTransformerService } from '../_converters/_button/button-type-transformer.service'

@Component({
  selector: 'ngx-ui-array-widget',
  templateUrl: './array.widget.html',
  styleUrls: ['./array.widget.scss'],
  providers: [IconNameConverterPipe, SeverityNameConverterPipe]
})
export class ArrayWidgetComponent extends ArrayLayoutWidget implements AfterViewInit {
  tabActiveIndex = 0
  /** fix #88 counting items doesn't rely on items.length anymore */
  itemCounterContinuous = 0

  /** feature: accordion */
  get currentPage() {
    return this.tabActiveIndex
  }
  set currentPage(index) {
    this.tabActiveIndex = index
  }
  /** /feature: accordion */

  constructor(private iconNameConverter?: IconNameConverterPipe
    , private severityNameConverter?: SeverityNameConverterPipe
    , private buttonTypesConverter?: ButtonTypeTransformerService) {
    super()
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit()
    if (this.schema.minItems) {
      const remaining = this.schema.minItems - this.propertiesLength()
      if (remaining > 0) {
        for (let i = 0; i < remaining; i++) {
          this.addItem()
        }
      }
    }

    /**
     * It is important to re-set up titles to children otherwise the ugly property path will be set as title
     */
    const children = []
    this.formProperty.forEachChild((property: FormProperty, propertyId: string) => {
      children.push(property)
      this.setItemLabel(property, children.length)
    })
    this.itemCounterContinuous = children.length

    this.formProperty.schema.widget = this.formProperty.schema.widget || {}
    if (this.formProperty.schema.widget['itemCounterContinuous']) {
      this.itemCounterContinuous = this.formProperty.schema.widget['itemCounterContinuous']
    }
  }

  private propertiesLength(): number {
    return Array.isArray(this.formProperty.properties) ? this.formProperty.properties.length : 0
  }

  addItem(): any {
    this.itemCounterContinuous++
    this.formProperty.schema.widget['itemCounterContinuous'] = this.itemCounterContinuous
    const item = this.formProperty.addItem()
    this.setItemLabel(item, this.itemCounterContinuous)
    return item
  }

  addItemUpdateIndex() {
    const item = this.addItem()
    const index = (this.formProperty.properties as FormProperty[]).indexOf(item)
    this.tabActiveIndex = (index || 0) > 0 ? index : 0
    return item
  }

  private setItemLabel(item: any, counter?: number) {

    const createTitle = (widget, count) => {
      let title = widget.itemTitle || ''
      if ((widget.hasOwnProperty('itemNumeration') && false === widget.itemNumeration) || widget.itemNumeration === 'index') {
        title = title
      } else if (title) {
        title = `${count}. ${title}`
      } else {
        title = `${count}.`
      }
      return title
    }
    /**
     * To set the appropriate title a copy of the schema is required since<br/>
     * it seems that all items share the same schema object.
     */
    const newSchema = Object.assign({}, item.schema)
    item.schema = newSchema
    /** make sure not to override 'title' when set by binding function */
    item.schema.title = item.schema.title || createTitle((this.formProperty.schema.widget || {}), counter)
    if (item.schema.type === 'object') {
      for (const key in Object.keys(item.schema.properties)) {
        if (item.schema.properties.hasOwnProperty(key)) {
          const prop = item.schema.properties[key]
          prop.schema.title = item.schema.title
        }
      }
    }
  }

  removeItem(index: number) {
    const item = this.formProperty.properties[index]
    /** this removes the focus from any possible selected tab first , fixes issue #70 */
    this.tabActiveIndex = (index || 0) > 0 ? index : 0
    /* then remove the item */
    this.formProperty.removeItem(item)
  }

  removeItemUpdateIndex(index: number) {
    let propLen = Array.isArray(this.formProperty.properties) ? (this.formProperty.properties || []).length : Object.keys(this.formProperty.properties).length

    const item = this.formProperty.properties[index]

    const currentActiveTabIndex = this.tabActiveIndex

    const itemToRemoveIsSelected = this.tabActiveIndex === index
    /** if item to get removed is currently selected */
    if (itemToRemoveIsSelected) {
      /** this removes the focus from any possible selected tab first - solves issue when removing items*/
      const this_tabActiveIndex = this.tabActiveIndex > 0 ? this.tabActiveIndex - 1 : (this.tabActiveIndex < propLen ? this.tabActiveIndex : null)
      this.tabActiveIndex = this_tabActiveIndex
      /**
       * TODO there is still a bug in PrimeNG TabView here.
       * Create array with 2 items in model.
       * Add one item, add another one.
       * Delete first item and
       * now delete the selected one: see error below
       */
    }

    /* then remove the item */
    this.formProperty.removeItem(item)

    if (!itemToRemoveIsSelected) {
      /** set the focus to the new selected tab - solves issue when removing items */
      const this_tabActiveIndex = currentActiveTabIndex > 0 ? currentActiveTabIndex - 1 : (index < propLen ? index + 1 : null)
      const workoundFixUsingTimeout = index === 0 && currentActiveTabIndex === 1
      if (workoundFixUsingTimeout) {
        /**
         * Solves the issue that when only 2 items are left,
         * and the second is selected but the first gets deleted
         * then the content of the lasting tabview will be not showed.
         * The PrimeNG TabView raises this error:
         * <code>
         * TabPanel.html:2 ERROR Error: ExpressionChangedAfterItHasBeenCheckedError:
         * Expression has changed after it was checked.
         * Previous value: 'ui-helper-hidden: true'. Current value: 'ui-helper-hidden: false'.
         * </code>
         * With this workaround the error is still raised but the
         * content of the tab stays visible
         */
        setTimeout(() => { this.tabActiveIndex = this_tabActiveIndex }, 0)
      } else {
        this.tabActiveIndex = this_tabActiveIndex
      }
    }
  }

  /** deprecated: don't use this, since it will mess up the model binding (preset values by model) */
  _trackByIndex(index: number, item: any) {
    return index
  }

  getIcon(value: string) {
    if (this.iconNameConverter && value) {
      return this.iconNameConverter.transform(value)
    }
    return value
  }

  getSeverity(value: string) {
    if (this.severityNameConverter && value) {
      return this.severityNameConverter.transform(value)
    }
    return value
  }

  getButtonType(buttonProp: object) {
    const button = buttonProp || {}
    if (!button['type'] && !button['label'] && button['icon']) {
      return 'ui-button-icon-only'
    }
    return this.buttonTypesConverter.transform(button['type'])
  }

  isAddButtonDisabled(button) {
    if (this.schema.hasOwnProperty('maxItems') && Array.isArray(this.formProperty.properties)) {
      if (this.formProperty.properties.length >= this.schema.maxItems) {
        return true
      }
    }
    return false
  }

  isRemoveButtonDisabled(button) {
    if (this.schema.hasOwnProperty('minItems') && Array.isArray(this.formProperty.properties)) {
      if (this.formProperty.properties.length <= this.schema.minItems) {
        return true
      }
    }
    return false
  }

  handleOnChange(event) {//primeng only
    /**
     * due to a bug the index is not set anymore via the binding on 'TabView#activeIndex',
     * so we do it ourselfs here.
     * This solves issue #70
     */
    this.tabActiveIndex = event.index

    /** fix #88 Make user only the selected tab is visible */
    // this.__update_selected_Tab(this.tabActiveIndex)
  }

  handleOnClose(event) {
    /** //[primeng only]
     * Use default selction strategy after an item has been removed
     */
    // this.removeItem(event.index)

    /** //[primeng only]
     * Once we did uses our own strategy after an item has been removed
     * by using <code>this.removeItemUpdateIndex(event.index)</code>.
     * We don't do this anymore.
     */
    // this.removeItemUpdateIndex(event.index)

    /** //[primeng only] fix #88 Make user only the selected tab is visible */
    // this.__update_selected_Tab(this.tabActiveIndex)
  }

  /** //[primeng only]
   * fix #88 make sure only one tab is active.
   * This is a workaround due to a bug in PrimeNG tabview
   *
   */
  __update_selected_Tab(index): void {
    // for(const t of this.tabView.tabs){
    //       // at first deactivate all of them ...
    //       t.selected = false
    //  }
    //  // ... then re-activate only the selected one
    //  this.tabView.tabs[index].selected = true
    //  setTimeout(() => {this.tabActiveIndex = index}, 0)
  }

  /** feature: accordion */
  onTabOpen_Accordion(event: { originalEvent: any, index: number }) {
    //  console.log('onTabOpen', event)
    this.currentPage = event.index
  }

  onTabClose_Accordion(event: { originalEvent: any, index: number }) {
    // console.log('onTabClose', event)
  }
  /** /feature: accordion */
}
