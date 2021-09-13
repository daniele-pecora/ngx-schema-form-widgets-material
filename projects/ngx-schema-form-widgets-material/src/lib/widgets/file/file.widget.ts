import { Component, OnInit, Pipe, PipeTransform, Renderer2, AfterViewInit, ViewChild } from '@angular/core'
import { ControlWidget, LogService } from 'ngx-schema-form'
import { Message } from '../_domain/message'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { bytesToSizeString, FileuploadComponent } from './fileupload.component'
import { NoHelperTextSpacer } from '../_component-helper/no-helpertext-spacer.widget'
import { TargetsHelper } from '../_component-helper/_targets.helper'
import { ExpressionCompiler } from '../_service/expression-complier.service'

@Component({
  selector: 'ngx-ui-file-widget',
  templateUrl: './file.widget.html',
  styleUrls: ['./file.widget.scss', '../_component-helper/no-helpertext-spacer.widget.scss']
})
export class FileWidgetComponent extends NoHelperTextSpacer implements OnInit, AfterViewInit {
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

  targetsHelper: TargetsHelper
  constructor(private sanitizer: DomSanitizer, private renderer2: Renderer2,
    private expressionCompiler: ExpressionCompiler
    , private logService: LogService) {
    super()
  }

  async ngOnInit() {
    this.targetsHelper = new TargetsHelper(this.formProperty, this.expressionCompiler)
    this.uploadedFiles = this.formProperty['_____uploadedFiles'] || []
    if (!this.formProperty['_____uploadedFiles']) {
      this.restoreFromValue()
    }
  }

  ngAfterViewInit() {
    // enable formProperty.reset(...)
    const control = this.control
    this.formProperty.valueChanges.subscribe((newValue) => {
      if (control.value !== newValue) {
        if (!newValue) {
          this.onClear(null)
        }
      }
    })
    // end - enable formProperty.reset(...)
    super.ngAfterViewInit()
  }

  private updateFromPropertyUploadedFiles() {
    this.formProperty['_____uploadedFiles'] = this.uploadedFiles
  }

