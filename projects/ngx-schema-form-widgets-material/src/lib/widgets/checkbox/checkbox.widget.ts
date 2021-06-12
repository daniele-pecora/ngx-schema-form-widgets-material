/**
 * Created by daniele on 27.09.17
 */
import {Component} from "@angular/core";
import {ControlWidget} from "ngx-schema-form";
import { NoHelperTextSpacer } from "../_component-helper/no-helpertext-spacer.widget";

@Component({
  selector: 'ngx-ui-checkbox-widget',
  templateUrl: './checkbox.widget.html',
  styleUrls: ['./checkbox.widget.scss', './space.fix.scss', '../_component-helper/no-helpertext-spacer.widget.scss']
})
export class CheckboxWidgetComponent extends NoHelperTextSpacer {
}