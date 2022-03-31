/**
 * Created by daniele on 27.09.17
 */
import {Component} from '@angular/core';
import {ControlWidget} from 'ngx-schema-form';
import { NoHelperTextSpacer } from '../_component-helper/no-helpertext-spacer.widget';

@Component({
  selector: 'ngx-ui-textarea-widget',
  templateUrl: './textarea.widget.html',
  styleUrls: ['./textarea.widget.scss', '../_component-helper/no-helpertext-spacer.widget.scss']
})
export class TextAreaWidgetComponent extends NoHelperTextSpacer {
}
