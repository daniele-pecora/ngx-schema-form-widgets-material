import { Component, Input, OnChanges, SimpleChanges, SimpleChange, ViewChild, TemplateRef, Output, EventEmitter, AfterViewInit } from '@angular/core'
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog'


const defaultDialogConfig = new MatDialogConfig();

@Component({
    selector: 'ngx-ui-mat-dialog',
    templateUrl: './dialog.component.html'
})
export class DialogComponent implements OnChanges, AfterViewInit {
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
        // make sure dialog doesn't get bigger than the viewport
        maxWidth: '100vw', //defaultDialogConfig.maxWidth (default is 80vw, what is not that good on a mobile device),
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

    initedView = false
    constructor(public dialog: MatDialog) {

    }

    ngAfterViewInit(): void {
        this.initedView = true
        if (this.visible) {
            this.openDialog()
        } else {
            this.closeDialog()
        }
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
                    if (this.initedView) { // don't call if view is not yet inited
                        this.openDialog()
                    }
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
