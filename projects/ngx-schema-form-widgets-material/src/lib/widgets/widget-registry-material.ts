/**
 * Created by daniele on 27.09.17
 */
import {StringWidgetComponent} from './string/string.widget'
import {TextAreaWidgetComponent} from './textarea/textarea.widget'
import {FormWidgetComponent} from './form/form.widget'
import {SwitchWidgetComponent} from './switch/switch.widget'
import {CheckboxWidgetComponent} from './checkbox/checkbox.widget'
import {DateWidgetComponent} from './date/date.widget'
import {CaptchaWidgetComponent} from './captcha/captcha.widget'
import {SelectWidgetComponent} from './select/select.widget'
import {IntegerWidgetComponent} from './integer/integer.widget'
import {ObjectWidgetComponent} from './object/object.widget'
import {WizardWidgetComponent} from './wizard/wizard.widget'
import {ButtonWidgetComponent} from './button/button.widget'
import {AutoCompleteWidgetComponent} from './autocomplete/autocomplete.widget'
import {FileWidgetComponent} from './file/file.widget'
import {RadioWidgetComponent} from './radio/radio.widget'
import {RangeWidgetComponent} from './range/range.widget'
import {ArrayWidgetComponent} from './array/array.widget'
import {HtmlWidgetComponent} from './html/html.widget'
import {QrcodeWidgetComponent} from './qrcode/qrcode.widget'
import {OSMWidgetComponent} from './osm/osm.widget'

import {WidgetRegistry} from 'ngx-schema-form'
import {MessageWidgetComponent} from './message/message.widget'
import {MessagesWidgetComponent} from './messages/messages.widget'
import {SectionWidgetComponent} from './section/section.widget'
import {SelectButtonWidgetComponent} from './select-button/select-button.widget'
import {ProgressWidgetComponent} from './progress/progress.widget'
import { TableWidgetComponent } from './table/table.widget'
import { BbcodeWidgetComponent } from './bbcode/bbcode.widget'
import { SelectCardWidgetComponent } from './select-card/select-card.widget'
import { DialogWidgetComponent } from './dialog/dialog.widget'
import { Injectable } from "@angular/core";

@Injectable()
export class WidgetRegistryMaterial extends WidgetRegistry {
  constructor() {
    super()

    this.register('array', ArrayWidgetComponent)
    this.register('object', ObjectWidgetComponent)

    this.register('string', StringWidgetComponent)
    this.register('search', StringWidgetComponent)
    this.register('tel', StringWidgetComponent)
    this.register('url', StringWidgetComponent)
    this.register('email', StringWidgetComponent)
    this.register('password', StringWidgetComponent)
    this.register('color', StringWidgetComponent)

    this.register('date-picker', DateWidgetComponent)
    this.register('date-native', StringWidgetComponent)
    this.register('date-time', StringWidgetComponent)
    this.register('time', StringWidgetComponent)

    this.register('integer', IntegerWidgetComponent)
    this.register('number', IntegerWidgetComponent)
    this.register('range', RangeWidgetComponent)

    this.register('textarea', TextAreaWidgetComponent)

    this.register('select', SelectWidgetComponent)
    this.register('radio', RadioWidgetComponent)
    this.register('boolean', CheckboxWidgetComponent)
    this.register('checkbox', CheckboxWidgetComponent)

    // Custom
    this.register('captcha', CaptchaWidgetComponent)
    this.register('switch', SwitchWidgetComponent)
    this.register('form', FormWidgetComponent)
    this.register('wizard', WizardWidgetComponent)
    this.register('autocomplete', AutoCompleteWidgetComponent)
    this.register('file', FileWidgetComponent)


    this.register('button', ButtonWidgetComponent)
    this.register('alert_button', ButtonWidgetComponent)
    this.register('reset_button', ButtonWidgetComponent)
    this.register('show_button', ButtonWidgetComponent)

    this.register('wizard_button_action1', ButtonWidgetComponent)
    this.register('wizard_button_action2', ButtonWidgetComponent)
    this.register('wizard_button_action3', ButtonWidgetComponent)
    this.register('wizard_button_action4', ButtonWidgetComponent)

    this.register('html', HtmlWidgetComponent)
    this.register('bbcode', BbcodeWidgetComponent)

    this.register('qrcode', QrcodeWidgetComponent)
    this.register('message', MessageWidgetComponent)
    this.register('messages', MessagesWidgetComponent)
    this.register('osm', OSMWidgetComponent)

    this.register('section', SectionWidgetComponent)

    // this should be the right widget id
    this.register('select-button', SelectButtonWidgetComponent)
    // ... keep this for backward-compatibility
    this.register('select_button', SelectButtonWidgetComponent)

    this.register('progress', ProgressWidgetComponent)

    this.register('table', TableWidgetComponent)

    this.register('select-card', SelectCardWidgetComponent)

    this.register('dialog', DialogWidgetComponent)
    
    this.setDefaultWidget(StringWidgetComponent)
    /** 
     * @deprecated
     * 'date' should address the native HTML5 date input field
     * Use widge id 'date-picker' instead
     */
    this.register('date', DateWidgetComponent)
  }

  getWidgetType(type: string): any {
    if ('date' === type)
      console.warn(`
******** ******** ******** ******** ******** ******** ******** ******** ********
WARNING: UI Widget Library
DEPRECATED widget id "date" is used, use "date-picker" instead. 
The widget id will in future versions be mapped to the HTML5 date input type.
******** ******** ******** ******** ******** ******** ******** ******** ********
`
)
    return super.getWidgetType(type)
  }
}