import { ControlWidget, SchemaValidatorFactory } from 'ngx-schema-form'
import { OnDestroy, OnInit } from "@angular/core"
import { AutocompleteAsyncHelper, KeyValuePair } from "./autocomplete-async-helper"
import { WidgetComponentHttpApiService } from "../index"
import { FormProperty } from "ngx-schema-form/lib/model/formproperty"
import { ExpressionCompiler } from '../_service/expression-complier.service';

/**
 * Support selection of items based on schema's <code>oneOf</code> property.<br/>
 * There is support for asyc loading via ajax.<br/>
 <code>
 - append           = When loading the option via ajax by the subsequent settings
 then this will set if any already existing option will
 replaced by the loaded options from ajax call or if
 they just get added at the end of the options list.
 This will only work when loading options asyc via ajax
 by setting min. a value for "serviceUrl"
 - serviceUrl       = The url of the service to make the ajax request to.
 May contain a reference to the query and any other paths of the model.
 This placeholder will be replaced globally in the complete url string.
 The query may be set as placeholder '{__ac_query__}'.
 e.g. https://myservice.com?q={__ac_query__}
 e.g. https://myservice.com?q={__ac_query__}&email={mymodel.email}&name={mymodel.name}

 - resultExpression = Must name the object in result that contains the array of result elements.
 An object 'data' is passed which is the json result from request.
 e.g. "data.entries"

 - labelExpression  = Must create a string value as the label to show in the dropdown.
 An object 'item' is passed for every element of the result.
 e.g. "item.name + ' ' + item.age"

 - valueExpression  = Must create a string value as the value to be set when an option is selected from the dropdown.
 An object 'item' is passed for every element of the result.
 e.g. "item.id + ' ' + item.name"

- precheckExpressions = Set to <code>true</code> will check the syntax of
                        the <code>labelExpression</code>, <code>valueExpression</code> and <code>resultExpression</code>
                        and show resulting errors in console.
                        Keep in mind to NOT USE IN PRODUCTION!!!
                        Since it make vulnerable to access global variables.
 - serviceOptions     This service configuration allows to submit a POST for an autocompletion.
 and will be ignored if serviceUrl is set.

 Reference is HttpApiServiceOptions
 {
                            headers?: HttpHeaders | {[header: string]: string | string[]}
                            params?: HttpParams | {[param: string]: string | string[]}
                            withCredentials?: boolean
                            body?: any
                            method?: 'GET' | 'get' | 'POST' | 'post'
                        }

 example:
 <pre>
 "serviceOptions": {
                "method": "POST",
                "headers": {
                  "X-ApiKey": "${apiKey}",
                  "content-type":"application/json",
                  "accept":"application/json",
                  "X-MyHeader": "{mymodel.userId}"
                },
                "params": {
                  "q": "{__ac_query__}",
                  "city": "{mymodel.city}",
                  "country":"{mymodel.country}"
                },
                "withCredentials": true,
                "body": {
                          "q": "{__ac_query__}",
                          "email": "{mymodel.email}",
                          "name": "{mymodel.name}"
                        }
              }
 </pre>
 </code>
 */
export abstract class AsyncSelectionWidgetComponent extends ControlWidget implements OnInit, OnDestroy {

  selectOptions: Array<any>
  selectedOption: string

  helper: AutocompleteAsyncHelper
  loadingState: boolean

  protected constructor(protected schemaValidatorFactory: SchemaValidatorFactory, protected lookupService: WidgetComponentHttpApiService, protected expressionCompiler: ExpressionCompiler) {
    super()
  }

  /**
   * Will load the initial options to render in the selection element
   */
  ngOnInit(): void {
    this.reload()
    this.control.registerOnChange((newValue: any) => {
      this.selectedOption = newValue
    })
  }

  /**
   * Gets called whether a static list of items has been loaded or
   * the async loading process is finished.<br/>
   * Gets even called when no items are defined in schemas <code>oneOf</code>.<br/>
   */
  protected onLoadingInitialOptionsReady() {

  }

  /**
   * Gets called when loading options via ajax is done
   */
  protected onLoadingInitialOptionsAjaxStarted() {

  }

  loadInitialOptions(skipLazyLoadingViaAjax?: boolean): void {
    const lazyLoading = !skipLazyLoadingViaAjax && this.schema.widget && this.schema.widget.serviceUrl
    this.selectOptions = []
    if (!lazyLoading) {
      this.selectOptions = this.createOptionsModel
      this.loadingState = false
      this.onLoadingInitialOptionsReady()
    } else if (lazyLoading) {
      this.onLoadingInitialOptionsAjaxStarted()
      this.loadInitialOptionsAjax()
    } else {
      this.loadingState = false
      this.onLoadingInitialOptionsReady()
    }
  }

