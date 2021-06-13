import {Component} from '@angular/core'
import {BindingRegistry, SchemaValidatorFactory} from 'ngx-schema-form'
import {triggerBinding} from '../bindings-registry-helper'
import {AsyncSelectionWidgetComponent} from "../_base/async-selection-widget.component";
import {WidgetComponentHttpApiService} from "../_service/widget-component-http-api.service";
import { ExpressionCompiler } from '../_service/expression-complier.service';

@Component({
  selector: 'ngx-ui-select-button-widget',
  templateUrl: './select-button.widget.html',
  styleUrls: ['./select-button.widget.scss',  '../checkbox/space.fix.scss', '../_component-helper/no-helpertext-spacer.widget.scss']
})
export class SelectButtonWidgetComponent extends AsyncSelectionWidgetComponent {

  constructor(protected schemaValidatorFactory: SchemaValidatorFactory, protected lookupService: WidgetComponentHttpApiService, private bindingRegistry: BindingRegistry, protected expressionCompiler: ExpressionCompiler) {
    super(schemaValidatorFactory, lookupService, expressionCompiler)
  }

  onChange(event) {
    triggerBinding(this, 'change', event, this.bindingRegistry, this.formProperty)
  }

  onClick(event) {
    triggerBinding(this, 'click', event, this.bindingRegistry, this.formProperty)
  }

}
