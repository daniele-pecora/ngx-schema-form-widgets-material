import { FormProperty } from 'ngx-schema-form'

export const actions = {
  'action_1': (formProperty: FormProperty, parameters: any) => {
    console.log('Delete image via formProperty')
    //formProperty.setValue('', true)
    formProperty.reset('', true)
  }
}
