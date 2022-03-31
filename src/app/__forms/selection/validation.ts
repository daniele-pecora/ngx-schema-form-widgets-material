export const validations = {
    '/select_async': (value, property, form) => {
        console.log('validate select_async ', value, property, form, JSON.stringify(property.schema.oneOf, null, 2))
    }
};