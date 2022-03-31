import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ControlWidget } from 'ngx-schema-form'
import { FormProperty } from 'ngx-schema-form'
import { WidgetComponentHttpApiService } from '../_service/widget-component-http-api.service'
import { Subscription, Observable } from 'rxjs'
import { AutocompleteAsyncHelper, KeyValuePair } from "../_base/autocomplete-async-helper"
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { ExpressionCompiler } from '../_service/expression-complier.service'

import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatChipInputEvent, MatChipList } from '@angular/material/chips'
import { FormControl } from '@angular/forms'
import { ValidationFieldMessagesComponent } from '../_validation-field-messages/_validation-field-messages.component'
import { NoHelperTextSpacer } from '../_component-helper/no-helpertext-spacer.widget'
import { TargetsHelper } from '../_component-helper/_targets.helper'
import { IsFormPropertyRequiredAttributeStringPipe } from '../_pipe/IsRequiredField'
import { MatOption } from '@angular/material/core'

@Component({
  selector: 'ngx-ui-autocomplete-widget',
  templateUrl: './autocomplete.widget.html',
  styleUrls: ['./autocomplete.widget.scss', '../_component-helper/no-helpertext-spacer.widget.scss']
})
export class AutoCompleteWidgetComponent extends NoHelperTextSpacer implements OnInit, AfterViewInit, OnDestroy {

  text: string
  results: string[]
  resultMap: KeyValuePair[]
  resultMapIndex: {}
  valueChangeSub: Subscription

  helper: AutocompleteAsyncHelper

  isLoading: boolean
  filteredOptions: Observable<string[]>

  @ViewChild('autoInputSingleselect') autocompleteInput: MatInput
  @ViewChild('auto') autocomplete: MatAutocomplete
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger

  @ViewChild('autoInputMultiselect') autocompleteInputMultiselect: MatInput
  @ViewChild('chipList') chipList: MatChipList
  multiselectControl: FormControl = new FormControl()
  multiselectValues = []
  separatorKeysCodes: number[] = [ENTER, COMMA]
  selectable = true
  removable = true
  get asMultiselect(): boolean { return ((this.schema.items && this.schema.items.anyOf) || (`${this.schema.type}` === 'array' && (-1 !== ['string', 'number', 'boolean'].indexOf(`${this.schema.items.type}` || 'noitemtypeset')))) }
  @ViewChild('validationMessages') validationMessages: ValidationFieldMessagesComponent

  get forceSelection() {
    return this.schema && this.schema.widget && this.schema.widget.forceSelection
  }

  targetsHelper: TargetsHelper
  constructor(private lookupService: WidgetComponentHttpApiService, private expressionCompiler: ExpressionCompiler
    , private ngZone: NgZone) {
    super()
  }
  /**
   * This prevents this error when creating the autocomplete dynamically
   * <pre>
     ERROR Error: Attempting to open an undefined instance of `mat-autocomplete`.
     Make sure that the id passed to the `matAutocomplete` is correct and that you're attempting to open it after the ngAfterContentInit hook.
   * </pre>
   */
  reAttachAutocomplete_AfterViewInit() {
    this.autocompleteTrigger.autocomplete = this.autocomplete
  }

  /**
   * Update values after search has finished
   */
  updateValuesFromSearch_onComplete() {
    this.filteredOptions = Observable.create(observer => {
      observer.next(this.results)
      observer.complete()
    })
    this.isLoading = false
  }

