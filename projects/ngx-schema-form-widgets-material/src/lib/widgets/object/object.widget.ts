/**
 * Created by daniele on 27.09.17
 */
import {Component} from "@angular/core"
import {ObjectLayoutWidget} from "ngx-schema-form"
import {IconNameConverterPipe} from '../_converters/_icon/IconNames'
import {SeverityNameConverterPipe} from '../_converters/_severity/SeverityNames'


@Component({
  selector: 'ngx-ui-object-widget',
  templateUrl: './object.widget.html',
  /** must be provided to create instances of 'select-card' widgets */
  providers: [IconNameConverterPipe, SeverityNameConverterPipe]
})
export class ObjectWidgetComponent extends ObjectLayoutWidget {

}
