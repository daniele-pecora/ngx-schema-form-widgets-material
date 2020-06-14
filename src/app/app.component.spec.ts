import { TestBed, async } from '@angular/core/testing';
import {LOCALE_ID} from '@angular/core';
import {AppErrorHandler} from './app.errorhandler';
import {ErrorHandler} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppFormTemplateService} from './app.form-template-loader.service';
import {ApplicationComponent} from './view/application/application.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SchemaFormModule, SchemaValidatorFactory, WidgetRegistry} from 'ngx-schema-form';
import {UIFormViewModule} from 'ngx-schema-form-view';
import {
  FixOptionalEmptyFieldsZSchemaValidatorFactory,
  UIWidgetsMaterialModule,
  WidgetRegistryMaterial
} from '../../projects/ngx-schema-form-widgets-material/src/lib';
import { MatCardModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
describe('AppComponent', () => {
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

        // Angular2 Schema Form
        , SchemaFormModule.forRoot()
        // ngx-schema-form-view
        , UIFormViewModule.forRoot()
        // ngx-schema-form-ui-material
        , UIWidgetsMaterialModule

        , MatCardModule
      ],
      providers: [{provide: LOCALE_ID, useValue: 'de-DE' /**required for the date format pipe*/},
      {
        provide: ErrorHandler,
        useClass: AppErrorHandler
      },
      {provide: WidgetRegistry, useClass: WidgetRegistryMaterial},
      {provide: SchemaValidatorFactory, useClass: FixOptionalEmptyFieldsZSchemaValidatorFactory},
      AppFormTemplateService
    ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'ngx-schema-form-widgets-material'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ngx-schema-form-widgets-material');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to the testing app!');
  }));
});
