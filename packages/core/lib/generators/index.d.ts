import { ControlElement, JsonSchema, UISchemaElement } from '../';
import { generateJsonSchema } from './schema';
import { generateDefaultUISchema } from './uischema';
export declare const Generate: {
    jsonSchema(instance: Object, options?: any): JsonSchema;
    uiSchema(jsonSchema: JsonSchema, layoutType?: string, prefix?: string, rootSchema?: JsonSchema): UISchemaElement;
    controlElement(ref: string): ControlElement;
};
export { generateJsonSchema };
export { generateDefaultUISchema };
