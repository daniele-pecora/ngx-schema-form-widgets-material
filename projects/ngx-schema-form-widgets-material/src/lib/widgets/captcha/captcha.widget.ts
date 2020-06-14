/**
 * Created by daniele on 13.07.17.
 */
import { Component, OnInit, ViewChild } from '@angular/core'
import { ControlWidget } from 'ngx-schema-form'
import { NgxRecaptchaComponent } from 'ngx-recaptcha-easy'

@Component({
  selector: 'ngx-ui-captcha-widget',
  templateUrl: './captcha.widget.html'
})
export class CaptchaWidgetComponent extends ControlWidget implements OnInit {

  captchaloaded: boolean
  @ViewChild(NgxRecaptchaComponent, { static: false }) captcha: NgxRecaptchaComponent

  captchaNameId = this.id
  initCallback

  onLoaded(event) {/** TODO : Emitter (loaded) doesn't get triggered ... so we must set state to true */
    this.captchaloaded = true

    if (this.schema.widget.size === 'invisible') {
      this.captcha.execute()
    }
  }

  ngOnInit() {
    this.captchaNameId = this.id.replace(new RegExp('[\\W]','ig'),'_')
  }

  ngAfterViewInit() {
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

}
