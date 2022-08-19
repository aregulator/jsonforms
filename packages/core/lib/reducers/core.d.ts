import { Ajv, ErrorObject, ValidateFunction } from 'ajv';
import RefParser from 'json-schema-ref-parser';
import { CoreActions } from '../actions';
import { Reducer } from '../util/type';
import { JsonSchema, UISchemaElement } from '..';
export declare const sanitizeErrors: (validator: ValidateFunction, data: any) => ErrorObject[];
export declare type ValidationMode = 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation';
export interface JsonFormsCore {
    data: any;
    schema: JsonSchema;
    uischema: UISchemaElement;
    errors?: ErrorObject[];
    validator?: ValidateFunction;
    ajv?: Ajv;
    refParserOptions?: RefParser.Options;
    validationMode?: ValidationMode;
}
export declare const coreReducer: Reducer<JsonFormsCore, CoreActions>;
export declare const extractData: (state: JsonFormsCore) => any;
export declare const extractSchema: (state: JsonFormsCore) => JsonSchema;
export declare const extractUiSchema: (state: JsonFormsCore) => UISchemaElement;
export declare const extractAjv: (state: JsonFormsCore) => Ajv;
export declare const errorsAt: (instancePath: string, schema: JsonSchema, matchPath: (path: string) => boolean) => (errors: ErrorObject[]) => ErrorObject[];
export declare const errorAt: (instancePath: string, schema: JsonSchema) => (state: JsonFormsCore) => ErrorObject[];
export declare const subErrorsAt: (instancePath: string, schema: JsonSchema) => (state: JsonFormsCore) => ErrorObject[];
export declare const extractRefParserOptions: (state: JsonFormsCore) => RefParser.Options;
