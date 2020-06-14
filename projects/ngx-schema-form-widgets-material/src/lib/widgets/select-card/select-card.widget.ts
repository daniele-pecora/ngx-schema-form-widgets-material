/**
 * Created by daniele on 04.08.19.
 */
import {Component, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core'
import {BindingRegistry, SchemaValidatorFactory} from 'ngx-schema-form'
import {triggerBinding} from '../bindings-registry-helper'
import {AsyncSelectionWidgetComponent} from "../_base/async-selection-widget.component";
import {WidgetComponentHttpApiService} from "../_service/widget-component-http-api.service";
import { ExpressionCompiler } from '../_service/expression-complier.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import simpleParser from '../bbcode/simple-bbcode.parser'
import { SecurityContext } from '@angular/core';
import { IconNameConverterPipe } from '../_converters/_icon/IconNames';
import { SeverityNameConverterPipe } from '../_converters/_severity/SeverityNames';
import { ButtonTypeTransformerService } from '../_converters/_button/button-type-transformer.service';


@Component({
  selector: 'ngx-ui-select-card-widget',
  templateUrl: './select-card.widget.html',
  styleUrls:['./select-card.widget.scss']
})
export class SelectCardWidgetComponent extends AsyncSelectionWidgetComponent {

  @ViewChild('cardSection') scrollHook: ElementRef

  constructor(protected schemaValidatorFactory: SchemaValidatorFactory
    , protected lookupService: WidgetComponentHttpApiService
    , private bindingRegistry: BindingRegistry
    , protected expressionCompiler: ExpressionCompiler
    , private sanitizer: DomSanitizer
    , private iconNameConverter?: IconNameConverterPipe
    , private severityNameConverter?: SeverityNameConverterPipe
    , private buttonTypesConverter?: ButtonTypeTransformerService
    ) {
    super(schemaValidatorFactory, lookupService, expressionCompiler)
  }

  onChange(event) {
    triggerBinding(this, 'change', event, this.bindingRegistry, this.formProperty)
  }

  onClick(event) {
    triggerBinding(this, 'click', event, this.bindingRegistry, this.formProperty)
  }

  getSaveContent(bbcodeString:string|string[]): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getContent(bbcodeString))
  }

  getContent(bbcodeString:string|string[]): string {
    let content = ''
    if (bbcodeString) {
      const bbcode = Array.isArray(bbcodeString) ? bbcodeString.join('') : bbcodeString
      content += simpleParser.parse(this.sanitizer.sanitize(SecurityContext.HTML,`${bbcode}`))
    }
    return content
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

  getButtonType(action:object) {
    const button = action || {}
    if (!button['type'] && !button['label'] && button['icon']) {
      return 'ui-button-icon-only'
    }
    return this.buttonTypesConverter.transform(button['type'])
  }

  isClickableDisabled(objDisabled, validity, value): boolean {
    return true // clickableDisabledState(objDisabled, validity, value)
  }

  isButtonVisibile(objDisabled, validity, value) {
    return true //  clickableVisibilityState(objDisabled, validity, value)
  }

  onOptionClick(event, item: any = null) {
    this.control.setValue(item.enum[0], { onlySelf: false, emitEvent: true })

    if (((this.schema || {}).widget || {}).selectedOnly) {
      this.scrollIntoView()
    }

    // this.onClick(event)
    this.onChange(event)
  }

  scrollIntoView() {
    const scrollDisabled = (this.schema.widget.hasOwnProperty('disableScrollToTop') && this.schema.widget.disableScrollToTop === true)
    if(scrollDisabled)
      return
    const scrollOptions = { behavior: 'smooth', inline: 'start', block: 'start' }
    if (this.scrollHook.nativeElement.scrollIntoViewIfNeeded) {
      this.scrollHook.nativeElement.scrollIntoViewIfNeeded()
    } else {
      this.scrollHook.nativeElement.scrollIntoView(scrollOptions)
    }
  }
}
