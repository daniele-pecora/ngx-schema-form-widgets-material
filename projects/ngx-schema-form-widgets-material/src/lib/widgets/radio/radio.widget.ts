import {Component} from '@angular/core';
import {ControlWidget} from 'ngx-schema-form'


@Component({
  selector: 'ngx-ui-radio-widget',
  templateUrl: './radio.widget.html',
  styleUrls: ['./radio.widget.scss']
})
export class RadioWidgetComponent extends ControlWidget {
  createRadioId(radioValue: any) {
    return `${this.id}__${radioValue}`.replace(new RegExp('[\\s]+', 'ig'), '_')
  }
}