  /**
   * This is required to prevent from updating unnecessarily.
   * This may be called a missconception at PrimeNG,
   * because the dropdown doesn't support the use of a custom model
   * and event the <code>SelectionModel</code> is not checked for changes.
   */
  private requiresRecreateOptionsmodel() {
    let currentOptions = this.schema.oneOf
    if ((this.schema.oneOf || []).length) {
    } else if ((this.schema.enum || []).length) {
      currentOptions = this.schema.enum
    }
    const needUpdate = /** check options is empty */(!(this.selectOptions || []).length) || /** or if options are already rendered */(!this.formProperty['__optionsmodelSignature'] || JSON.stringify(currentOptions) !== this.formProperty['__optionsmodelSignature'])
    return needUpdate
  }
  /**
   * Since we must use the PrimeNG Model for options,
   * there is a need to detect changes.<br/>
   * Otherwise the UI will not update.<br/>
   * This will store a signature of the options as property <code>__optionsmodelSignature</code>
   * into the <code>FormProperty</code>
   */
  get createOptionsModel() {
    if (this.requiresRecreateOptionsmodel()) {
      this.selectOptions = []
      if ((this.schema.oneOf || []).length) {
        for (let i = 0; i < this.schema.oneOf.length; i++) {
          const option = {
            "label": (this.schema.oneOf[i].description || this.schema.oneOf[i].enum[0]),
            "value": this.schema.oneOf[i].enum[0],
          }
          if (this.schema.oneOf[i].readOnly){
            option['readOnly'] = this.schema.oneOf[i].readOnly
            /** primeng SelectItem API requires property 'disabled' */
            option['disabled'] = this.schema.oneOf[i].readOnly
          }
          this.selectOptions.push(option)
        }
        this.formProperty['__optionsmodelSignature'] = JSON.stringify(this.schema.oneOf)
      }
      else if ((this.schema.enum || []).length) {
        for (let i = 0; i < this.schema.enum.length; i++) {
          this.selectOptions.push({
            "label": this.schema.enum[i],
            "value": this.schema.enum[i]
          })
        }
        this.formProperty['__optionsmodelSignature'] = JSON.stringify(this.schema.oneOf)
      }
    }
    return this.selectOptions
  }

  loadInitialOptionsAjax(): void {
    this.loadingState = true
    const helper = this.getAutocompleteAsyncHelper();
    helper.search({}, (keyValues: KeyValuePair[], keys: string[]) => {
      const append = (this.schema.widget || {}).append
      const oneOf = append ? (this.schema.oneOf || []) : []
      for (const itemKeyValue of keyValues) {
        const item = {
          'enum': [`${itemKeyValue.value}`],
          'description': `${itemKeyValue.key}`,
          '______lazy': true
        }
        oneOf.push(item)
      }
      this.schema.oneOf = oneOf
      this.loadingState = false
      this.updateValidator(this.formProperty, this.formProperty.parent, [this.formProperty.path])
      /**
       * reload the options and
       * trigger ready state
       */
      this.loadInitialOptions(true)
    })
  }

  private invalidateParentsSchema(current: FormProperty, parent: FormProperty, path: string[]) {
    // keep this snippet just for the day when a solution is coming...<br/>
    if (parent) {
      let _prop = parent.schema
      for (let i = path.length - 1; i >= 0; i--) {
        const segment = path[i].replace('/', '').replace('#', '')
        _prop = _prop['properties'][segment]
        if (!_prop) {
          break
        }
      }
      if (current) {
        _prop.oneOf = current.schema.oneOf
        parent.schema = Object.assign({}, parent.schema)
      }
      path.push(parent.path)

      this.invalidateParentsSchema(current, parent.parent, path)
    }
  }

  private updateValidator(current: FormProperty, parent: FormProperty, path: string[]) {
    /**
     * WORKAROUND REQUIRED:
     * Z-Schema is using a cache for all already validated schema <br/>
     * where only the key is a reference but the value of the schema is a deep clone.<br/>
     * So any change made in schema after bootstrap will not be recognized by z-schema validation,<br/>
     * because the changes don't make it into the cloned copy of the schema.<br/>
     * @see https://github.com/zaggino/z-schema/blob/master/src/SchemaCache.js#exports.getSchemaByReference
     */
    /**
     * WORKAROUND
     * Reset the schema validator so the new items get recognized.<br/>
     */
    if (typeof this.schemaValidatorFactory['reset'] === 'function') {
      this.schemaValidatorFactory['reset']()
    }
    /**
     * What won't work for the WORKAROUND above:<br/>
     * Replacing the parent.schema with a JSON copy and adding an additional property<br/>
     * would valid right becauce the reference has changed<br/>
     * but it would also cause an infinitive component reloading.<br/>
     * <br/>
     * So DON'T do this here:<br/>
     * <code>parent.schema['___z-schema-fix']=`${+new Date()}`</code>
     * <code>parent.schema = JSON.parse(JSON.stringify(parent.schema))</code>
     */
  }

  getAutocompleteAsyncHelper(): AutocompleteAsyncHelper {
    if (this.helper) {
      this.helper.ngOnDestroy()
    }
    this.helper = new AutocompleteAsyncHelper(this.name, this.formProperty, this.schema, this.lookupService, this.expressionCompiler)
    return this.helper
  }

  ngOnDestroy(): void {
    if (this.helper) {
      this.helper.ngOnDestroy()
    }
  }

  reload(event?: any) {
    /**
     * make sure any existing lazy loaded item gets removed
     */
    if (this.schema.oneOf) {
      // restore state
      const items = []
      for (let i = 0; i < (this.schema.oneOf || []).length; i++) {
        if (!this.schema.oneOf[i]['______lazy']) {
          items.push(this.schema.oneOf[i])
        }
      }
      this.schema.oneOf = items
    }
    // reload
    this.loadInitialOptions()
  }

}
