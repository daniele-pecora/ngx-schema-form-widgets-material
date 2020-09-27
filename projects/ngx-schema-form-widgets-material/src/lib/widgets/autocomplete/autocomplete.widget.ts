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
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

@Component({
  selector: 'ngx-ui-autocomplete-widget',
  templateUrl: './autocomplete.widget.html',
  styleUrls: ['./autocomplete.widget.scss']
})
export class AutoCompleteWidgetComponent extends ControlWidget implements OnInit, AfterViewInit, OnDestroy {

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
  // @ViewChild('autoMultiselect') autocompleteMultiselect: MatAutocomplete
  // @ViewChild(MatAutocompleteTrigger) autocompleteTriggerMultiselect: MatAutocompleteTrigger
  @ViewChild('chipList') chipList: MatChipList
  multiselectControl: FormControl = new FormControl()
  multiselectValues = []
  separatorKeysCodes: number[] = [ENTER, COMMA]
  selectable = true
  removable = true
  get asMultiselect(): boolean { return ((this.schema.items && this.schema.items.anyOf) || (`${this.schema.type}` === 'array' && (-1 !== ['string', 'number', 'boolean'].indexOf(`${this.schema.items.type}` || 'noitemtypeset')))) }
  errorStateMatcher = new MyErrorStateMatcher()

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
    //this.autocompleteTriggerMultiselect.autocomplete = this.autocompleteMultiselect
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
      this.multiselectControl.valueChanges.subscribe(() => {
        this.isLoading = true
        this.search({ query: this.multiselectControl.value })
      })
      // error passing
      const udpateStates = () => {
        if (this.multiselectControl.touched) {
          this.control.markAsTouched()
        }
        if (this.multiselectControl.dirty) {
          this.control.markAsDirty()
        }
        if (this.multiselectControl.pristine) {
          this.control.markAsPristine()
        }
        if (this.multiselectControl.untouched) {
          this.control.markAsUntouched()
        }
        if (this.multiselectControl.pending) {
          this.control.markAsPending()
        }
        this.updateChipListErrorState()
      }
      // now it shows an error but at the beginning it...
      // TODO still not showing error text ....
      this.control.valueChanges.subscribe(() => {
        this.ngZone.run(()=>{
        this.control.markAsTouched()
        this.multiselectControl.markAsTouched()
        udpateStates()
        console.log('this.control.valueChanges.subscribe(() => {', this.control, this.multiselectControl,
        this.formProperty)
        })
      })

      this.formProperty.errorsChanges.subscribe(() => {
        this.multiselectControl.setErrors(this.control.errors, { emitEvent: true })
      })
/*
      this.multiselectControl.valueChanges.subscribe(() => {
        this.chipList.errorState = this.control.invalid && this.multiselectControl.touched
        this.multiselectControl.setErrors(this.control.errors, { emitEvent: true })
      })
*/
    }
  }

  updateChipListErrorState() {
    if (this.asMultiselect) {
      this.chipList.errorState = this.control.invalid
      this.multiselectControl.setErrors(this.control.errors, { emitEvent: true })
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
      // if(event.query)
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

  onSelect(event) {this.selected(event)
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
        this.setTargetValues(resValue)
        return
      }
      this.setTargetValues(this.resultMap[value] || {})
    }
  }

  private setTargetValues(resultItem: any) {
    const targets = (this.schema.widget || {})['targets'];
    if ((targets || []).length) {
      for (const target of targets) {
        const targetKeys = Array.isArray(target.key) ? target.key : [target.key];
        for (const targetKey of targetKeys) {
          const destinationTarget = target.destination;
          const valueSet = this.setTargetVal(resultItem, destinationTarget, targetKey);
          if (valueSet !== undefined && valueSet !== null) {
            break
          }
        }
      }
    }
  }

  private setTargetVal(resultItem: any, targetPath: string, destProperty: string): any | void {
    const targetPaths = Array.isArray(targetPath) ? targetPath : [targetPath]
    for (const _targetPath of targetPaths) {
      const target = this.formProperty.findRoot().getProperty(_targetPath) as FormProperty
      if (target) {
        let value
        try {
          value = this.expressionCompiler.evaluate(destProperty, resultItem)
        } catch (error) {
          console.error(
            'Failed to process expression from targetPath:', _targetPath,
            ' for destProperty:', destProperty,
            ' from resultItem:', resultItem,
            ' ERROR:', error)
        }
        target.setValue(value, false)
        if (value !== undefined && value !== null) {
          return value
        }
      }
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
  unique(){// default `true`
    return false !== (this.schema.widget || {}).unique
  }

}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    // const isSubmitted = form && form.submitted;
    const errorState = control && control.touched && control.invalid
    console.log('##MyErrorStateMatcher## isErrorState:', errorState, control)
    return errorState;
  }
}