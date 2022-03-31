import {Component} from '@angular/core'
import {ButtonWidget} from 'ngx-schema-form'
import {SeverityNameConverterPipe} from '../_converters/_severity/SeverityNames'
import {IconNameConverterPipe} from '../_converters/_icon/IconNames'

@Component({
  selector: 'ngx-ui-button-widget',
  templateUrl: './button.widget.html',
  styleUrls: ['./button.widget.scss'],
  providers: [IconNameConverterPipe, SeverityNameConverterPipe],
  host: {
    '[class.buttonMargin]': 'isNotInline()',
    '[class.reduceSpace]': 'isReduceSpace()',
  }
})
export class ButtonWidgetComponent extends ButtonWidget {
  isNotInline() {
    const button = this.button || {}
    if (button.position && button.position.h === 'right') {
      return false
    }
    return true
  }
  isReduceSpace() {
    const button = this.button || {}
    return (button.position && (button.position.v === 'middle' ||  button.position.v === 'top'))
  }
}
