import {Component, Inject} from '@angular/core'
import {SafeResourceUrl} from '@angular/platform-browser'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-ui-widget-link-overlay',
  template: `
    <!--
            Element 'link'
             - label       : label
             - description : tooltip
             - id          : style id
             - disabled    : true|false|'valid'|'invalid' = disabled state, or form is in/valid
             - href        : any url to navigate to
             - target      : any navigation target to open the link in
             - icon        : icon from primeng ultima
             - iconPos     : left|right = primeng button icon position
             - inline      : true|false = show horizontally inlined
             - overlay     : true|false = show content in dialog with embedded iframe sandbox
             - overlayClose: text to show withing the link 'close overlay'
             - overlayOpen : text to show withing the link 'open in new window'
             - sandbox     : any of allowed values from sandbox attribute for iframe. see: https://www.w3.org/TR/2011/WD-html5-20110525/the-iframe-element.html#attr-iframe-sandbox
    -->
    <div class="mat-card-header">
      <a (click)="dialogRef.close();false"
         href="#"
         rel="noopener noreferrer"
         [matTooltip]="link.overlayClose||null"

         [attr.role]="link"
      >
        <mat-icon class="mat-24" aria-label="">close</mat-icon>
      </a>
      <span *ngIf="link.label">{{link.label}}</span>
    </div>
    <iframe
      style="position: relative; height: 90%; width: 100%;"
      [sandbox]="link.sandbox||''"
      [src]="link.href"
      frameborder="0"
      allowfullscreen></iframe>
    <div *ngIf="'_blank'===link.target" style="text-align: right">
      <a (click)="dialogRef.close()"
         [href]="link.href"
         rel="noopener noreferrer"
         target="_blank"
         [matTooltip]="link.overlayOpen||null"

         [attr.role]="link"
      >
        <mat-icon class="mat-24" aria-label="">open_in_new</mat-icon>
      </a>
    </div>
  `
})
export class WidgetLinkOverlayComponent {
  constructor(
    public dialogRef: MatDialogRef<WidgetLinkOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public link: WidgetLinkOverlayComponentModel) {

  }
}

export class WidgetLinkOverlayComponentModel {
  constructor(public href: SafeResourceUrl, public label?: string, public target?: string, public sandbox?: string, public overlayClose?: string, public overlayOpen?: string) {
  }
}
