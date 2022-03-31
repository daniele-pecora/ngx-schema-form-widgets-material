import { Component } from '@angular/core';
import { FormElementComponent } from 'ngx-schema-form';

/**
 * This is an extension of <code>FormElementComponent</code> from
 * <code>ngx-schema-form</code> to create the content of a dialog as a widget.
 * The HTML template is the tricky part:
 * it uses the modified widget-info from <code>newWidgetInfo</code> instead of <code>formProperty.schema.widget</code>
 */
@Component({
    selector: 'ngx-ui-dialog-form-component',
    template: `
      <div *ngIf="formProperty.visible"
           [class.has-error]="!control.valid"
           [class.has-success]="control.valid">
        <sf-widget-chooser
          (widgetInstanciated)="onWidgetInstanciated($event)"
          [widgetInfo]="newWidgetInfo">
        </sf-widget-chooser>
        <sf-form-element-action *ngFor="let button of buttons" [button]="button" [formProperty]="formProperty"></sf-form-element-action>
      </div>`
})
export class DialogFormElementComponent extends FormElementComponent {
    newWidgetInfo
    ngOnInit() {
        super.ngOnInit()
        // make the content as a form
        this.newWidgetInfo = Object.assign({}, this.formProperty.schema.widget)

        let defaultContentType = 'string'
        if ((this.formProperty.schema.fieldsets || []).length) {
          defaultContentType = 'object'
        }
        this.newWidgetInfo.id = this.formProperty.schema.widget.contentType || defaultContentType
        this.newWidgetInfo.buttons = this.formProperty.schema.widget.buttons
    }

    onWidgetInstanciated(event){
        super.onWidgetInstanciated(event)
    }
}
