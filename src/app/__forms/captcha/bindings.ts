import { FormProperty } from "ngx-schema-form";

export const bindings = {
  '/captchas/captcha': [{
    'input': function (event: any, formProperty?: FormProperty) {
      const el = formProperty.parent;

    }
  }]
}