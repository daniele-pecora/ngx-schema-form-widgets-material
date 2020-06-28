import {ModuleWithProviders, NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

import {CheckboxWidgetComponent} from './widgets/checkbox/checkbox.widget'
import {CaptchaWidgetComponent} from './widgets/captcha/captcha.widget'
import {DateWidgetComponent} from './widgets/date/date.widget'
import {IntegerWidgetComponent} from './widgets/integer/integer.widget'
import {ObjectWidgetComponent} from './widgets/object/object.widget'
import {FormWidgetComponent} from './widgets/form/form.widget'
import {SelectWidgetComponent} from './widgets/select/select.widget'
import {StringWidgetComponent} from './widgets/string/string.widget'
import {SwitchWidgetComponent} from './widgets/switch/switch.widget'
import {TextAreaWidgetComponent} from './widgets/textarea/textarea.widget'
import {WizardWidgetComponent} from './widgets/wizard/wizard.widget'
import {ButtonWidgetComponent} from './widgets/button/button.widget'
import {ButtonComponent} from './widgets/button/button.component'
import {AutoCompleteWidgetComponent} from './widgets/autocomplete/autocomplete.widget'
import {ByteSizeFormatPipe, FileWidgetComponent} from './widgets/file/file.widget'
import {RadioWidgetComponent} from './widgets/radio/radio.widget'
import {RangeWidgetComponent} from './widgets/range/range.widget'
import {ArrayWidgetComponent} from './widgets/array/array.widget'
import {WidgetAddonComponent} from './widgets/_widget-addon/widget-addon.component'
import { OsmViewComponent } from './widgets/_osm/osm-view.component'
import { OSMWidgetComponent } from './widgets/osm/osm.widget'
import {HtmlWidgetComponent} from './widgets/html/html.widget'
import {BbcodeWidgetComponent} from './widgets/bbcode/bbcode.widget'
import { QrcodeWidgetComponent } from './widgets/qrcode/qrcode.widget'
// import {KeyFilterDirective} from './widgets/string/key-filter.directive'
import { MessageWidgetComponent } from './widgets/message/message.widget'
import { MessagesWidgetComponent } from './widgets/messages/messages.widget'
import {WidgetLinkComponent} from './widgets/_widget-link/widget-link.component'
import {WidgetLinkOverlayComponent} from './widgets/_widget-link/widget-link-overlay.component'
import {SelectButtonWidgetComponent} from './widgets/select-button/select-button.widget'
import {FileuploadComponent} from "./widgets/file/fileupload.component"
import {ProgressWidgetComponent} from './widgets/progress/progress.widget'
import {SectionWidgetComponent} from './widgets/section/section.widget'
import { KeyFilterModule } from './widgets/string/key-filter.directive'
import {DialogComponent} from './widgets/dialog/dialog.component'
import {DialogWidgetComponent} from './widgets/dialog/dialog.widget'
import { DialogFormElementComponent } from './widgets/dialog/dialog-form.component'
import { AngularOpenlayersModule } from 'ngx-openlayers'
import { TableWidgetComponent } from './widgets/table/table.widget'
import { DataConverterRegistryPipe } from './widgets/_converters/_data/data-converter-registry.pipe'

import {IsFormPropertyRequiredAsteriskPipe, IsFormPropertyRequiredPipe, IsFormPropertyRequiredAttributePipe, IsFormPropertyRequiredAttributeStringPipe, RequiredMarkComponent} from './widgets/_pipe/IsRequiredField'
import {ValidationMessagesComponent} from './widgets/_validation-messages/_validation-messages.component'
import { SelectCardWidgetComponent } from './widgets/select-card/select-card.widget'

import {SchemaFormModule, SchemaValidatorFactory, WidgetRegistry} from 'ngx-schema-form'
import { NgxQRCodeModule } from 'ngx-qrcode2'

import {WidgetComponentApiService} from './widgets/_service/api.service'
import {WidgetComponentHttpApiService, } from './widgets/_service/widget-component-http-api.service'
import {WidgetRegistryMaterial} from './widgets/widget-registry-material'

import { ExpressionCompiler, JEXLExpressionCompiler } from './widgets/_service/expression-complier.service'

import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatButtonModule} from '@angular/material/button'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import {MatCardModule} from '@angular/material/card'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatDatepickerModule,} from '@angular/material/datepicker'
import {MatIconModule,} from '@angular/material/icon'
import {MatInputModule,} from '@angular/material/input'
import {MatNativeDateModule,} from '@angular/material/core'
import {MatRadioModule,} from '@angular/material/radio'
import {MatSelectModule,} from '@angular/material/select'
import {MatSliderModule,} from '@angular/material/slider'
import {MatSlideToggleModule,} from '@angular/material/slide-toggle'
import {MatStepperModule,} from '@angular/material/stepper'
import {MatTooltipModule,} from '@angular/material/tooltip'
import {MatProgressSpinnerModule,} from '@angular/material/progress-spinner'
import {MatProgressBarModule,} from '@angular/material/progress-bar'
import {MatExpansionModule,} from '@angular/material/expansion'
import {MatTabsModule,} from '@angular/material/tabs'
import {MatDialogModule,} from '@angular/material/dialog'
import {MatTableModule} from '@angular/material/table'

