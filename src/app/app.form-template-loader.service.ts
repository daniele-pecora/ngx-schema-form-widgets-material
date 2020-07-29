import {Injectable} from '@angular/core'
import {Actions, Bindings, Mappings, UIFormViewHelper, Validators} from 'ngx-schema-form-view'
import {UIFormViewModel} from 'ngx-schema-form-view'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {forkJoin, of, from as fromPromise} from 'rxjs'
import {environment} from '../environments/environment';

declare var System: any

@Injectable()
export class AppFormTemplateService {

  constructor(private http: HttpClient) {
  }

  private createPath(pathString: string) {
    let __path = pathString
    if (__path) {
      __path = __path.endsWith('/') ? pathString : (`${pathString}/`)
    }
    return __path
  }

  public getFinalModel(modelObject: object, schemaObject: object, mapperObject: object): object {
    return new UIFormViewHelper().getFinalModel(modelObject, mapperObject, schemaObject)
  }

  /**
   *
   * @param assetsPath assets directory path
   * @param templateId directory name in asserts directory where the template files
   *                            <code>schema.json, schemForm.json, validator.ts, action.ts, mapper.ts</code>are located
   * @param envValueResolver any function to make some string replacement
   * @returns
   */
  public loadFormTemplate(assetsPath: string, templateId: string,
                          envValueResolver?: (string) => string): Observable<UIFormViewModel> {
    return this.loadAllFromTemplateUrl(assetsPath, templateId, envValueResolver)
  }

  private loadAllFromTemplateUrl(assetsPath: string, templateId: string,
                                 envValueResolver?: (string) => string): Observable<UIFormViewModel> {
    const assetsPathSegment = this.createPath(assetsPath)
    const path = this.createPath(`${assetsPathSegment}${templateId}`)
    return this.loadSchemaSchemaformActionsValidatorMappingsBindings(path)
  }

  protected loadSchemaSchemaformActionsValidatorMappingsBindings(path: string): Observable<UIFormViewModel> {
    let formSchema: any = {}
    let formSchemaform: any = {}
    let formModel: any = {}
    let formMapper: any = {} as Mappings
    let formValidators: any = {} as Validators
    let formActions: any = {} as Actions
    let formBindings: any = {} as Bindings

    // TODO debug-log which file has been loaded or not
    return Observable.create(observer => {
        const failOver = (error) => {
          if (!environment.production) {
            console.error('[ ### Not running in production mode log warning ### ]', error)
          }
          return of(null)// of({error: error})
        }
        forkJoin(
          [
            fromPromise(System.import(`${path}schema.json`))
              .toPromise()
              .catch((err) => of(failOver(err))),
            fromPromise(System.import(`${path}schemaform.json`))
              .toPromise()
              .catch((err) => of(failOver(err))),
            fromPromise(System.import(`${path}model.json`))
              .toPromise()
              .catch((err) => of(failOver(err))),
            fromPromise(System.import(`${path}action.ts`))
              .toPromise()
              .catch((err) => of(failOver(err))),
            fromPromise(System.import(`${path}validation.ts`))
              .toPromise()
              .catch((err) => of(failOver(err))),
            fromPromise(System.import(`${path}mapper.ts`))
              .toPromise()
              .catch((err) => of(failOver(err))),
            fromPromise(System.import(`${path}bindings.ts`))
              .toPromise()
              .catch((err) => of(failOver(err)))
          ]
        ).subscribe((results:any) => {
          /**
           * TODO Wait for Fix: RxJs Immutable Observable
           * since RxJs returns an immutable value as Observables in subscribe,
           * the result object must be cloned to be mutable again
           * (see: https://github.com/500tech/angular-tree-component/issues/220)
           */
          const schemaFile = this.___fix___make_sure_json_does_not_get_loaded_as_module(results[0])
          const schemaformFile = this.___fix___make_sure_json_does_not_get_loaded_as_module(results[1])
          const modelFile = this.___fix___make_sure_json_does_not_get_loaded_as_module(results[2])
          const actionFile = this.___fix___make_sure_object_does_not_get_loaded_as_module(results[3])
          const validationFile = this.___fix___make_sure_object_does_not_get_loaded_as_module(results[4])
          const mapperFile = this.___fix___make_sure_object_does_not_get_loaded_as_module(results[5])
          const bindingFile = this.___fix___make_sure_object_does_not_get_loaded_as_module(results[6])
          formSchema = schemaFile || {}
          formSchemaform = schemaformFile || {}
          formModel = modelFile || {}
          formActions = {}
          if (actionFile) {
            formActions = actionFile['actions'] as Actions
          }
          formValidators = {}
          if (validationFile) {
            formValidators = validationFile['validations'] as Validators
          }
          formMapper = {}
          if (mapperFile) {
            formMapper = mapperFile['mapper'] as Mappings
          }
          formBindings = {}
          if (bindingFile) {
            formBindings = bindingFile['bindings']  as Bindings
          }
          /**
           * TODO It sould also be possible to get the values as a whole content
           * if no <code>const (actions|validations|mapper|bindings)</const>
           * has been exported directly as <code>export default ...</code>
           * E.G:
           * <pre>
           *     formBindings = (bindingFile['bindings']||bindingFile)  as Bindings
           * </pre>
           */
          const uiFormViewModel: UIFormViewModel = {
            schemaObject: formSchema,
            formModelObject: formSchemaform,
            modelObject: formModel,
            validatorsObject: formValidators,
            actionsObject: formActions,
            mapperObject: formMapper,
            bindingsObject: formBindings
          }
          observer.next(uiFormViewModel)
          observer.complete()
          return uiFormViewModel
        }, (error) => {
          console.error(error)
        })
      }
    )
  }

