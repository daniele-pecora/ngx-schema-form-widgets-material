import {Binding, BindingRegistry} from 'ngx-schema-form'
import {FormProperty} from 'ngx-schema-form'

export function triggerBinding(this_context, eventId, event, bindingRegistry: BindingRegistry, formProperty: FormProperty) {
  const bindings: Binding[] = bindingRegistry.get(formProperty.path)
  if ((bindings || []).length) {
    bindings.forEach((binding) => {
      for (const evId in binding) {
        if (eventId === evId) {
          let _function: ((event: any, formProperty: FormProperty) => void) | ((event: any, formProperty: FormProperty) => void)[] = binding[eventId]
          _function = Array.isArray(_function) ? _function : [_function]
          _function.forEach((item, ix, all) => {
            if (item instanceof Function) {
              item.bind(this_context)(event, formProperty)
            }
          })
        }
      }
    })
  }
}
