import {Component} from '@angular/core'
import {ButtonWidget} from 'ngx-schema-form'
import {SeverityNameConverterPipe} from '../_converters/_severity/SeverityNames'
import {IconNameConverterPipe} from '../_converters/_icon/IconNames'

@Component({
  selector: 'ngx-ui-button-widget',
  templateUrl: './button.widget.html',
  styleUrls: ['./button.widget.scss'],
  providers: [IconNameConverterPipe, SeverityNameConverterPipe]
})
export class ButtonWidgetComponent extends ButtonWidget {

}