  ngOnInit(): void {
    this.targetsHelper = new TargetsHelper(this.formProperty, this.expressionCompiler)
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.reAttachAutocomplete_AfterViewInit()

    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe()
    }
    this.valueChangeSub = this.formProperty.valueChanges.subscribe((newValue) => {
      if (!this.asMultiselect) {
        this.updateTargets(newValue)
      } else {// multiselect
        this.multiselectValues = Array.isArray(newValue) ? newValue : [newValue]
      }
    })
    if (!this.asMultiselect) {
      this.control.valueChanges.subscribe(() => {
        this.isLoading = true
        this.search({ query: this.control.value })
      })
    } else {
      /**
       * Handle multiselction widget
       */
      this.multiselectControl.valueChanges.subscribe(() => {
        this.isLoading = true
        this.search({ query: this.multiselectControl.value })
      })
      this.control.valueChanges.subscribe(() => {
        this.multiselectControl.setErrors(this.control.errors, { emitEvent: true })
        this.chipList.errorState = this.multiselectControl.touched && this.multiselectControl.invalid
      })
      this.formProperty.errorsChanges.subscribe((errors) => {
        this.multiselectControl.setErrors(this.control.errors, { emitEvent: true })
        this.chipList.errorState = this.multiselectControl.touched && this.multiselectControl.invalid
      })
      this.multiselectControl.valueChanges.subscribe(() => {
        /**
         * Just update showing the error as helper text.
         * Because the `ngx-ui-field-validation-messages` component will not show errors if not `dirty`
         */
        this.control.markAsDirty()
        this.multiselectControl.setErrors(this.control.errors, { emitEvent: true })
        this.chipList.errorState = this.multiselectControl.touched && this.multiselectControl.invalid
        if (this.chipList.errorState) {
          /**
           * Just update showing the error as helper text.
           * Because the `ngx-ui-field-validation-messages` component will not update errors itself
           */
          this.validationMessages.ngOnInit()
        }
      })
    }
  }

  updateChipListErrorState() {
    if (this.asMultiselect) {
      this.multiselectControl.setErrors(this.control.errors, { emitEvent: true })
      this.chipList.errorState = this.multiselectControl.touched && this.multiselectControl.invalid
    }
  }

  showForceSelectionErrorIfNecessary() {
    const input_required = new IsFormPropertyRequiredAttributeStringPipe().transform(this.formProperty)
    // create error message
    const errorSchema = this.schema.widget.forceSelectionError || {}
    const errorWhenNotRequired = errorSchema.errorWhenNotRequired || false
    const showErrorWhenNotSelected = (input_required || errorWhenNotRequired)
    if (showErrorWhenNotSelected) {
      // Tell the validation that field is not valid due to not selecting item from list
      const errorCode = errorSchema.errorCode || 'OBJECT_MISSING_REQUIRED_PROPERTY'
      const errorMessage = errorSchema.errorMessage || 'Please select item from list'
      const errMsg = {
        code: errorCode,
        path: `#${this.formProperty.path}`,
        message: `${errorMessage}`,
        params: [],
        severity: 'error',
        title: errorMessage
      }
      this.formProperty.extendErrors([errMsg])
      const _errorList = this.formProperty['_errors']
      if (_errorList && _errorList.length) {
        // make sure error is at first position
        _errorList.reverse()
      }
    }
  }

  onInputChange(event) {
    if (this.forceSelection) {
      let valid = false
      let inputValue = event.target.value.trim()
      if (inputValue) {
        if (this.autocomplete.options && this.autocomplete.options.length) {
          for (const option of this.autocomplete.options) {
            if (option.value === inputValue) {
              valid = true
              break
            }
          }
        }
        if (!valid) {
          if (this.asMultiselect) {
            this.autocompleteInputMultiselect.value = ''
          }
          else {
            this.autocompleteInput.value = ''
          }
          this.formProperty.setValue('', true)

          // TODO if it may be necessary to have an `onClear` and an `onModelChange` events then this would be a right spot to call them
          // e.g:
          // this.onClear.emit(event)
          // this.onModelChange(this.value)
        }
        if (!valid) {
          this.showForceSelectionErrorIfNecessary()
        }
      }
    }
  }

  getAutocompleteAsyncHelper(): AutocompleteAsyncHelper {
    if (this.helper) {
      this.helper.ngOnDestroy()
    }
    this.helper = new AutocompleteAsyncHelper(this.name, this.formProperty, this.schema, this.lookupService, this.expressionCompiler);
    return this.helper
  }

  matchExpression(itemValue, queryValue) {
    if (this.schema.widget.matchExpression) {
      let value
      try {
        value = this.expressionCompiler.evaluate(this.schema.widget.matchExpression, { value: itemValue, query: queryValue })
        return value
      } catch (error) {
        console.error(
          'Failed to process match expression:', this.schema.widget.matchExpression,
          ' for value:', itemValue,
          ' and query:', queryValue,
          ' ERROR:', error)
      }
    }
    return 0 === `${itemValue}`.toLowerCase().indexOf(`${queryValue}`.toLowerCase())
  }

  search(event) {
    const preDefinedValues = this.schema.items ? (this.schema.items.anyOf || this.schema.items.oneOf) : null
    if (preDefinedValues) {
      /**
       * use predefined values
       */
      this.results = []
      this.resultMap = []
      this.resultMapIndex = {}

      for (const item of preDefinedValues) {
        if (this.matchExpression(item.description, event.query)) {
          const useKey = item.enum[0] || item.title || item.description
          const useValue = useKey
          this.results.push(useKey)
          this.resultMap.push({ key: useKey, value: useValue })
          this.resultMapIndex[`_${useKey}`] = useValue
        }
      }
      this.updateValuesFromSearch_onComplete()
      return
    }
    /** do asynch autocomplete */
    const helper = this.getAutocompleteAsyncHelper();
    /**
     * Finally add the query replacement
     */
    const additionalReplacements = { '__ac_query__': event.query };
    const onComplete = (keyValueMap, keys) => {
      this.results = []
      this.resultMap = []
      this.results = keys
      this.resultMap = keyValueMap

      this.updateValuesFromSearch_onComplete()
    }
    helper.search(additionalReplacements, onComplete)
  }

  handleDropdown(event) {
    // event.query = current value in input field
    this.search(event)
  }

  onChange(event) {
    this.updateTargets(event)
  }

  onSelect(event) {
    this.selected(event)
    this.updateTargets(event)
  }

  private resetResults() {
    this.results = []
    this.resultMap = []
    this.resultMapIndex = {}
    this.updateValuesFromSearch_onComplete()
  }

  private updateTargets(value: string) {
    if (this.resultMap) {
      if (Array.isArray(this.resultMap)) {
        let resValue = {}
        const resultArray = this.resultMap as []
        for (let i = 0; i < resultArray.length; i++) {
          if (resultArray[i]['key'] === value) {
            resValue = (resultArray[i] || { value: null })['value'] || {}
            break
          }
        }
        this.targetsHelper.setTargetValues(resValue)
        return
      }
      this.targetsHelper.setTargetValues(this.resultMap[value] || {})
    }
  }

  ngOnDestroy(): void {
    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe()
    }
    if (this.helper) {
      this.helper.ngOnDestroy()
    }
  }

  // multiselect - inactive, since no cutom chips can be added by typing text
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add an item
    if ((value || '').trim()) {
      if (!this.unique() || -1 === this.multiselectValues.indexOf(event)) { // duplicates allowed?
        this.multiselectValues.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.multiselectControl.setValue(null);
    this.control.setValue(this.multiselectValues, { emitEvent: true })

    this.resetResults()
  }

  // multiselect
  remove(item: string): void {
    const index = this.multiselectValues.indexOf(item);

    if (index >= 0) {
      this.multiselectValues.splice(index, 1);
      this.control.setValue(this.multiselectValues, { emitEvent: true })
    }

    this.resetResults()
  }

  // multiselect
  selected(event/*: string */): void {
    if (this.autocompleteInputMultiselect) {
      try {
        this.autocompleteInputMultiselect['nativeElement'].value = '';
        this.multiselectControl.setValue(null);
        if (this.checkMax())
          if (!this.unique() || -1 === this.multiselectValues.indexOf(event)) { // duplicates allowed?
            this.multiselectValues.push(event);
            this.control.setValue(this.multiselectValues, { emitEvent: true })
          }
      } catch (e) { console.error('ERROR in autocomplete: ', e) }
    }

    this.resetResults()
  }

  // multiselect
  checkMax() {
    if (this.schema.hasOwnProperty('maxItems')) {
      const remaining = (this.schema.maxItems || 0) - (this.multiselectValues || []).length
      return (remaining > 0)
    }
    return true
  }

  // multiselect
  unique() {// default `true`
    return false !== (this.schema.widget || {}).unique
  }

}