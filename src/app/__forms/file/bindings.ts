import { FormProperty } from "ngx-schema-form";

export const bindings = {
  '/files/file-upload-1': [{
    'input': function (event: any, formProperty?: FormProperty) {
      const el = formProperty.parent;

    }
  }],
  '/files/file-upload-2': [{
    'input': function (event: any, formProperty?: FormProperty) {
      const el = formProperty.parent;

    }
  }]
}