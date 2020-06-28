import {Injectable} from '@angular/core'
import {forkJoin, Observable, throwError} from 'rxjs'
import {map, catchError} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http';

/**
 * @deprecated Use WidgetComponentHttpApiService instead
 * Simple ajax helper class.<br/>
 */
@Injectable()
export class WidgetComponentApiService {
    constructor(public _http: HttpClient) {

  }

  /**
   * whatever domain/feature method name
   */
  get(url: string, options?: any): Observable<any> {
    return this._http.get(url, options)
      .pipe(
        // map(res => res.json()),
        catchError(err => {
          console.error('Error: ', err);
          return throwError(err);
        })
      );
  }

  /**
   * <pre>
   .subscribe(results => {
        url_0_content = results[0]
        url_01_content = results[1]
         ...
      });
   * </pre>
   * @param {Array<string>} urls
   * @param options
   * @returns {Observable<any[]>}
   */
  getAll(urls: Array<string>, options?: any): Observable<any> {
    const resultsObjects: Array<any> = []
    for (let i = 0; i < urls.length; i++) {
      resultsObjects.push(
        this._http.get(urls[i])
          .pipe(
            //map(res => res.json())
          )
      )
    }
    return forkJoin(resultsObjects)
  }


  /**
   * GET
   * whatever domain/feature method name
   * @param {string} url
   * @param options
   * @returns {Observable<any | any>}
   */
  getJSONResult(url: string, options?: any): Observable<any> {
    return this._http.get<any>(url, options)
      .pipe(
        // map(res => res.json()),
        catchError(err => {
          return throwError(err);
        }));
  }

  /**
   * GET
   * whatever domain/feature method name
   * @param {string} url
   * @param options
   * @returns {Observable<any | any>}
   */
  getResult(url: string, options?: any): Observable<any> {
    return this._http.get(url, options)
      .pipe(
        // map(res => res)
        catchError(err => {
          return throwError(err);
        }));
  }

  /**
   * GET or POST only.<br/>
   * Has to be set in {options} as property {options.method}
   * @param {string} url
   * @param options should contain the request headers
   * @returns {Observable<any | any>}
   */
  requestJSON(url: string, options?: any): Observable<any> {

    options = options || {}

    const headers = options.headers || {}
    headers['Content-Type'] = 'application/json'
    headers["Accept"] = "application/json"
    options.method = options.method || 'GET'
    /** enable setting and resending cookies*/
    options.withCredentials = true

    return this._http.request(options.method, url, options)
      .pipe(
        //map(res => res.json()),
        catchError(err => {
          return throwError(err);
        }));
  }

}
