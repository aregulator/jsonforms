import { JsonSchema, UISchemaElement } from '..';
import { Reducer } from '../util/type';
export interface JsonFormsLocaleState {
    locale?: string;
    localizedSchemas: Map<string, JsonSchema>;
    localizedUISchemas: Map<string, UISchemaElement>;
}
export declare const i18nReducer: Reducer<any, any>;
export declare const fetchLocale: (state?: JsonFormsLocaleState) => string;
export declare const findLocalizedSchema: (locale: string) => (state?: JsonFormsLocaleState) => JsonSchema;
export declare const findLocalizedUISchema: (locale: string) => (state?: JsonFormsLocaleState) => UISchemaElement;
