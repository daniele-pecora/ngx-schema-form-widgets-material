/**
 * Created by daniele on 13.07.17.
 */
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {BindingRegistry, SchemaValidatorFactory} from 'ngx-schema-form'
import {triggerBinding} from '../bindings-registry-helper'
import {AsyncSelectionWidgetComponent} from "../_base/async-selection-widget.component";
import {WidgetComponentHttpApiService} from "../_service/widget-component-http-api.service";
import { ExpressionCompiler } from '../_service/expression-complier.service';


@Component({
  selector: 'ngx-ui-select-widget',
  templateUrl: './select.widget.html',
  styleUrls: ['./select.widget.scss']
})
export class SelectWidgetComponent extends AsyncSelectionWidgetComponent implements OnInit, AfterViewInit, OnDestroy {

  // selectOptions: Array<any>
  // selectedOption: string;

  /** START: this will help to set the width of the dropdown */
  @ViewChild('hiddenSizeHolder')
  hiddenSizeHolder: ElementRef;
  pDropdownStyle: any = {};
  hiddenSizeHolderClass = 'placeholderFieldInvisible';

  selectDefaultSize = 20;
  _sizeFieldControlValue: number = this.selectDefaultSize; // default value for input fields is 20
  set sizeFieldControlValue(size: number) {
    this._sizeFieldControlValue = size;
    this.calculateDropdownSize()
  }

  get sizeFieldControlValue(): number {
    return this._sizeFieldControlValue
  }

  autoWidth: boolean;

  constructor(protected schemaValidatorFactory: SchemaValidatorFactory, protected lookupService: WidgetComponentHttpApiService, private bindingRegistry: BindingRegistry, protected expressionCompiler: ExpressionCompiler) {
    super(schemaValidatorFactory, lookupService, expressionCompiler)
  }

  /** END: this will help to set the width of the dropdown */

  ngOnInit(): void {
    if ('auto' !== this.schema.widget.size) {
      this._sizeFieldControlValue = this.schema.widget.size || this.selectDefaultSize
    }

    // this will call 'this.loadInitialOptions()'
    super.ngOnInit();

    if (!(this.schema.widget || {}).hasOwnProperty('size')) {
      // use input field default size
      this.autoWidth = false
    } else if ((this.schema.widget || {}).size === 'auto') {
      this.autoWidth = true
    } else if ((this.schema.widget || {}).size && (this.schema.widget || {}).size !== 'auto') {
      // if any value is given don't use autoWidth
      this.autoWidth = false
    } else {
      this.autoWidth = true
    }
    /**
     * Fix: since angular-material-dropdown 'onSelctionChange' happens before the value has
     * arrived at the FormProperty the binding will not have that value.
     * So we bind to the FormProperty it itself instead
     */
    this.formProperty.valueChanges.subscribe((event)=>{
        this.onChange(event)
    })
  }


  protected onLoadingInitialOptionsAjaxStarted() {
    // TODO show some indicator
  }

  protected onLoadingInitialOptionsReady() {
    // TODO show some indicator
  }

  /** START: this will help to set the width of the dropdown */
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (!this.autoWidth) {
      this.sizeFieldControlValue = this.schema.widget.size || this.selectDefaultSize
    }
  }

  calculateDropdownSize() {
    this.pDropdownStyle['width'] = `${this.hiddenSizeHolder.nativeElement.offsetWidth}px`
  }

  updateSize(event) {
    setTimeout(() => {
      this.calculateDropdownSize()
    }, 10)
  }

  /** END: this will help to set the width of the dropdown */


  onChange(event) {
    triggerBinding(this, 'change', event, this.bindingRegistry, this.formProperty)
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
