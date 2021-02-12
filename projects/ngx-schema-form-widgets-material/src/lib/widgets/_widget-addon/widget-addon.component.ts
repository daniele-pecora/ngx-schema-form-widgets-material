import {Component, Input} from '@angular/core'

@Component({
  selector: 'ngx-ui-widget-addon',
  template: `
    <!--
          Render-Component of <code>prefix</code> and <code>suffix</code> of element 'widget':

            Expects an array of
            [{
              icon:string        = the icon name to set, may also contain the icon-set class. eg. "vi vi-pen"
              text:string        = the text to set
              ligature:boolean   = set if the icon name is a ligature name so it will be set as HTML content of the <i> tag
                                   ligature is supported only for "material-icons"
                                   to keep backward-compatibility default is true
             }]
    -->
    <ng-container *ngIf="!suffix;else suffixTemplate">
      <span matPrefix *ngFor="let addon of addons" class="ui-inputgroup-addon">
      <ng-container *ngTemplateOutlet="addonTemplate;context:{$implicit:addon, addon:addon}">
      </ng-container>
    </span>
    </ng-container>

    <ng-template #suffixTemplate>
      <span matSuffix *ngFor="let addon of addons" class="ui-inputgroup-addon">
        <ng-container *ngTemplateOutlet="addonTemplate;context:{$implicit:addon, addon:addon}">
        </ng-container>
      </span>
    </ng-template>

    <ng-template #addonTemplate let-addon>
      <i [attr.tabindex]="-1" [attr.aria-hidden]="true" *ngIf="(addon.icon && !addon.ligature); else ligatureIcon" class="{{addon.icon}}"></i>
      <ng-template #ligatureIcon>
        <i [attr.tabindex]="-1" [attr.aria-hidden]="true" *ngIf="addon.icon" class="material-icons">{{addon.icon}}</i>
      </ng-template>
      <span *ngIf="addon.text">{{addon.text}}</span>
    </ng-template>
  `
})
export class WidgetAddonComponent {
  @Input()
  addons: {
    icon?: string
    text?: string
    ligature?: boolean
  }[]

  @Input()
  suffix: boolean
}
