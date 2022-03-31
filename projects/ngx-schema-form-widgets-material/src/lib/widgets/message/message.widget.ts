import {Component} from '@angular/core'
import {ObjectLayoutWidget} from 'ngx-schema-form';
import {SeverityNameConverterPipe} from '../_converters/_severity/SeverityNames'
import {IconNameConverterPipe} from '../_converters/_icon/IconNames'

@Component({
  selector: 'ngx-ui-message-widget',
  templateUrl: './message.widget.html',
  styleUrls: ['./message.widget.scss'],
  providers: [IconNameConverterPipe, SeverityNameConverterPipe]
})
export class MessageWidgetComponent extends ObjectLayoutWidget {

  constructor(private iconNameConverter?: IconNameConverterPipe, private severityNameConverter?: SeverityNameConverterPipe) {
    super()
  }

  getSeverity(value: string) {
    if (this.severityNameConverter && value) {
      return this.severityNameConverter.transform(value)
    }
    return value
  }

  getIcon(value: string) {
    if (this.iconNameConverter && value) {
      return this.iconNameConverter.transform(value)
    }
    return value
  }
}
