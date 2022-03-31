import { Component, Input, OnInit } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { MatDialog } from '@angular/material/dialog';
import { WidgetLinkOverlayComponent } from './widget-link-overlay.component'
import { isMobileDevice } from '../_utils/utils'

export interface WidgetLinkComponentModel {
  id: string;
  target: string;
  description: string;
  href: string;
  label: string;
  icon: string;
  iconPos: string;
  /**
   * Show content in an overlay iframe
   */
  overlay: boolean;
  overlayClose: string;
  overlayOpen: string;
  sandbox: string
}

@Component({
  selector: 'ngx-ui-widget-link',
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
    -->
    <a
      (click)="onClick($event)"
      [href]="href"
      rel="noopener noreferrer"
      [attr.title]="link.description||link.label||null"
      [attr.id]="link.id"
      [attr.target]="link.target||null"
      [matTooltip]="toolTip(link.description||null)"
      [attr.data-rel]="link.overlay?'dialog':null"

      [attr.role]="'link'"
    >

      <mat-icon *ngIf="link.icon && link.iconPos==='left'" class="mat-24" aria-label="">{{link.icon | IconName}}
      </mat-icon>
      {{link.label}}
      <mat-icon *ngIf="link.icon && link.iconPos && link.iconPos!=='left'" class="mat-24" aria-label="">
        {{link.icon | IconName}}
      </mat-icon>
    </a>
  `
})
export class WidgetLinkComponent implements OnInit {

  @Input()
  link: WidgetLinkComponentModel;

  @Input()
  /**
   * will decide to render the <code>href</code> attribute or not
   */
  disabled: boolean;

  safeURL: SafeResourceUrl;

  get href() {
    return !this.disabled && this.link.href ? this.safeURL : null
  }

  constructor(public dialog: MatDialog, private domSanitizer: DomSanitizer) {

  }

  private safeResourceUrl(href: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(href)
  }

  ngOnInit(): void {
    /**
     * the safe-resource-url must be pre-rendered otherwise
     * the iframe re-loads periodically due to the change detection
     */
    if (this.link.href) {
      this.safeURL = this.safeResourceUrl(this.link.href)
    }
  }

  onClick(event) {
    if (this.link.overlay) {
      const dialogRef = this.dialog.open(WidgetLinkOverlayComponent, {
        height: '90%',
        width: '90%',
        data: {
          href: this.href,
          label: this.link.label,
          target: this.link.target,
          sandbox: this.link.sandbox,
          overlayClose: this.link.overlayClose,
          overlayOpen: this.link.overlayOpen
        }
      });
      return false
    }
  }

  toolTip(text) {
    if (null == text || typeof text === 'undefined')
      return text
    /**
     * don't show tooltips on mobile devices.
     * it may cause links not working on a first click.
     */
    return !isMobileDevice() ? text : null
  }
}
