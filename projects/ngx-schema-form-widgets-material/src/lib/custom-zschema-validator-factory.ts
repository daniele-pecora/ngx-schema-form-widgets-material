import {SchemaValidatorFactory} from 'ngx-schema-form'

import * as ZSchema from 'z-schema';

export class CustomZSchemaValidatorFactory extends SchemaValidatorFactory {

  protected zschema;

  constructor() {
    super();
    this.zschema = new ZSchema({});
  }

  createValidatorFn(schema: any) {
    return (value): { [key: string]: boolean } => {

      if (schema.type === 'number' || schema.type === 'integer') {
        value = +value;
      }

      this.zschema.validate(value, schema);
      const err = this.zschema.getLastErrors();

      this.denormalizeRequiredPropertyPaths(err);

      return err || null;
    };
  }

  getSchema(schema: any, ref: string) {
    // check definitions are valid
    const isValid = this.zschema.compileSchema(schema);
    if (isValid) {
      return this.getDefinition(schema, ref);
    } else {
      throw this.zschema.getLastError();
    }
  }

  protected denormalizeRequiredPropertyPaths(err: any[]) {
    if (err && err.length) {
      err = err.map(error => {
        if (error.path === '#/' && error.code === 'OBJECT_MISSING_REQUIRED_PROPERTY') {
          error.path = `${error.path}${error.params[0]}`;
        }
        return error;
      });
    }
  }

  private getDefinition(schema: any, ref: string) {
    let foundSchema = schema;
    ref.split('/').slice(1).forEach(ptr => {
      if (ptr) {
        foundSchema = foundSchema[ptr];
      }
    });
    return foundSchema;
  }

  /**
   * Z-Schema is using a cache for all already validated schema <br/>
   * where only the key is a reference but the value of the schema is a deep clone.<br/>
   * So any change made in schema after bootstrap will not be recognized by z-schema validation,<br/>
   * because the changes don't make it into the cloned copy of the schema.<br/>
   * @see https://github.com/zaggino/z-schema/blob/master/src/SchemaCache.js#exports.getSchemaByReference
   */
  public reset(): void {
    /**
     * Reset the cache
     */
    this.zschema['referenceCache'] = []
  }
}
