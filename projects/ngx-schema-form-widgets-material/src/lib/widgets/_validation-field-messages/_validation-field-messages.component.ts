import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { FormProperty } from 'ngx-schema-form'
import { Widget } from 'ngx-schema-form'
import { ValidationErrors } from '@angular/forms/forms'

/**
 * Order priority.<br/>
 * For Z-Schema Validator.<br/>
 * See: https://github.com/zaggino/z-schema/blob/master/src/Errors.js.<br/>
 * <br/>
 * Most important are set as last.
 */
const VALIDATION_MESSAGE_PRIORITY: Array<string> = [
    'PATTERN',
    'MULTIPLE_OF',
    'MAXIMUM_EXCLUSIVE',
    'MAXIMUM',
    'MINIMUM_EXCLUSIVE',
    'MINIMUM',
    'MAX_LENGTH',
    'MIN_LENGTH',
    'OBJECT_MISSING_REQUIRED_PROPERTY'
]


/**
 * Component to render field validation messages.<br/>
 * To hide any content when a validation message is present,<br/>
 * you may put it into the component body.<br/>
 * Example 1:<br/>
 * This example renders the validation messages and hides the description of the field.
 * <code>
 <ngx-ui-field-validation-messages [formComponent]="this" [validationErrors]="control.errors">
 <div class="field-description-text">
 This will be onyl shown when no validation messages is present
 </div>
 </ngx-ui-field-validation-messages>
 * </code>
 */
@Component({
    selector: 'ngx-ui-field-validation-messages',
    templateUrl: './_validation-field-messages.component.html',
    styleUrls: ['./_validation-field.messages.component.scss'],
    /*  this has moved to `no-helpertext-spacer.widget.ts`
    host: {
        '[class.noSpacer_]': 'isNoSpacer',
        '[class.noSpacerAlways_]': 'isNoSpacerAlways',
        '[class]': 'classNoSpacer'
    }
    */
    host: {
        class: 'ngx-ui-htSpacer'
    }
})
export class ValidationFieldMessagesComponent implements OnInit, OnChanges {

    /**
     * Use this if the outer component does re-initialize the component on error changes.
     * This is the solution that works with Angular Material, 
     * as long as `<mat-error>` is included inside a `<mat-form-field>`
     * For checkboxes and switch use the method below.
     */
    @Input()
    formComponent: Widget<FormProperty> = null
    /**
     * Use this if you need to update the message when errors change.
     * This is the solution that works with PrimeNG.
     */
    @Input()
    validationErrors: ValidationErrors = null

    /**
     * Set to {@code true} show only the first important validation message. (default)<br/>
     * Set to {@code false} show all validation messages.<br/>
     * @type {boolean}
     */
    @Input()
    firstOnly = true

    validationMessages: Array<string> = []
    severities: any = {}
    /* this has moved to `no-helpertext-spacer.widget.ts`
    get classNoSpacer() {
        const _formComponent = this
        const noSpacer = _formComponent.formComponent.schema
            && _formComponent.formComponent.schema.widget
            && _formComponent.formComponent.schema.widget.noSpacer
        if (noSpacer) {
            if ('always' === noSpacer) {
                return 'noSpacerAlways'
            }
            return 'noSpacer'
        }
        return ''
    }
    */

    ngOnInit(): void {
        this.collectMessages();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.collectMessages()
    }

    private getCustomMessage(errorCode): CustomValidationMessage {
        const messages = ((this.formComponent.formProperty.schema.widget || {}).validationMessages || [])
        if (messages[errorCode])
            return new CustomValidationMessage(errorCode, messages[errorCode])
    }

    private collectMessages() {
        this.validationMessages = []
        const validationMessages = []
        const severities = {}
        if (this.formComponent.control.dirty && !this.formComponent.control.valid) {
            if (this.formComponent.formProperty.schema.hasOwnProperty('widget')
                && this.formComponent.formProperty.schema.widget.hasOwnProperty('validationMessage')) {
                if (this.formComponent.formProperty.schema.widget.validationMessage) {
                    validationMessages.push(this.formComponent.formProperty.schema.widget.validationMessage)
                }
            } else {
                if (this.formComponent.control && this.formComponent.control.errors) {
                    for (const errKey in this.formComponent.control.errors.sort(this.errorCodeComparator)) {
                        const validationError = this.getCustomMessage(this.formComponent.control.errors[errKey].code) || this.formComponent.control.errors[errKey]
                        /**
                         * make sure no duplicated message appears
                         */
                        if (validationError && -1 === this.validationMessages.indexOf(validationError.message)) {
                            validationMessages.push(validationError.message)
                            severities[validationError.message] = validationError.severity
                        }
                    }
                } else if (this.formComponent.formProperty._errors) {
                    for (const _error of this.formComponent.formProperty._errors.sort(this.errorCodeComparator)) {
                        const validationError = this.getCustomMessage(_error.code) || { message: '' }
                        const validationErrorMessage = validationError.message || _error.message
                        /**
                         * make sure no duplicated message appears
                         */
                        if (_error && -1 === this.validationMessages.indexOf(validationErrorMessage)) {
                            validationMessages.push(_error.message)
                            severities[_error.message] = _error.severity
                        }
                    }
                } else if (this.formComponent.errorMessages) {
                    for (const errorMessage of this.formComponent.errorMessages) {
                        /**
                         * make sure no duplicated message appears
                         */
                        if (errorMessage && -1 === this.validationMessages.indexOf(errorMessage)) {
                            validationMessages.push(errorMessage)
                        }
                    }
                }
            }
        }

        if (validationMessages.length) {

            if (this.firstOnly) {
                this.validationMessages.push(validationMessages[0])
                this.severities[validationMessages[0]] = severities[validationMessages[0]]
            } else {
                this.validationMessages = this.validationMessages.concat(validationMessages)
            }
        }
    }

    private errorCodeComparator(a: any, b: any): number {
        return -1 * (VALIDATION_MESSAGE_PRIORITY.indexOf(a.code) - VALIDATION_MESSAGE_PRIORITY.indexOf(b.code))
    }
}

export class CustomValidationMessage {
    constructor(public code: string, public message: string) {

    }
}
