import { AfterViewInit, Component, SecurityContext } from '@angular/core'
import { ObjectLayoutWidget } from 'ngx-schema-form';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import simpleParser from './simple-bbcode.parser'
import { escapeHTMLInBBCode } from '../_converters/_data/bbcode.converter';

@Component({
  selector: 'ngx-ui-bbcode-widget',
  templateUrl: './bbcode.widget.html'
})
export class BbcodeWidgetComponent extends ObjectLayoutWidget implements AfterViewInit {

  htmlContent: SafeHtml

  constructor(private sanitizer: DomSanitizer) {
    super()
  }

  ngAfterViewInit(): void {
    this.htmlContent = this.getSaveContent()
  }

  getSaveContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getContent())
  }

  getContent(): string {
    let content = ''
    if (this.schema.description) {
      content += `<p>${this.schema.description}</p>`
    }
    if (this.schema.widget.bbcode) {
      const bbcode = escapeHTMLInBBCode(this.schema.widget.bbcode)
      // should not use SecurityContext.HTML, it will remove the support for 'url=...|onclick'
      content += simpleParser.parse(this.sanitizer.sanitize(SecurityContext.NONE,`${bbcode}`))
    }
    return content
  }

}
