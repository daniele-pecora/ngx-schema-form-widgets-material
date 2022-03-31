import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import { AppOfflineService } from '../../app-offline.service'
import {LOCALE_ID} from '@angular/core';
import {AppErrorHandler} from '../../app.errorhandler';
import {ErrorHandler} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from '../../app.component';
import {AppFormTemplateService} from '../../app.form-template-loader.service';
import {ApplicationComponent} from '../../view/application/application.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SchemaFormModule, SchemaValidatorFactory, WidgetRegistry} from 'ngx-schema-form';
import {UIFormViewModule} from 'ngx-schema-form-view';
import {
  FixOptionalEmptyFieldsZSchemaValidatorFactory,
  UIWidgetsPrimeNGModule,
  WidgetRegistryPrimeNG
} from 'ngx-schema-form-widgets-material';
import { RouterTestingModule } from '@angular/router/testing';

describe('ApplicationComponent', () => {
  let component: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ApplicationComponent
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        BrowserModule

        // App
        , FormsModule
        , HttpClientModule

        // ngx-schema-form
        , SchemaFormModule.forRoot()
        // ngx-schema-form-view
        , UIFormViewModule.forRoot()
        // ngx-schema-form-ui-material
        , UIWidgetsPrimeNGModule
      ],
      providers: [AppOfflineService,{provide: LOCALE_ID, useValue: 'de-DE' /**required for the date format pipe*/},
        {
          provide: ErrorHandler,
          useClass: AppErrorHandler
        },
        {provide: WidgetRegistry, useClass: WidgetRegistryPrimeNG},
        {provide: SchemaValidatorFactory, useClass: FixOptionalEmptyFieldsZSchemaValidatorFactory},
        AppFormTemplateService
      ],
    })
      .compileComponents()
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationComponent);
    component = fixture.componentInstance
    // fixture.detectChanges()
  });

  it('should create', () => {
    expect(component).toBeTruthy()
  })
});
