import { Input, OnDestroy } from "@angular/core";
import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { FormProperty, Widget } from "ngx-schema-form";

@Component({
    selector: 'ngx-ui-widget-title',
    templateUrl: './widget-title.component.html'
})
export class WidgetTitleComponent implements OnInit, OnDestroy {

    @Input()
    formProperty: FormProperty
    @Input()
    title: string // the title to use
    @Input()
    cssClass: string // the css class to add to the heading element

    get schema() {
        return this.formProperty.schema
    }

    get isRoot() {
        return !this.formProperty.root || this.formProperty.root == this.formProperty
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
    }
}