  async restoreFromValue() {
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
        let file: Blob
        if (this.schema.widget.useURL) {
          file = await fetch(value).then(r => r.blob())
          file['_uploadURL'] = value
        } else {
          file = createBlobFromDataURI(
            value.startsWith('data:')
              ? value
              : 'data:,' + value
          )
        }
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
  imageLoadingFailed(event, file) {
    file.previewFailed = true
    /** if it can't be red as image it must be red as object */
    this.setObjectDataValue(file)
  }
  objectLoaded(event, file) {
    this.setObjectDataValue(file)
  }
  objectLoadingFailed(event, file) {
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
    if (file && this.schema.widget.useURL) {
      this.updateControlValue(file['_uploadURL'])
      return
    }
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

        this.updateTargetValues(file)
      }
      img.onerror = () => {
        this.updateTargetValues(null)
      }
      img.src = file.sanitizedURL.changingThisBreaksApplicationSecurity

      // TODO: this.resizeImage(file, 200, 200)
    }
  }

  setObjectDataValue(file) {
    if (file && this.schema.widget.useURL) {
      this.updateControlValue(file['_uploadURL'])
      return
    }
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

        this.updateTargetValues(file)
      }
      fileReader.onerror = () => {
        this.updateTargetValues(null)
      }
      // Convert data to base64
      fileReader.readAsDataURL(file)
    }
  }

  // === RESIZE ====
  async resizeImage(file: File, max_width, max_height) {

    const imageSrc = await new Promise<any>((resolve1, reject1) => {
      const reader = new FileReader()
      reader.onload = async (event: any) => {
        resolve1(event.target.result)
      }
      reader.onerror = (event) => {
        reject1(event)
      }
      reader.onabort = (event) => {
        reject1(event)
      }
      reader.readAsArrayBuffer(file)
    })

    // blob stuffs
    const blob = new Blob([imageSrc], { type: file.type })
    window.URL = window.URL || window.webkitURL
    const blobURL = window.URL.createObjectURL(blob)

    const img = await new Promise<any>((resolve2, reject2) => {
      const img = new Image()
      img.onload = (event) => {
        resolve2(event.target)
      }
      img.onerror = (event) => {
        reject2(null)
      }
      img.onabort = (event) => {
        reject2(null)
      }
      img.src = blobURL
    })

    const canvas = document.createElement('canvas')
    let width = img.width
    let height = img.height

    if (width > height) {
      if (width > max_width) {
        height = Math.round(height *= max_width / width)
        width = max_width
      }
    } else {
      if (height > max_height) {
        width = Math.round(width *= max_height / height)
        height = max_height
      }
    }

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0, width, height)

    const dataURL = canvas.toDataURL(
      file.type
      //'image/jpeg'
      , 0.7) // get the data from canvas as 70% JPG (can be also PNG, etc.)
    // console.log('resizedB64DataURL', dataURL)
    document.body.prepend(canvas)
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

  __deprecated_onUploadWithCustomHandler(event) {
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

  __deprecated_onUpload(event) {
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

  onUploadWithCustomHandler(event) {
    /* await */this.doUpload(event, false)
  }

  onUpload(event) {
    /* await */this.doUpload(event, false)
  }

  /* async */doUpload(event, propagateSuccesMsg: boolean) {
    // - POC - use image urls returned by upload service
    const useImageURLProvidedByUploadService = (file) => {
      /**
       * If the upload service provides a json array containing the url where the uploaded file 
       * can be accessed then that url will be used for the preview
       */
      if (event.originalEvent && event.originalEvent.body && Array.isArray(event.originalEvent.body) && event.originalEvent.body[0]) {
        file['sanitizedURL'] = this.sanitize(event.originalEvent.body[0])
        file['_uploadURL'] = event.originalEvent.body[0]
      }
      return file
    }
    // - POC - use image urls returned by upload service

    if (!this.isMultiple()) {
      this.uploadedFiles = []
    }
    const filterInvalidFiles = event.files /*await this.checkFileValidity(event.files) - the files are already checked in fileupload.component.ts */
    if ((filterInvalidFiles || []).length) {
      for (const file of filterInvalidFiles) {
        if (-1 !== this.uploadedFiles.indexOf(file))// no duplicates
          continue
        this.uploadedFiles.push(this.sanitizeURL(useImageURLProvidedByUploadService(file)))
      }
      if (propagateSuccesMsg) {
        this.msgs = []
        this.msgs.push({ severity: 'info', summary: 'Success', detail: ' File Uploaded' })
      }
      this.updateFromPropertyUploadedFiles()
    }
    this.checkForMessages()
  }

  checkForMessages() {
    const msgs = [].concat(this.fileUploadEl.msgs || []).concat(this.msgs || [])
    if ((msgs || []).length) {
      const _msg = msgs[0]
      const errMsg = {
        code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
        path: `#${this.formProperty.path}`,
        message: `${_msg.summary || ''}${_msg.detail || ''}`,
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
    this.updateTargetValues(null)
  }

  onSelect(event) {
    /**
     * required to show messages when uploading a file 
     * that doesn't match content-type with the 'accept' attribute
     */
    this.checkForMessages()
  }

  onError(event) {
    this.logService.error('onError', event)
    if (true) {
      this.msgs = []
      this.msgs.push({ severity: 'error', summary: 'Failed', detail: ' Upload failed' })
    }
    this.onClear(event)
    this.checkForMessages()
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

  createPreviewAltText(file: File) {
    return this.fillPlaceholder(file, '_previewTitle', this.schema.widget.previewTitle || '')
  }

  createButtonAltDelete(file: File) {
    return this.fillPlaceholder(file, '_deleteButtonTitle', this.schema.widget.deleteButtonTitle || '')
  }

  createButtonAltUpload(file: File) {
    return this.fillPlaceholder(file, '_uploadButtonTitle', this.schema.widget.uploadButtonTitle || '')
  }

  fillPlaceholder(file: File, varName: string, labelText: string) {
    if (file[varName]) {
      return file[varName]
    }
    if (labelText) {
      labelText = labelText.replace(new RegExp('{filename}', 'ig'), file.name)
      labelText = labelText.replace(new RegExp('{filesize}', 'ig'), this.bytesToSize(file.size).toUpperCase())
      labelText = this.makeReplacement_ImageDimensionText(file, labelText)
      file[varName] = labelText
      return file[varName]
    }
    return null
  }

  makeReplacement_ImageDimensionText(file: File, labelText: string) {
    let imageDimensions = this.schema.widget.previewTitleImageDimensions || ''
    if (imageDimensions) {
      if (file['______vRes']) {
        const a: any = file['______vRes']
        if (a) {
          if (file['_imageDimensionsText']) {
            imageDimensions = file['_imageDimensionsText']
          } else {
            imageDimensions = imageDimensions.replace(new RegExp('{imageDimensionPixelW}', 'ig'), `${a.imageInfo.dimensions.px.w}`)
            imageDimensions = imageDimensions.replace(new RegExp('{imageDimensionPixelH}', 'ig'), `${a.imageInfo.dimensions.px.h}`)
            imageDimensions = imageDimensions.replace(new RegExp('{imageDimensionInchesW}', 'ig'), `${a.imageInfo.dimensions.in.w}`)
            imageDimensions = imageDimensions.replace(new RegExp('{imageDimensionInchesH}', 'ig'), `${a.imageInfo.dimensions.in.h}`)
            imageDimensions = imageDimensions.replace(new RegExp('{imageDimensionCentimetersW}', 'ig'), `${a.imageInfo.dimensions.cm.w}`)
            imageDimensions = imageDimensions.replace(new RegExp('{imageDimensionCentimetersH}', 'ig'), `${a.imageInfo.dimensions.cm.h}`)

            file['_imageDimensionsText'] = imageDimensions
          }
          // set into preview title
          labelText = labelText.replace(new RegExp('{previewTitleImageDimensions}', 'ig'), imageDimensions)
        }
      }
    }
    // clean preview title if it wasn't an image
    labelText = labelText.replace(new RegExp('{previewTitleImageDimensions}', 'ig'), '')
    return labelText
  }

  updateUploadButtonTitle() {
    const input = this.fileUploadEl['el'].nativeElement.querySelector('input')
    if (input) {
      const label = this.fileUploadEl['el'].nativeElement.parentElement.querySelector('label')
      if (label) {
        const labelId = 'label--' + this.id
        this.renderer2.setAttribute(label, 'id', labelId)
        this.renderer2.setAttribute(input, 'aria-labelledby', labelId)
      }
    }
  }

  // === FILE INFO ====

  private updateTargetValues(file: File): any | void {
    let resultItem = { file: null }
    if (file)
      resultItem = {
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          image: file['______vRes']
        }
      }
    this.targetsHelper.setTargetValues(resultItem)
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
