import {AfterViewInit, Component} from '@angular/core'
import {ObjectLayoutWidget} from 'ngx-schema-form';
import {SafeUrl, DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'ngx-ui-html-widget',
  templateUrl: './html.widget.html'
})
export class HtmlWidgetComponent extends ObjectLayoutWidget implements AfterViewInit {

  htmlContent: SafeHtml

  /**
   * use this sanitizer to allow blob url:<br/>
   * e.g. {@code blob:http://aasdfasdfasdf}
   * @param {string} url
   * @returns {SafeUrl}
   */
  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  constructor(private sanitizer: DomSanitizer) {
    super()
  }

  ngAfterViewInit(): void {
    this.htmlContent = this.getSaveContent()
  }

  getUrl(): SafeUrl {
    return this.sanitize(this.schema.widget.url)
  }

  getSaveContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getContent())
  }

  getContent(): string {
    let content = ''
    if (!this.schema.widget.url) {
      if (this.schema.description) {
        content += `<p>${this.schema.description}</p>`
      }
    }
    if (this.schema.widget.html) {
      const html = Array.isArray(this.schema.widget.html) ? this.schema.widget.html.join('') : this.schema.widget.html
      content += `${html}`
    }
    return content
  }

  getFrameContent(): string {
    let content = ''
    if (!this.schema.widget.url) {
      if (this.schema.description) {
        content += `<p>${this.schema.description}</p>`
      }
    }
    if (this.schema.widget.frame) {
      content += `${this.schema.widget.frame}`
    }
    return content
  }
}