import {NgxRecaptchaModule} from 'ngx-recaptcha-easy'
import {TextMaskModule} from 'angular2-text-mask'
import {InputmaskComponent} from './widgets/string/inputmask.component'

import {IconNameTransformerService} from './widgets/_converters/_icon/icon-name-transformer.service'
import {IconNameTransformerMaterialService} from './widgets/_converters/_icon/icon-name-transformer-material.service'
import {IconNameConverterPipe} from './widgets/_converters/_icon/IconNames'

import {SeverityNameConverterPipe} from './widgets/_converters/_severity/SeverityNames'
import {SeverityNameTransformerService} from './widgets/_converters/_severity/severity-name-transformer.service'
import {SeverityNameTransformerMaterialService} from './widgets/_converters/_severity/severity-name-transformer-material.service'

import { ButtonTypeConverterPipe } from './widgets/_converters/_button/ButtonTypes';
import { ButtonTypeTransformerService } from './widgets/_converters/_button/button-type-transformer.service';
import { ButtonTypeTransformerMaterialService } from './widgets/_converters/_button/button-type-transformer-material.service';

import {ValidationFieldMessagesComponent} from './widgets/_validation-field-messages/_validation-field-messages.component'
import {FixOptionalEmptyFieldsZSchemaValidatorFactory} from './fix-optional-empty-fields-z-schema-validator-factory'

