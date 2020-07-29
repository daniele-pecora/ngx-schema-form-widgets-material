import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {ControlWidget} from 'ngx-schema-form'
import {FormProperty} from 'ngx-schema-form/lib/model/formproperty'
import { WidgetComponentHttpApiService} from '../_service/widget-component-http-api.service'
import {Subscription, Observable} from 'rxjs'
import {AutocompleteAsyncHelper} from "../_base/autocomplete-async-helper"
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { ExpressionCompiler } from '../_service/expression-complier.service'

@Component({
  selector: 'ngx-ui-autocomplete-widget',
  templateUrl: './autocomplete.widget.html',
  styleUrls: ['./autocomplete.widget.scss']
})
export class AutoCompleteWidgetComponent extends ControlWidget implements OnInit, AfterViewInit, OnDestroy {

  text: string;
  results: string[];
  resultMap: {};
  valueChangeSub: Subscription;

  helper: AutocompleteAsyncHelper;

  isLoading: boolean
  filteredOptions: Observable<string[]>

  @ViewChild('autoInput') autocompleteInput: MatInput
  @ViewChild('auto') autocomplete: MatAutocomplete
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger

  constructor(private lookupService: WidgetComponentHttpApiService, private expressionCompiler: ExpressionCompiler) {
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

  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.reAttachAutocomplete_AfterViewInit()

    if (this.valueChangeSub) {
      this.valueChangeSub.unsubscribe()
    }
    this.valueChangeSub = this.formProperty.valueChanges.subscribe((newValue) => {
      this.updateTargets(newValue)
    })
    this.control.valueChanges.subscribe(() => {
      this.isLoading = true
      this.search({query:this.control.value})
    })
  }

  getAutocompleteAsyncHelper(): AutocompleteAsyncHelper {
    if (this.helper) {
      this.helper.ngOnDestroy()
    }
    this.helper = new AutocompleteAsyncHelper(this.name, this.formProperty, this.schema, this.lookupService, this.expressionCompiler);
    return this.helper
  }

  search(event) {
    const helper = this.getAutocompleteAsyncHelper();
    /**
     * Finally add the query replacement
     */
    const additionalReplacements = {'__ac_query__': event.query};
    const onComplete = (keyValueMap, keys) => {
      this.results = [];
      this.resultMap = {};
      this.results = keys;
      this.resultMap = keyValueMap

      this.updateValuesFromSearch_onComplete()
    }
    helper.search(additionalReplacements, onComplete)
  }

  handleDropdown(event) {
    // event.query = current value in input field
  }

  onChange(event) {
    this.updateTargets(event)
  }

  onSelect(event) {
    this.updateTargets(event)
  }

  private updateTargets(value: string) {
    if (this.resultMap) {
      if (Array.isArray(this.resultMap)) {
        let resValue = {}
        const resultArray = this.resultMap as []
        for (let i = 0; i < resultArray.length; i++) {
          if (resultArray[i]['key'] === value) {
            resValue = (resultArray[i] || { value: null }).value || {}
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
        } catch(error) {
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

}
