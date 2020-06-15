import {LOCALE_ID} from '@angular/core';
import {AppErrorHandler} from './app.errorhandler';
import {ErrorHandler} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppFormTemplateService} from './app.form-template-loader.service';
import {ApplicationComponent} from './view/application/application.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SchemaFormModule, SchemaValidatorFactory, WidgetRegistry, ZSchemaValidatorFactory} from 'ngx-schema-form';
import {UIFormViewModule} from 'ngx-schema-form-view';
import {
  FixOptionalEmptyFieldsZSchemaValidatorFactory,
  UIWidgetsMaterialModule,
  WidgetRegistryMaterial
} from '../../projects/ngx-schema-form-widgets-material/src/lib';
// TODO change the above to this in production, the above allows hot-reload for development
//} from 'ngx-schema-form-ui-material';
import { MatCardModule } from '@angular/material/card';
import { ResizeComponent } from './view/resize/resize.component';
import { ThemerComponent } from './view/themer/themer.component';


@NgModule({
  providers: [{provide: LOCALE_ID, useValue: 'de-DE' /**required for the date format pipe*/},
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    },
    {provide: WidgetRegistry, useClass: WidgetRegistryMaterial},
    {provide: SchemaValidatorFactory, useClass: FixOptionalEmptyFieldsZSchemaValidatorFactory},
    AppFormTemplateService
  ],
  declarations: [
    AppComponent,
    ApplicationComponent,
    ResizeComponent,
    ThemerComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule

    // App
    , FormsModule
    , ReactiveFormsModule
    , HttpClientModule

    // ngx-schema-form
    , SchemaFormModule.forRoot()
    // ngx-schema-form-view
    , UIFormViewModule.forRoot()
    // ngx-schema-form-ui-material
    , UIWidgetsMaterialModule

//    , MatCardModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
