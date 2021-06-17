import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, Renderer2 } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { LogService } from "ngx-schema-form";
import { ImageInfo, ImageRules, ImageValidationResult, ImageValidator } from "./file-image-validator";
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
  providers: [FileTypeHelper, ImageValidator]
})
export class FileuploadComponent implements AfterViewInit {
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

  uploadedFileCount: number = 0

  @ViewChild('fileUpload')
  fileUpload: ElementRef

  inputFileName: string

  @Input()
  files: File[] = []

  msgs: Message[]

  @Input()
  imageRules: ImageRules // schema.widget.imageRules
  @Input()
  invalidImageDimensionsMessageSummary = 'Image doesn\'t match requirements, '//schema.widget.invalidImageDimensionsMessageSummary
  @Input()
  invalidImageDimensionsMessageDetail = 'it\'s either too big, too small or has the wrong orientation.' //schema.widget.invalidImageDimensionsMessageDetail


  @Input() // aria-labelledby
  ariaLabelledby
  @Input() // aria-label
  ariaLabel
  @Input() // titel
  title

  constructor(private sanitizer: DomSanitizer, private fileTypeHelper: FileTypeHelper
    , private imageValidator: ImageValidator
    , private logService: LogService
    , private elementRef: ElementRef
    , private renderer: Renderer2) {

  }

  ngAfterViewInit(): void {
    /**
     * make the fileinput WAI-ARIA compatibel:
     * this put the focus immediately to the underlying input[type=file] 
     * and not the link that has the function of a button
     */
    const button = this.elementRef.nativeElement.querySelector('a[mat-raised-button]')
    if (button) {
      this.renderer.setAttribute(button, 'tabindex', '-1')
      this.renderer.setAttribute(button, 'aria-disabled', 'true')
    }
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
      // console.warn('WARNING: HTTP upload not yet implemented!')
      this.logService.warn('WARNING: HTTP upload not yet implemented!')
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
        let addFile = true
        if (this.imageRules && this.isNonReadableImage(file)) {
          this.logService.error(`Rejecting image because it's a non-readable image format '${file.type}' and has image rules that can\'t be verified. Don't use this type of image together with 'imageRules'`, this.imageRules)
          addFile = false
        }
        if (this.isImage(file) && !this.isNonReadableImage(file)) {
          const vRes = await this.checkImageDimensions(file)
          file['______vRes'] = vRes
          if (!vRes.validationResult.valid) {
            addFile = false

            msgs.push({
              severity: 'error',
              summary: (this.invalidImageDimensionsMessageSummary || '').replace('{0}', ''),
              detail: (this.invalidImageDimensionsMessageDetail || '').replace('{0}', '')
            })

            removeFile(file, this.files)
          }
          this.logService.error('Rejecting image because of validation result:', vRes, 'and rules:', this.imageRules)
        }
        if (addFile)
          filteredFiles.push(file)
      }
    }

    this.msgs = msgs
    return filteredFiles
  }

  async checkImageDimensions(file: File): Promise<{ imageInfo: ImageInfo, imageSrc: any, validationResult: ImageValidationResult }> {
    const imageSrc = await new Promise<any>((resolve1, reject1) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        resolve1(reader.result)
      }
      reader.onerror = (event) => {
        reject1(event)
      }
      reader.onabort = (event) => {
        reject1(event)
      }
      reader.readAsDataURL(file)
    })
    const imageInfo = await this.imageValidator.getImageInfo(imageSrc)
    return new Promise<{ imageInfo: ImageInfo, imageSrc: any, validationResult: ImageValidationResult }>((resolve, reject) => {
      const imageRules = this.imageRules || { oneOf: [], allOf: [] }
      const validationResult: ImageValidationResult = this.imageValidator.validate(imageRules as ImageRules, imageInfo)
      resolve({
        imageInfo: imageInfo,
        imageSrc: imageSrc,
        validationResult: validationResult
      })
    })
  }

  isImage(file: File): boolean {
    return /^image\//.test(file.type)
  }
  
  isNonReadableImage(file: File): boolean {
    if (file.hasOwnProperty('___isImage_tiff')) {
      return file['___isImage_tiff']
    }
    return file['___isImage_tiff'] = /^image\/tiff?$/.test(file.type)
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