const moduleProviders = [
  {provide: WidgetRegistry, useClass: WidgetRegistryMaterial},
  /**
   This is how you would use a custom schema validator factory
   */
  {provide: SchemaValidatorFactory, useClass: FixOptionalEmptyFieldsZSchemaValidatorFactory}
]


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    // ngx-schema-form
    SchemaFormModule,
    // Material
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSliderModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatCardModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTabsModule,
    MatTableModule,
    // ngx-recaptcha
    NgxRecaptchaModule,
    // angular2-text-mask
    TextMaskModule,
    // keyfilter
    KeyFilterModule,

    MatDialogModule,
    // OSM
    AngularOpenlayersModule,
    NgxQRCodeModule
  ],
  declarations: [
    ArrayWidgetComponent,
    AutoCompleteWidgetComponent,
    ButtonWidgetComponent,
    ButtonComponent,
    CaptchaWidgetComponent,
    CheckboxWidgetComponent,
    DateWidgetComponent,
    FileWidgetComponent,
    FormWidgetComponent,
    IntegerWidgetComponent,
    ObjectWidgetComponent,
    RadioWidgetComponent,
    RangeWidgetComponent,
    SelectWidgetComponent,
    StringWidgetComponent,
    SwitchWidgetComponent,
    TextAreaWidgetComponent,
    WizardWidgetComponent,
    ProgressWidgetComponent,
    ValidationMessagesComponent,
    ValidationFieldMessagesComponent,
    HtmlWidgetComponent,
    BbcodeWidgetComponent,
    QrcodeWidgetComponent,
    SectionWidgetComponent,
    TableWidgetComponent,
    DataConverterRegistryPipe,
    SelectButtonWidgetComponent,
    SelectCardWidgetComponent,
    FileuploadComponent,
    DialogWidgetComponent,
    DialogComponent,
    DialogFormElementComponent,
    DialogComponent,


    //
    ByteSizeFormatPipe,
    IsFormPropertyRequiredAsteriskPipe,
    IsFormPropertyRequiredPipe,
    IsFormPropertyRequiredAttributePipe,
    IsFormPropertyRequiredAttributeStringPipe,
    RequiredMarkComponent,
    IconNameConverterPipe,
    SeverityNameConverterPipe,
    ButtonTypeConverterPipe,

    //
    InputmaskComponent,
    // KeyFilterDirective,
    MessageWidgetComponent,
    MessagesWidgetComponent,
    WidgetLinkComponent,
    WidgetLinkOverlayComponent,
    WidgetAddonComponent,
    OsmViewComponent,
    OSMWidgetComponent
  ],
  entryComponents: [
    ArrayWidgetComponent,
    AutoCompleteWidgetComponent,
    ButtonWidgetComponent,
    ButtonComponent,
    CaptchaWidgetComponent,
    CheckboxWidgetComponent,
    DateWidgetComponent,
    FileWidgetComponent,
    FormWidgetComponent,
    IntegerWidgetComponent,
    ObjectWidgetComponent,
    RadioWidgetComponent,
    RangeWidgetComponent,
    SelectWidgetComponent,
    StringWidgetComponent,
    SwitchWidgetComponent,
    TextAreaWidgetComponent,
    WizardWidgetComponent,
    ProgressWidgetComponent,
    ValidationMessagesComponent,
    ValidationFieldMessagesComponent,
    HtmlWidgetComponent,
    BbcodeWidgetComponent,
    QrcodeWidgetComponent,
    SectionWidgetComponent,
    TableWidgetComponent,
    SelectButtonWidgetComponent,
    SelectCardWidgetComponent,
    DialogWidgetComponent,
    DialogFormElementComponent,
    DialogComponent,

    //
    InputmaskComponent,
    MessageWidgetComponent,
    MessagesWidgetComponent,
    WidgetLinkComponent,
    WidgetLinkOverlayComponent,
    WidgetAddonComponent,
    OsmViewComponent,
    OSMWidgetComponent
  ],
  exports: [
    ArrayWidgetComponent,
    AutoCompleteWidgetComponent,
    ButtonWidgetComponent,
    ButtonComponent,
    CaptchaWidgetComponent,
    CheckboxWidgetComponent,
    DateWidgetComponent,
    FileWidgetComponent,
    FormWidgetComponent,
    IntegerWidgetComponent,
    ObjectWidgetComponent,
    RadioWidgetComponent,
    RangeWidgetComponent,
    SelectWidgetComponent,
    StringWidgetComponent,
    SwitchWidgetComponent,
    TextAreaWidgetComponent,
    WizardWidgetComponent,
    ProgressWidgetComponent,
    ValidationMessagesComponent,
    ValidationFieldMessagesComponent,
    HtmlWidgetComponent,
    BbcodeWidgetComponent,
    QrcodeWidgetComponent,
    SectionWidgetComponent,
    TableWidgetComponent,
    DataConverterRegistryPipe,
    SelectButtonWidgetComponent,
    SelectCardWidgetComponent,
    DialogWidgetComponent,
    DialogFormElementComponent,
    DialogComponent,

    //
    ByteSizeFormatPipe,
    IsFormPropertyRequiredAsteriskPipe,
    IsFormPropertyRequiredPipe,
    IsFormPropertyRequiredAttributePipe,
    IsFormPropertyRequiredAttributeStringPipe,
    RequiredMarkComponent,
    IconNameConverterPipe,
    SeverityNameConverterPipe,
    ButtonTypeConverterPipe,
    //
    InputmaskComponent,
    MessageWidgetComponent,
    MessagesWidgetComponent,
    WidgetLinkComponent,
    WidgetLinkOverlayComponent,
    WidgetAddonComponent,
    OsmViewComponent,
    OSMWidgetComponent
  ],
  providers: [WidgetComponentApiService, WidgetComponentHttpApiService,
    {
      provide: IconNameTransformerService,
      useClass: IconNameTransformerMaterialService
    },
    {
      provide: SeverityNameTransformerService,
      useClass: SeverityNameTransformerMaterialService
    },
    {
      provide: ButtonTypeTransformerService,
      useClass: ButtonTypeTransformerMaterialService
    },
    {
      provide: ExpressionCompiler,
      useClass: JEXLExpressionCompiler
    }
  ]
})
export class UIWidgetsMaterialModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UIWidgetsMaterialModule,
      providers: [...moduleProviders]
    }
  }
}
