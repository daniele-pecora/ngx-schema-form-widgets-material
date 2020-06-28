import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core'
import {SeverityNameConverterPipe} from '../_converters/_severity/SeverityNames'
import {IconNameConverterPipe} from '../_converters/_icon/IconNames'
import {clickableDisabledState, clickableVisibilityState} from './button.utils'
import { ButtonTypeTransformerService } from '../_converters/_button/button-type-transformer.service';
import { FormProperty } from 'ngx-schema-form';

@Component({
  selector: 'ngx-ui-button-component',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  providers: [IconNameConverterPipe, SeverityNameConverterPipe]
})
export class ButtonComponent implements OnChanges {

  @Input()
  formProperty:FormProperty

  @Input()
  button:any

  @Input()
  disabled: boolean | undefined | null

  @Input()
  buttonClass: string = ''

  @Output()
  onClick: EventEmitter<any> = new EventEmitter<any>()

  constructor(private iconNameConverter?: IconNameConverterPipe
    , private severityNameConverter?: SeverityNameConverterPipe
    , private buttonTypesConverter?: ButtonTypeTransformerService
    ) {

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

  getButtonType() {
    const button = this.button ||{}
    if (!button['type'] && !button['label'] && button['icon']) {
      return 'mat-icon-button'
    }
    return this.buttonTypesConverter.transform(button['type'])
  }

  button_action(event) {
    if (this.onClick.observers.length > 0) {
      /**
       * If any observer is registred then
       * call them
       */
      this.onClick.emit(event)
    }
    if (this.button.action) {
      this.button.action(event)
    }
  }

  isClickableDisabled(objDisabled, validity, value): boolean {
    return  /** If the binding for the property 'disabled' has been set the prioritize it */ this.disabled === true || this.disabled === false ? this.disabled
      : clickableDisabledState(objDisabled, validity, value)
  }

  isButtonVisibile(objDisabled, validity, value) {
    return clickableVisibilityState(objDisabled, validity, value)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled) {
      if (!changes.disabled.firstChange)
        if (changes.disabled.currentValue !== changes.disabled.previousValue) {

        }
    }
  }

}
