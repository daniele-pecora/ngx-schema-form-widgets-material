import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {Message} from '../_domain/message'
import {Widget} from "ngx-schema-form";
import {SeverityNameTransformerService} from '../_converters/_severity/severity-name-transformer.service'
import {FormProperty} from 'ngx-schema-form'
import {Subscription} from 'rxjs'


/**
 * Component to render validation messages.<br/>
 */
@Component({
  selector: 'ngx-ui-validation-messages',
  templateUrl: './_validation-messages.component.html',
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
    }
  `]
})
export class ValidationMessagesComponent implements OnInit, OnDestroy {

  @Input()
  formComponent: Widget<FormProperty>;

  matchingPathOnly: boolean = true;
  firstOnly: boolean = false;
  codes: string[] = [];

  validationMessages: Message[] = [];

  validationSub: Subscription;
  valueSub: Subscription;
  dirty: boolean = false;

  constructor(private severityNameTransformerService?: SeverityNameTransformerService) {

  }

  ngOnDestroy(): void {
    if (this.validationSub)
      this.validationSub.unsubscribe()
  }

  ngOnInit(): void {
    if (typeof(this.formComponent.formProperty.schema.widget.showErrors) === 'object') {
      this.matchingPathOnly = !(this.formComponent.formProperty.schema.widget.showErrors['all'] === true);
      this.firstOnly = this.formComponent.formProperty.schema.widget.showErrors['firstOnly'] === true;
      this.codes = this.formComponent.formProperty.schema.widget.showErrors['codes'] || []
    }

    this.validationSub = this.formComponent.formProperty.errorsChanges
      .subscribe(value => {
        if (this.dirty)
          this.collectMessages()
      });
    this.valueSub = this.formComponent.formProperty.valueChanges
      .subscribe(value => {
        this.dirty = true
      })
  }

  private getCustomMessage(errorCode): CustomValidationMessage {
    const messages = ((this.formComponent.formProperty.schema.widget || {}).validationMessages || []);
    if (messages[errorCode])
      return new CustomValidationMessage(errorCode, messages[errorCode])
  }

  collectMessages(): void {
    this.validationMessages = [];
    const validationMessages = [];
    const msgKeys = [];
    const supportedCodes = this.codes || [];
    const errors = (this.formComponent.formProperty._errors || []).filter(fpError => {
      if (this.matchingPathOnly && fpError.path !== `#${this.formComponent.formProperty.path}`)
        return false;
      if (supportedCodes.length && fpError.code && -1 === supportedCodes.indexOf(fpError.code))
        return false;

      const key = `-code:${fpError.code},-path:${fpError.path},-message:${fpError.message}`;
      if (-1 !== msgKeys.indexOf(key))
        return false;

      msgKeys.push(key);
      return true
    });

    if (errors.length) {
      if (this.formComponent.formProperty.schema.hasOwnProperty('widget')
        && this.formComponent.formProperty.schema.widget.hasOwnProperty('validationMessage')) {
        if (this.formComponent.formProperty.schema.widget.validationMessage) {
          validationMessages.push({
            severity: 'error',
            summary: `${this.formComponent.formProperty.schema.widget.validationMessage}`,
            detail: ''
          })
        }
      } else {
        for (const _error of errors) {
          const validationError = this.getCustomMessage(_error.code) || {message: ''};
          const validationErrorMessage = validationError.message || _error.message;
          validationMessages.push({
            severity: this.severityNameTransformerService.transform(_error.severity || 'error'),
            summary: typeof(_error.title) !== 'undefined' ? _error.title : `${validationErrorMessage}`,
            detail: typeof(_error.title) !== 'undefined' ? `${validationErrorMessage}` : '',
            path: _error.path,
            code: _error.code,
            message: validationErrorMessage
          });
        }
      }
    }

    if (validationMessages.length) {

      if (this.firstOnly) {
        this.validationMessages.push(validationMessages[0])
      } else {
        this.validationMessages = this.validationMessages.concat(validationMessages)
      }
    }
  }
}

export class CustomValidationMessage {
  constructor(public code: string, public message: string, public severity: string = 'error') {

  }
}