  /**
   * What is this?<br/>
   * <strong>Explaination</strong> <br/>
   * When loading objects via <code>System.import</code> they naturally get loaded as <code>Module</code>.<br/>
   * A module will contain much more methods and properties than you intentionally did expect.<br/>
   * On top of that some properties are even made read only and you will fail setting them at runtime.</br>
   * Here we return only the origing object or a copy of it, that doesn't contain any additions made by <code>System.import</code>.<br/>
   * (see also : https://github.com/500tech/angular-tree-component/issues/220)
   *
   * @param {object} loaded_module
   * @returns {object}
   * @private
   */
  private ___fix___make_sure_object_does_not_get_loaded_as_module(loaded_module: object): object {
    return Object.assign({}, loaded_module)
  }

  /**
   * What is this?<br/>
   * <strong>Explaination</strong> <br/>
   * When loading objects via <code>System.import</code> they naturally get loaded as <code>Module</code>.<br/>
   * A module will contain much more methods and properties than you intentionally did expect.<br/>
   * On top of that some properties are even made read only and you will fail setting them at runtime.</br>
   * Here we return only the origing object or a copy of it, that doesn't contain any additions made by <code>System.import</code>.<br/>
   * (see also : https://github.com/500tech/angular-tree-component/issues/220)
   *
   * @param {object} loaded_module
   * @returns {object}
   * @private
   */
  private ___fix___make_sure_json_does_not_get_loaded_as_module(loaded_module: object): object {
    // the original object ist stored in a property 'default'
    return JSON.parse(JSON.stringify(Object.assign({}, loaded_module['default'] || loaded_module)))
  }

  /**
   * <pre>
   .subscribe(results => {
        url_0_content = results[0]
        url_01_content = results[1]
         ...
      })
   * </pre>
   * @param urls
   * @param options
   * @returns
   */
  getAll(urls: Array<string>, options ?: any): Observable<any> {
    const resultsObjects: Array<any> = []
    for (let i = 0; i < urls.length; i++) {
      resultsObjects.push(this.http.get(urls[i]))
    }
    return forkJoin(resultsObjects)
  }
}
