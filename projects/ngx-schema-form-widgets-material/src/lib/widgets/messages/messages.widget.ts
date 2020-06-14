import {Component} from '@angular/core'
import {ObjectLayoutWidget} from 'ngx-schema-form';
import {SeverityNameConverterPipe} from '../_converters/_severity/SeverityNames'
import {IconNameConverterPipe} from '../_converters/_icon/IconNames'

@Component({
  selector: 'ngx-ui-messages-widget',
  templateUrl: './messages.widget.html',
  styleUrls: ['./messages.widget.scss'],
  providers: [IconNameConverterPipe, SeverityNameConverterPipe]
})
export class MessagesWidgetComponent extends ObjectLayoutWidget {
  msgs: any

  constructor(private iconNameConverter?: IconNameConverterPipe, private severityNameConverter?: SeverityNameConverterPipe) {
    super()
  }

  ngAfterViewInit() {
    this.msgs = []
    if (this.schema.widget.msgs) {
      for (const msg of this.schema.widget.msgs) {
        if (msg)
          this.msgs.push({
            severity: this.getSeverity(msg.severity || ''),
            summary: msg.title,
            detail: msg.text
          })
      }
    }
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
