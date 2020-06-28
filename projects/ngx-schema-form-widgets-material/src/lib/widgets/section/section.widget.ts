/**
 * Created by daniele on 03.04.19.
 */
import { Component, AfterViewInit } from "@angular/core";
import { ObjectLayoutWidget } from "ngx-schema-form";


@Component({
  selector: 'ngx-ui-form-section',
  templateUrl: './section.widget.html',
  styleUrls: ['./section.widget.scss']
})
export class SectionWidgetComponent extends ObjectLayoutWidget {
  currentPage = 0

  ngAfterViewInit() {
    super.ngAfterViewInit()

    if (this.schema.widget['startSection']) {
      this.currentPage = (this.formProperty['propertiesId'] || []).indexOf(this.schema.widget['startSection'])
    }
  }

  onTabClose_Tabview(event: any) {
  }

  onTabOpen_Accordion(event: { originalEvent: any, index: number }) {
    this.currentPage = event.index
  }

  onTabClose_Accordion(event: { originalEvent: any, index: number }) {
  }

  testTypeObject(object: any) {
    return typeof object === 'object'
  }

  onTabChange_Tabview(event: { originalEvent: any, index: number }) {
  }

}
