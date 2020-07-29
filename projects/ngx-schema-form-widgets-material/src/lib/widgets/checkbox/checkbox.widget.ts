/**
 * Created by daniele on 27.09.17
 */
import {Component} from "@angular/core";
import {ControlWidget} from "ngx-schema-form";

@Component({
  selector: 'ngx-ui-checkbox-widget',
  templateUrl: './checkbox.widget.html',
  styleUrls: ['./checkbox.widget.scss']
})
export class CheckboxWidgetComponent extends ControlWidget {
}
