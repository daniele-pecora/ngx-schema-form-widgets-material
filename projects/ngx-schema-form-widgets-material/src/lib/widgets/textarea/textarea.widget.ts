/**
 * Created by daniele on 27.09.17
 */
import {Component} from '@angular/core';
import {ControlWidget} from 'ngx-schema-form';

@Component({
  selector: 'ngx-ui-textarea-widget',
  templateUrl: './textarea.widget.html',
  styleUrls: ['./textarea.widget.scss']
})
export class TextAreaWidgetComponent extends ControlWidget {
}
