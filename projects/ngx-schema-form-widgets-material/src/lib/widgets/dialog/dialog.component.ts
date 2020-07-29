import { Component, Input, OnChanges, SimpleChanges, SimpleChange, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core'
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog'


const defaultDialogConfig = new MatDialogConfig();

@Component({
    selector: 'ngx-ui-mat-dialog',
    templateUrl: './dialog.component.html'
})
export class DialogComponent implements OnChanges {
    /**
     * visible is the only input with 2 way binding
     */
    @Input()
    visible: boolean
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>()

    @Input()
    closable
    @Input()
    closeOnEscape
    @Input()
    header
    @Input()
    responsive
    @Input()
    transitionOptions
    @Input()
    modal


    config = {
        disableClose: false,
        panelClass: 'custom-overlay-pane-class',
        hasBackdrop: true,
        backdropClass: '',
        width: '',
        height: '',
        minWidth: '',
        minHeight: '',
        maxWidth: defaultDialogConfig.maxWidth,
        maxHeight: '',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        },
        data: {
            // message: 'Jazzy jazz jazz'
        }
    };

    dialogRef: MatDialogRef<any> | null

    @ViewChild(TemplateRef) dialogContentTemplate: TemplateRef<any>

    constructor(public dialog: MatDialog) {

    }

    ngOnChanges(changes: SimpleChanges): void {

        const change_visible: SimpleChange = changes.visible
        const change_closable: SimpleChange = changes.closable
        const change_closeOnEscape: SimpleChange = changes.closeOnEscape
        const change_header: SimpleChange = changes.header
        const change_responsive: SimpleChange = changes.responsive
        const change_transitionOptions: SimpleChange = changes.transitionOptions
        const change_modal: SimpleChange = changes.modal

        if (change_visible) {
            /**
             * When visibility changes then update dialog visibility
             */
            if (change_visible.currentValue !== change_visible.previousValue) {
                if (change_visible.currentValue) {
                    this.openDialog()
                } else {
                    this.closeDialog()
                }
            }
        }
        if (change_header) {

        }
        if (change_closable) {
            this.config.disableClose = false === change_visible.currentValue
        }
        if (change_closeOnEscape) {
            this.config.disableClose = false === change_closeOnEscape.currentValue
        }
    }

    closeDialog() {
        if (this.dialogRef)
            this.dialogRef.close()
    }

    openDialog() {
        this.dialogRef = this.dialog.open(this.dialogContentTemplate, this.config);
        this.dialogRef.afterClosed().subscribe((result: string) => {
            this.visible = false
            this.visibleChange.emit(false)
            this.dialogRef = null
        })

        // no further events required here
        // this.dialogRef.beforeClose().subscribe((result: string) => {
        // })
        // this.dialogRef.backdropClick().subscribe((event) => {
        // })
    }
}
