/**
 * Created by daniele on 27.09.17
 */
import {Component} from '@angular/core';
import {ControlWidget} from 'ngx-schema-form'


@Component({
  selector: 'ngx-ui-integer-widget',
  templateUrl: './integer.widget.html',
  styleUrls: ['./integer.widget.scss']
})
export class IntegerWidgetComponent extends ControlWidget {
}
