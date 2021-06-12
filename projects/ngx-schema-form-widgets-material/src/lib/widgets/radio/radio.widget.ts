import {Component} from '@angular/core';
import {ControlWidget} from 'ngx-schema-form'
import { NoHelperTextSpacer } from '../_component-helper/no-helpertext-spacer.widget';


@Component({
  selector: 'ngx-ui-radio-widget',
  templateUrl: './radio.widget.html',
  styleUrls: ['./radio.widget.scss', NoHelperTextSpacer.RELATIVE_STYLE_URL]
})
export class RadioWidgetComponent extends NoHelperTextSpacer {
  createRadioId(radioValue: any) {
    return `${this.id}__${radioValue}`.replace(new RegExp('[\\s]+', 'ig'), '_')
  }
}
