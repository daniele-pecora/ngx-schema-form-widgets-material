import {Injectable} from '@angular/core'
import {ErrorHandler} from '@angular/core'
/**
 * Created by daniele on 17.04.17.
 */

@Injectable()
export class AppErrorHandler extends ErrorHandler {
  constructor() {
    // The true paramter tells Angular to rethrow exceptions, so operations like 'bootstrap' will result in an error
    // when an error happens. If we do not rethrow, bootstrap will always succeed.
    super();
  }

  handleError(error) {
    // handle the error

    // delegate to the default handler
    super.handleError(error);
  }
}
