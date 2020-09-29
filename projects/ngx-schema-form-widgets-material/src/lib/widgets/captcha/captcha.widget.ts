/**
 * Created by daniele on 13.07.17.
 */
import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core'
import { ControlWidget } from 'ngx-schema-form'
import { NgxRecaptchaComponent } from 'ngx-recaptcha-easy'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import simpleParser from '../bbcode/simple-bbcode.parser'
import { escapeHTMLInBBCode } from '../_converters/_data/bbcode.converter';
import { SecurityContext } from '@angular/core'
import { DOCUMENT } from '@angular/common'

@Component({
  selector: 'ngx-ui-captcha-widget',
  templateUrl: './captcha.widget.html'
})
export class CaptchaWidgetComponent extends ControlWidget implements OnInit {

  captchaloaded: boolean
  captchaloadingerror: boolean
  @ViewChild(NgxRecaptchaComponent, { static: false }) captcha: NgxRecaptchaComponent

  captchaNameId = this.id
  initCallback

  showCAPTCHA = false
  requiresConsent = false
  consentContentDefault = '[size=14]This form uses ReCaptcha [img=https://www.gstatic.com/recaptcha/api2/logo_48.png height=25]. [br]Before sending the form, [u][url=https://policies.google.com/privacy? target=_blank]please accept cookies before sending the form[/url][/u][/size]'
  consentCookieNameDefault = 'ngx-ui-captcha-widget-ReCAPTCHA-consentCookie'
  consentPromptDefault = 'I agree'
  consentTitleDefault = 'Required privacy policy agreement'
  htmlContent: SafeHtml

  constructor(private sanitizer: DomSanitizer, @Inject(DOCUMENT) private document: Document, private zone: NgZone) {
    super()
  }

  onLoaded(event) {/** TODO : Emitter (loaded) doesn't get triggered ... so we must set state to true */
    this.zone.run(() => {//make sure ui updates
      this.captchaloaded = true
      if (this.schema.widget.size === 'invisible') {
        this.captcha.execute()
      }
    })
  }

  onError(event) {
    this.zone.run(() => {//make sure ui updates
      this.captchaloadingerror = true
    })
    console.error(event)
  }

  ngOnInit() {
    this.captchaNameId = this.id.replace(new RegExp('[\\W]', 'ig'), '_')
  }

  ngAfterViewInit(): void {
    this.requiresConsent = this.requiresConsentRequest()
    this.showCAPTCHA = !this.requiresConsent
    this.htmlContent = this.getSaveContent()
  }

  onExpire(event) {
    this.control.setValue('')
  }

  showResponse(event) {
    // if invisible then we must trigger event
    this.control.setValue(event)
    this.formProperty.setValue(event, false)
    /**
     * <pre>
     Wenn Ihre Nutzer das Formular mit integriertem reCAPTCHA senden,
     erhalten Sie unter anderem einen String mit der Bezeichnung "g-recaptcha-response".
     Wenn Sie herausfinden möchten, ob Google den betreffenden Nutzer überprüft hat,
     senden Sie eine POST-Anfrage mit folgenden Parametern:
     URL: https://www.google.com/recaptcha/api/siteverify
     secret (erforderlich)  <your-secret>
     response (erforderlich)  Wert von 'g-recaptcha-response'
     remoteip  Die IP-Adresse des Endnutzers
     * </pre>
     */
  }

  getSaveContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getContent())
  }

  getContent(): string {
    let content = ''
    const consentContent = this.schema.widget.consentContent || this.consentContentDefault
    if (consentContent) {
      const bbcode = escapeHTMLInBBCode(consentContent)
      content = simpleParser.parse(this.sanitizer.sanitize(SecurityContext.HTML, `${bbcode}`))
    }
    return content
  }

  requiresConsentRequest() {
    return this.schema.widget.consentRequired && 'allow' !== this.getCookie(this.schema.widget.consentCookieName || this.consentCookieNameDefault)
  }

  storeConsent(event) {
    if (event.target.checked) {
      this.storeCookie(this.schema.widget.consentCookieName || this.consentCookieNameDefault, 'allow')
    } else {
      this.storeCookie(this.schema.widget.consentCookieName || this.consentCookieNameDefault, 'deny')
    }
    this.requiresConsent = this.requiresConsentRequest()
    this.showCAPTCHA = !this.requiresConsent
    if (this.requiresConsent) {
      // this.captchaloaded = this.showCAPTCHA
    }
  }


  storeCookie(name, value) {
    this.setCookie(name, value, 360)
  }

  setCookie(cname, cvalue, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = "expires=" + d.toUTCString()
    this.document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
  }

  getCookie(cname) {
    var name = cname + "="
    var decodedCookie = decodeURIComponent(this.document.cookie)
    var ca = decodedCookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }
}
