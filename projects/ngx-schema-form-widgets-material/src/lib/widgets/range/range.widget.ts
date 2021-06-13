import {Component} from '@angular/core';
import {ControlWidget} from 'ngx-schema-form'
import { NoHelperTextSpacer } from '../_component-helper/no-helpertext-spacer.widget';


@Component({
  selector: 'ngx-ui-range-widget',
  templateUrl: './range.widget.html',
  styleUrls: ['./range.widget.scss', '../_component-helper/no-helpertext-spacer.widget.scss']
})
export class RangeWidgetComponent extends NoHelperTextSpacer {
}
