import { ControlElement, UISchemaElement } from '../models/uischema';
import { coreReducer, errorsAt, JsonFormsCore, ValidationMode } from './core';
import { JsonFormsDefaultDataRegistryEntry } from './default-data';
import { JsonFormsRendererRegistryEntry, rendererReducer } from './renderers';
import { JsonFormsState } from '../store';
import { findMatchingUISchema, JsonFormsUISchemaRegistryEntry, uischemaRegistryReducer, UISchemaTester } from './uischemas';
import { i18nReducer } from './i18n';
import { JsonFormsCellRendererRegistryEntry } from './cells';
import { JsonSchema } from '../models/jsonSchema';
import RefParser from 'json-schema-ref-parser';
import { cellReducer } from './cells';
import { configReducer } from './config';
import { Ajv } from 'ajv';
export { rendererReducer, cellReducer, coreReducer, i18nReducer, configReducer, UISchemaTester, uischemaRegistryReducer, findMatchingUISchema, JsonFormsUISchemaRegistryEntry };
export { JsonFormsCore, ValidationMode };
export declare const jsonFormsReducerConfig: {
    core: import("..").Reducer<JsonFormsCore, import("..").CoreActions>;
    renderers: import("..").Reducer<JsonFormsRendererRegistryEntry[], import("..").AddRendererAction | import("..").RemoveRendererAction>;
    cells: import("..").Reducer<import("./cells").JsonFormsCellRendererRegistryState, import("..").AddCellRendererAction | import("..").RemoveCellRendererAction>;
    config: import("..").Reducer<any, import("..").SetConfigAction>;
    uischemas: import("..").Reducer<JsonFormsUISchemaRegistryEntry[], import("..").UISchemaActions>;
    defaultData: import("..").Reducer<JsonFormsDefaultDataRegistryEntry[], import("..").RegisterDefaultDataAction | import("..").UnregisterDefaultDataAction>;
    i18n: import("..").Reducer<any, any>;
};
export declare const getData: (state: JsonFormsState) => any;
export declare const getSchema: (state: JsonFormsState) => JsonSchema;
export declare const getUiSchema: (state: JsonFormsState) => UISchemaElement;
export declare const getRefParserOptions: (state: JsonFormsState) => RefParser.Options;
export declare const getAjv: (state: JsonFormsState) => Ajv;
export declare const getDefaultData: (state: JsonFormsState) => JsonFormsDefaultDataRegistryEntry[];
export declare const getRenderers: (state: JsonFormsState) => JsonFormsRendererRegistryEntry[];
export declare const getCells: (state: JsonFormsState) => JsonFormsCellRendererRegistryEntry[];
export declare const getUISchemas: (state: JsonFormsState) => JsonFormsUISchemaRegistryEntry[];
/**
 * Finds a registered UI schema to use, if any.
 * @param schema the JSON schema describing the data to be rendered
 * @param schemaPath the according schema path
 * @param path the instance path
 * @param fallbackLayoutType the type of the layout to use
 * @param control may be checked for embedded inline uischema options
 */
export declare const findUISchema: (uischemas: JsonFormsUISchemaRegistryEntry[], schema: JsonSchema, schemaPath: string, path: string, fallbackLayoutType?: string, control?: ControlElement, rootSchema?: JsonSchema) => UISchemaElement;
export declare const getErrorAt: (instancePath: string, schema: JsonSchema) => (state: JsonFormsState) => import("ajv").ErrorObject[];
export { errorsAt };
export declare const getSubErrorsAt: (instancePath: string, schema: JsonSchema) => (state: JsonFormsState) => import("ajv").ErrorObject[];
export declare const getConfig: (state: JsonFormsState) => any;
export declare const getLocale: (state: JsonFormsState) => string;
export declare const getLocalizedSchema: (locale: string) => (state: JsonFormsState) => JsonSchema;
export declare const getLocalizedUISchema: (locale: string) => (state: JsonFormsState) => UISchemaElement;
