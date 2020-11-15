import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileTypeHelper } from "./file-type.helper";

export const bytesToSizeString = (bytes: any) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

@Component({
  selector: 'ngx-ui-mat-fileUpload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss'],
  providers: [FileTypeHelper]
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
  invalidFileSizeMessageSummary: string = '{0}: Invalid file size, '
  @Input()
  invalidFileSizeMessageDetail: string = 'maximum upload size is {0}.'
  @Input()
  invalidFileTypeMessageSummary: string = '{0}: Invalid file type, '
  @Input()
  invalidFileTypeMessageDetail: string = 'allowed file types: {0}.'
  @Input()
  invalidFileLimitMessageSummary: string = 'Maximum number of files exceeded, '
  @Input()
  invalidFileLimitMessageDetail: string = 'limit is {0} at most.'
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

  @Output()
  onSelect: EventEmitter<{ files: File[] }> = new EventEmitter()
  // not yet implemented
  @Output()
  onUpload: EventEmitter<{ files: File[] }> = new EventEmitter()
  // not yet implemented
  @Output()
  onProgress: EventEmitter<{ files: File[] }> = new EventEmitter()
  // not yet implemented
  @Output()
  onBeforeSend: EventEmitter<{ files: File[] }> = new EventEmitter()
  // not yet implemented
  @Output()
  onError: EventEmitter<{ files: File[] }> = new EventEmitter()
  // not yet implemented
  @Output()
  onClear: EventEmitter<{ files: File[] }> = new EventEmitter()
  // not yet implemented
  @Output()
  onRemove: EventEmitter<{ files: File[] }> = new EventEmitter()

  /**
   *
   */

  @Input()
  required

  @Input()
  fileLimit

  uploadedFileCount:number = 0

  @ViewChild('fileUpload')
  fileUpload: ElementRef

  inputFileName: string

  @Input()
  files: File[] = []

  msgs: Message[]

  constructor(private sanitizer: DomSanitizer, private fileTypeHelper: FileTypeHelper) {

  }

  onClick(event) {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }

  onInput(event) {

  }

  async onFileSelected(event) {
    let files = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files : event.target.files;

    const filterInvalidFiles = await this.checkFileValidity(Array.isArray(files) ? files : Object.keys(files).map((key) => files[key]))
    const _files = []
    for (const file of filterInvalidFiles) {
        if (this.validate(file)) {
          if (this.isImage(file)) {
            file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
            file.sanitizedURL = file.objectURL
          } else {
            file.objectURL = this.sanitizer.bypassSecurityTrustResourceUrl((window.URL.createObjectURL(file)));
            file.sanitizedURL = file.objectURL
          }
          if (!this.isMultiple()) {
            this.files = []
          }
          this.files.push(file);
          _files.push(file)
        }
    }

    this.onSelect.emit({ files: _files })
    
    this.upload(_files)
  }

  upload(files: File[]) {
    if (this.uploadHandler) {
      this.uploadHandler.emit({ files: files })
    } else {
      // TODO http upload
      console.warn('WARNING: HTTP upload not yet implemented!')
    }
  }

  async checkFileValidity(files) {
    const accept = this.accept//this.schema.widget.accept
    const msgs = this.msgs || []
    const removeFile = (file, fileArray) => {
      if (!fileArray)
        return
      const index = fileArray.indexOf(file)
      if (index !== -1) {
        fileArray.splice(index, 1);
      }
    }
    const filesToFilter = (Array.isArray(files) ? files : [files])
    const filteredFiles = []
    for await (const file of filesToFilter) {
      const matchingFileType = await this.fileTypeHelper.fileSingatureMatchesMimeType(file, accept)
      if (!matchingFileType) {
        msgs.push({
          severity: 'error',
          summary: (this.invalidFileTypeMessageSummary || '').replace('{0}', file.name),
          detail: (this.invalidFileTypeMessageDetail || '').replace('{0}', accept)
        })

        removeFile(file, this.files)
      } else {
        filteredFiles.push(file)
      }
    }

    this.msgs = msgs
    return filteredFiles
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
    if (this.files) {/* check if already uploaded*/
      for (const f of this.files) {
        if (f.name === file.name
          && f.lastModified === file.lastModified
          && f.size === file.size
          && f.type === file.type
        ) {
          return false
        }
      }
    }
    /* is done via `this.fileTypeHelper.fileSingatureMatchesMimeType(file, accept)`
    if (this.accept && !this.isFileTypeValid(file)) {
      this.msgs.push({
        severity: 'error',
        summary: this.invalidFileTypeMessageSummary.replace('{0}', file.name),
        detail: this.invalidFileTypeMessageDetail.replace('{0}', this.accept)
      });
      return false;
    }
    */
    if (this.maxFileSize && file.size > this.maxFileSize) {
      this.msgs.push({
        severity: 'error',
        summary: this.invalidFileSizeMessageSummary.replace('{0}', file.name),
        detail: this.invalidFileSizeMessageDetail.replace('{0}', bytesToSizeString(this.maxFileSize))
      });
      return false;
    }
    return true
  }

  checkFileLimit() {
    if (this.isFileLimitExceeded()) {
      this.msgs.push({
        severity: 'error',
        summary: this.invalidFileLimitMessageSummary.replace('{0}', this.fileLimit.toString()),
        detail: this.invalidFileLimitMessageDetail.replace('{0}', this.fileLimit.toString())
      });
    }
  }

  isFileLimitExceeded() {
    return this.fileLimit && this.fileLimit < this.files.length + this.uploadedFileCount;
  }


  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }


  isMultiple(): boolean {
    return this.multiple
  }

}

export interface Message {
  severity: string
  detail: string
  summary: string
}