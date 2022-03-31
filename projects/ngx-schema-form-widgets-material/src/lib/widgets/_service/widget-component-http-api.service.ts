import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import {Observable} from "rxjs";

/**
 * Simple ajax helper class.<br/>
 */
@Injectable()
export class WidgetComponentHttpApiService {
    constructor(private _httpClient: HttpClient) {

    }

    request(url: string, options: HttpApiServiceOptions): Observable<any> {
        const httpOptions = {
            headers: options.headers,
            params: options.params,
            withCredentials: options.withCredentials,
            body: options.body
        }
        return this._httpClient
            .request(options.method || HttpApiServiceOptions.defaultMethod, url, httpOptions)
    }
}

export class HttpApiServiceOptions {
    static defaultMethod: string = 'GET'
    set defaultMethod(value) {
        // readonly value!
    }

    headers?: HttpHeaders | {
        [header: string]: string | string[];
    }
    params?: HttpParams | {
        [param: string]: string | string[];
    }
    withCredentials?: boolean
    body?: any
    method?: 'GET' | 'get' | 'POST' | 'post' = 'GET'
}
