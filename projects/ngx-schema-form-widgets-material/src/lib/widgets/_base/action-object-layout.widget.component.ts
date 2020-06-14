import {ObjectLayoutWidget} from 'ngx-schema-form'
import { OnInit, Directive } from '@angular/core'
import {ActionRegistry} from 'ngx-schema-form'
import { IconNameConverterPipe } from '../_converters/_icon/IconNames'
import { SeverityNameConverterPipe } from '../_converters/_severity/SeverityNames'
import { ButtonTypeTransformerService } from '../_converters/_button/button-type-transformer.service'
import { buttonState, clickableDisabledState, clickableVisibilityState } from '../button/button.utils'

/**
 * Initializes widget action buttons.<br/>
 * <code>
 *     "widget":{
 *      "id":"form":
 *      "buttons":{
 *      ...
 *      }
 *     }
 * </code>
 *
 */
@Directive()
export abstract class ActionObjectLayoutWidgetComponent extends ObjectLayoutWidget implements OnInit {

  widgetButtons = [];

  constructor(private actionRegistry: ActionRegistry
    , private iconNameConverter: IconNameConverterPipe
    , private severityNameConverter: SeverityNameConverterPipe
    , private buttonTypesConverter: ButtonTypeTransformerService) {
    super();
  }

  ngOnInit(): void {
    this.parseButtons();
  }

  private parseButtons() {
    if (this.formProperty.schema.widget !== undefined)
      if (this.formProperty.schema.widget.buttons !== undefined) {
        this.widgetButtons = this.formProperty.schema.widget.buttons;
        for (const key in Object.keys(this.widgetButtons)) {
          if (this.widgetButtons.hasOwnProperty(key)) {
            const button = this.widgetButtons[key];
            this.createButtonCallback(button);
          }
        }
      }
  }

  private createButtonCallback(button) {
    button.action = (e) => {
      let action;
      if (button.id && (action = this.actionRegistry.get(button.id))) {
        if (action) {
          action(this.formProperty, button.parameters);
        }
      }
      e.preventDefault();
    };
  }

  getSeverity(value: string) {
    if (this.severityNameConverter && value) {
      return this.severityNameConverter.transform(value)
    }
    return value
  }

  getIcon(value: string) {
    if (this.iconNameConverter && value) {
      return this.iconNameConverter.transform(value)
    }
    return value
  }

  isClickableDisabled(objDisabled, validity, value): boolean {
    return clickableDisabledState(objDisabled, validity, value)
  }

  isButtonVisibile(objDisabled, validity, value) {
    return clickableVisibilityState(objDisabled, validity, value)
  }
  
}
