import {CustomZSchemaValidatorFactory} from './custom-zschema-validator-factory'
import { Injectable } from "@angular/core";

@Injectable()
export class FixOptionalEmptyFieldsZSchemaValidatorFactory extends CustomZSchemaValidatorFactory {
  constructor() {
    super()
  }

  /**
   * Field that are not required but have any validation rules set (eg. minLength, pattern etc...)
   * must be marked as optional with property <code>widget.__optional:true</code>
   * since there is actually no other way to set multi types at schema level
   * e.g<br/>
   * <code>{ "name" : { "type" : ["string", "null"]}}</code>
   * <br/>
   * For <code>oneOf</code> options the will be set an <code>null</code>-value option.
   * e.g<br/>
   * <code>{ "name" : { "oneOf" : [{"description", "Label", "enum", [null]},...]}}</code>
   *
   * This prevents getting any error messages when validation empty optional fields
   * @param schema
   */
  updateOptionaFieldValidation(schema: any) {
    const required = schema.required || [];
    const properties = schema.properties || [];
    if (properties) {
      for (const propertyKey in properties) {
        if (-1 === required.indexOf(propertyKey)) {
          const propertyValue = properties[propertyKey];
          propertyValue.widget = propertyValue.widget || {};
          propertyValue.widget.__optional = true;
          propertyValue.widget.__info_property_optional =
            'The property \'__optional\' and this have been set automatically. See https://github.com/makinacorpus/ngx-schema-form/issues/175'
        }
      }
    }
  }

  createValidatorFn(schema: any) {
    this.updateOptionaFieldValidation(schema);
    return (value): { [key: string]: boolean } => {

      if (schema.type === 'number' || schema.type === 'integer') {
        value = +value;
      }

      /**
       * Set temporary multi-type including <code>"null"</code>
       * so optional fields with no value don't get validated
       */
      if (value === '' && schema.widget && schema.widget.__optional) {
        // create clone
        const newSchema = JSON.parse(JSON.stringify(schema));
        newSchema.type = Array.isArray(newSchema.type) ? newSchema.type : [newSchema.type, 'null'];
        if (newSchema.oneOf) {
          // Add null value option for oneOf
          newSchema.oneOf.unshift({
            description: "Hidden null value option - The property '__optional' and this have been set automatically. See https://github.com/makinacorpus/ngx-schema-form/issues/175",
            enum: [null]
          })
        }
        this.zschema.validate(null, newSchema);
        const err = this.zschema.getLastErrors();
        this.denormalizeRequiredPropertyPaths(err);
        return err || null
      }

      this.zschema.validate(value, schema);
      const err = this.zschema.getLastErrors();

      this.denormalizeRequiredPropertyPaths(err);

      return err || null;
    };
  }

}
