import {Component} from '@angular/core';
import {ActionRegistry} from 'ngx-schema-form'
import {ActionObjectLayoutWidgetComponent} from '../_base/action-object-layout.widget.component'
import {SeverityNameConverterPipe} from '../_converters/_severity/SeverityNames'
import {IconNameConverterPipe} from '../_converters/_icon/IconNames'
import { ButtonTypeTransformerService } from '../_converters/_button/button-type-transformer.service'

@Component({
  selector: 'ngx-ui-form-widget',
  templateUrl: './form.widget.html',
  styleUrls: ['./form.widget.scss'],
  providers: [IconNameConverterPipe, SeverityNameConverterPipe]
})
export class FormWidgetComponent extends ActionObjectLayoutWidgetComponent {

  constructor(actionRegistry: ActionRegistry
    , iconNameConverter: IconNameConverterPipe
    , severityNameConverter: SeverityNameConverterPipe
    , buttonTypesConverter: ButtonTypeTransformerService) {
    super(actionRegistry, iconNameConverter, severityNameConverter, buttonTypesConverter);
  }

}
