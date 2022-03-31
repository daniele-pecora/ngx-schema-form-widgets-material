import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, OnChanges } from '@angular/core';
import { UIFormViewModel } from 'ngx-schema-form-view';

@Component({
  selector: 'app-resize',
  templateUrl: './resize.component.html',
  styleUrls: ['./resize.component.scss']
})
export class ResizeComponent implements OnInit, AfterViewInit {

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>()

  @Input()
  preferredSize: string

  uiInitialFormViewModel: UIFormViewModel = {
    actionsObject: {},
    bindingsObject: {},
    mapperObject: {},
    modelObject: {},
    schemaObject: { properties: {} },
    formModelObject: {},
    validatorsObject: {}
  }

  formModel: UIFormViewModel = {
    actionsObject: {},
    bindingsObject: {},
    mapperObject: {},
    modelObject: {
      // resize: '6'
    },
    schemaObject: {
      type: 'object',
      properties: {
        resize: {
          title: 'Size',
          type: 'string',
          oneOf: [{
            enum: ['4'],
            description: '4'
          }, {
            enum: ['6'],
            description: '6'
          }, {
            enum: ['8'],
            description: '8'
          }, {
            enum: ['10'],
            description: '10'
          }, {
            enum: ['12'],
            description: '12'
          }]
        }
      }
    },
    formModelObject: {
      widget: {
        id: 'form',
        asCard: false
      },
      properties: {
        resize: {
          widget: 'select-button'
        }
      }
    },
    validatorsObject: {}
  }

  constructor() {

  }

  ngOnInit() {
    this.formModel.modelObject['resize'] = `${this.preferredSize}`
    this.uiInitialFormViewModel = null
    this.uiInitialFormViewModel = this.formModel
  }

  ngAfterViewInit() {

  }

  onFormViewLoaded(event: any) {

  }

  onModelChanged(event: any) {
    this.change.emit(((event || { modelObject: {} }).modelObject || { resize: '' }).resize)
  }

  actionTrigger(event: any) {

  }
}
