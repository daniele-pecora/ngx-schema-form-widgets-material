import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileTypeHelper } from "./file-type.helper";

@Component({
  selector: 'ngx-ui-mat-fileUpload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent {
  @Input()
  mode
  @Input()
  name
  @Input()
  url
  @Input()
  method
  @Input()
  multiple
  @Input()
  disabled
  @Input()
  accept
  @Input()
  maxFileSize
  @Input()
  auto = true
  @Input()
  withCredentials
  @Input()
  invalidFileSizeMessageSummary
  @Input()
  invalidFileSizeMessageDetail
  @Input()
  invalidFileTypeMessageSummary
  @Input()
  invalidFileTypeMessageDetail
  @Input()
  previewWidth
  @Input()
  chooseLabel = 'Choose'
  @Input()
  uploadLabel = 'Upload'
  @Input()
  cancelLabel = 'Cance'
  @Input()
  customUpload
  @Input()
  showUploadButton
  @Input()
  showCancelButton


  @Input()
  dataUriPrefix
  @Input()
  deleteButtonLabel
  @Input()
  deleteButtonIcon = 'close'
  @Input()
  showUploadInfo


  @Output()
  uploadHandler: EventEmitter<{ files: File[] }> = new EventEmitter()

  /**
   *
   */

  @Input()
  required


  @ViewChild('fileUpload')
  fileUpload: ElementRef

  inputFileName: string

  @Input()
  files: File[] = []

  constructor(private sanitizer: DomSanitizer) {

  }

  onClick(event) {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }

  onInput(event) {

  }

  async onFileSelected(event) {
    let files = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files : event.target.files;
    // console.log('event:::', event)
    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      //if(!this.isFileSelected(file)){
      const matchingFileType = await new FileTypeHelper().fileSingatureMatchesMimeType(file, this.accept)
      if (matchingFileType)
        if (this.validate(file)) {
          if (this.isImage(file)) {
            file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
            file.sanitizedURL = file.objectURL
          } else {
            file.objectURL = this.sanitizer.bypassSecurityTrustResourceUrl((window.URL.createObjectURL(files[i])));
            file.sanitizedURL = file.objectURL
          }
          if (!this.isMultiple()) {
            this.files = []
          }
          this.files.push(files[i]);

          this.uploadHandler.emit({ files: [files[i]] })

          //  }
        }
      //}
    }
  }

  isImage(file: File): boolean {
    return /^image\//.test(file.type)
  }

  removeFile(event, file) {
    let ix
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1)
      this.clearInputElement()
    }
  }

  validate(file: File) {
    if (this.files)
      for (const f of this.files) {
        if (f.name === file.name
          && f.lastModified === file.lastModified
          && f.size === f.size
          && f.type === f.type
        ) {
          return false
        }
      }
    return true
  }

  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }


  isMultiple(): boolean {
    return this.multiple
  }

}
