import { Component, OnInit, Pipe, PipeTransform, Renderer2, AfterViewInit, ViewChild } from '@angular/core'
import { ControlWidget } from 'ngx-schema-form'
import {Message} from '../_domain/message'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { bytesToSizeString, FileuploadComponent } from './fileupload.component'

@Component({
  selector: 'ngx-ui-file-widget',
  templateUrl: './file.widget.html',
  styleUrls: ['./file.widget.scss']
})
export class FileWidgetComponent extends ControlWidget implements OnInit, AfterViewInit {
  msgs: Message[]

  uploadedFiles: any[] = []
  files: File[]
  
  @ViewChild('fileUploadEl')
  fileUploadEl: FileuploadComponent

  /**
   * use this sanitizer to allow blob url:<br/>
   * e.g. <code>blob:https://localhost:4200/135e8a42-da06-4029-80ac-33a3e39893f4</code>
   * @param {string} url
   * @returns {SafeUrl}
   */
  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url)
  }

  constructor(private sanitizer: DomSanitizer, private renderer2: Renderer2) {
    super()
  }

  ngOnInit() {
    this.uploadedFiles = this.formProperty['_____uploadedFiles'] || []
    if (!this.formProperty['_____uploadedFiles']) {
      this.restoreFromValue()
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit()
  }

  private updateFromPropertyUploadedFiles() {
    this.formProperty['_____uploadedFiles'] = this.uploadedFiles
  }

  restoreFromValue() {
    const createBlobFromDataURI = (dataURI): Blob => {
      let byteString
      let mimeString
      let ia

      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1])
      } else {
        byteString = encodeURI(dataURI.split(',')[1])
      }
      // separate out the mime component
      mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to a typed array
      ia = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia], { type: mimeString })
    }
    if (this.formProperty.value) {
      const values = Array.isArray(this.formProperty.value) ? this.formProperty.value : [this.formProperty.value]
      this.uploadedFiles = []
      for (const value of values) {
        const file: Blob = createBlobFromDataURI(
          value.startsWith('data:')
            ? value
            : 'data:,' + value
        )
        if (file) {
          file['objectURL'] = {
            'changingThisBreaksApplicationSecurity': value
          }
          this.uploadedFiles.push(this.sanitizeURL(file))
        }
      }
    }
  }

  private sanitizeURL(file) {
    /**
     * Sanitizing the URL forehand<br/>
     * allowes to set the <code>src</code> as a variable binding <br/>
     * instead of using a method binding which will cause releoading the image constantly.<br/>
     */
    if (!file['sanitizedURL']) {
      /**
       * non image upload files will not contain the property 'objectURL'
       */
      if (!file['objectURL']) {
        /** create a safe resource url for non image files */
        file['objectURL'] = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file))
        file['sanitizedURL'] = file['objectURL']
      } else {
        /** create a safe url for image files */
        file['sanitizedURL'] = this.sanitize(file['objectURL']['changingThisBreaksApplicationSecurity'])
      }
    }
    return file
  }

  imageLoaded(event, file) {
    this.setImageDataValue(event.target, file)
  }
  imageLoadingFailed(event, file){
    file.previewFailed = true
    /** if it can't be red as image it must be red as object */
    this.setObjectDataValue(file)
  }
  objectLoaded(event, file) {
    this.setObjectDataValue(file)
  }
  objectLoadingFailed(event, file){
    file.previewFailed = true
    this.setObjectDataValue(file)
  }

  loadImage(file) {
    const i = document.createElement('img')
    i.onload = () => {
      this.setImageDataValue(i, file)
    }
    i.src = file.objectURL.changingThisBreaksApplicationSecurity

  }

  setImageDataValue(imgTag, file) {
    if (file && !file.hasOwnProperty('base64String')) {
      let img = this.renderer2.createElement('img')
      let file = this.uploadedFiles[0]
      img.onload = () => {
        const c = document.createElement('canvas')
        const ctx = c.getContext('2d')
        /**
         * Since the width and height of the image tag are only available 
         * after the image is loaded, they must be requested here
         * after the onload event.
         */
        c.width = img.width
        c.height = img.height
        ctx.drawImage(img, 0, 0)
        let base64String = c.toDataURL(file.type)
        file.base64String = base64String

        this.updateControlValue(base64String)
      }
      img.src = file.sanitizedURL.changingThisBreaksApplicationSecurity
    }
  }

  setObjectDataValue(file) {
    const this_control = this.control
    //Read File

    //Check File is not Empty
    if (file.size > 0) {
      // FileReader function for read the file.
      const fileReader = new FileReader()
      let base64String
      // Onload of file read the file content
      fileReader.onload = (fileLoadedEvent) => {
        base64String = fileLoadedEvent.target['result']

        this.updateControlValue(base64String)
      }
      // Convert data to base64
      fileReader.readAsDataURL(file)
    }
  }

  updateControlValue(base64String: string) {
    /**
     * remove data uri prefix like
     * {@code data:image/png;base64,}
     */
    if (this.schema.widget.dataUriPrefix === false && base64String.startsWith('data:')) {
      base64String = base64String.substr(base64String.indexOf(',') + 1, base64String.length)
    }
    // TODO add support for multiple files
    this.control.setValue(base64String)
  }

  onUploadWithCustomHandler(event) {
    if (!this.isMultiple()) {
      this.uploadedFiles = []
    }
    for (const file of event.files) {
      if (-1 !== this.uploadedFiles.indexOf(file))
        continue
      this.uploadedFiles.push(this.sanitizeURL(file))
    }
    this.updateFromPropertyUploadedFiles()

    this.checkForMessages()
  }

  onUpload(event) {
    if (!this.isMultiple()) {
      this.uploadedFiles = []
    }
    for (const file of event.files) {
      this.uploadedFiles.push(this.sanitizeURL(file))
    }

    this.msgs = []
    this.msgs.push({ severity: 'info', summary: 'Success', detail: 'File Uploaded' })

    this.updateFromPropertyUploadedFiles()

    this.checkForMessages()
  }

  checkForMessages() {
    const msgs = [].concat(this.fileUploadEl.msgs||[]).concat(this.msgs||[])
    if ((msgs || []).length) {
      const _msg = msgs[0]
      const errMsg = {
        code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
        path: `#${this.formProperty.path}`,
        message: `${_msg.summary||''}${_msg.detail||''}`,
        params: [],
        severity: _msg.severity,
        title: _msg.summary
      }
      const control = this.control
      control.markAsDirty()
      control.markAsTouched()
      control.setErrors([errMsg], { emitEvent: true })
      control.setValue('', { emitEvent: true })
      this.formProperty.extendErrors([errMsg])
    }
  }

  onBeforeSend(event) {

  }

  onProgress(event) {

  }

  onClear(event) {
    this.uploadedFiles = []
    this.control.setValue('')
    /**
     * reset also in file upload widget
     */
    this.files = []

    this.updateFromPropertyUploadedFiles()
  }

  onSelect(event) {
    this.checkForMessages()
  }

  onError(event) {
    console.error('onError', event)
  }

  onRemove(event) {
    this.uploadedFiles = this.uploadedFiles.filter(
      value => event.file.objectURL.changingThisBreaksApplicationSecurity !== value.objectURL.changingThisBreaksApplicationSecurity)

    this.updateFromPropertyUploadedFiles()
  }

  deleteFileInBasicUpload(event, file) {
    this.onClear(event)
  }


  isBoolean(value): boolean {
    return 'boolean' === typeof value
  }

  bytesToSize(val: any) {
    return new ByteSizeFormatPipe().bytesToSize(val)
  }

  isMultiple(): boolean {
    return this.schema.widget.multiple === 'multiple'
  }

  isImage(file: File): boolean {
    if (file.hasOwnProperty('___isImage')) {
      return file['___isImage']
    }
    return file['___isImage'] = /^image\//.test(file.type)
  }

  createAltText(file: File) {
    if (file['_previewTitle']) {
      return file['_previewTitle']
    }
    let previewTitle = this.schema.widget.previewTitle
    if (previewTitle) {
      previewTitle = previewTitle.replace(new RegExp('{filename}', 'ig'), file.name)
      previewTitle = previewTitle.replace(new RegExp('{filesize}', 'ig'), this.bytesToSize(file.size).toUpperCase())

      let previewTitleImageDimensions = this.schema.widget.previewTitleImageDimensions || ''
      if (previewTitleImageDimensions) {
        if (file['______vRes']) {
          const a: any = file['______vRes']
          if (a) {
            previewTitleImageDimensions = previewTitleImageDimensions.replace(new RegExp('{imageDimensionPixelW}', 'ig'), `${a.imageInfo.dimensions.px.w}`)
            previewTitleImageDimensions = previewTitleImageDimensions.replace(new RegExp('{imageDimensionPixelH}', 'ig'), `${a.imageInfo.dimensions.px.h}`)
            previewTitleImageDimensions = previewTitleImageDimensions.replace(new RegExp('{imageDimensionInchesW}', 'ig'), `${a.imageInfo.dimensions.in.w}`)
            previewTitleImageDimensions = previewTitleImageDimensions.replace(new RegExp('{imageDimensionInchesH}', 'ig'), `${a.imageInfo.dimensions.in.h}`)
            previewTitleImageDimensions = previewTitleImageDimensions.replace(new RegExp('{imageDimensionCentimetersW}', 'ig'), `${a.imageInfo.dimensions.cm.w}`)
            previewTitleImageDimensions = previewTitleImageDimensions.replace(new RegExp('{imageDimensionCentimetersH}', 'ig'), `${a.imageInfo.dimensions.cm.h}`)

            // set into preview title
            previewTitle = previewTitle.replace(new RegExp('{previewTitleImageDimensions}', 'ig'), previewTitleImageDimensions)
          }
        }
      }
      // clean preview title if it wasn't an image
      previewTitle = previewTitle.replace(new RegExp('{previewTitleImageDimensions}', 'ig'), '')

      file['_previewTitle'] = previewTitle
      return file['_previewTitle']
    }
    return null
  }
}


@Pipe({
  name: 'byteFormat'
})
export class ByteSizeFormatPipe implements PipeTransform {
  transform(value: any): any {
    return this.bytesToSize(value)
  }

  bytesToSize(bytes: any) {
    return bytesToSizeString(bytes)
  }
}
