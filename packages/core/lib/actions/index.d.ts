import AJV, { ErrorObject } from 'ajv';
import { JsonSchema, UISchemaElement } from '../';
import { RankedTester } from '../testers';
import RefParser from 'json-schema-ref-parser';
import { UISchemaTester } from '../reducers/uischemas';
import { ValidationMode } from '../reducers/core';
export declare const INIT: 'jsonforms/INIT';
export declare const UPDATE_CORE: 'jsonforms/UPDATE_CORE';
export declare const SET_AJV: 'jsonforms/SET_AJV';
export declare const UPDATE_DATA: 'jsonforms/UPDATE';
export declare const UPDATE_ERRORS: 'jsonforms/UPDATE_ERRORS';
export declare const VALIDATE: 'jsonforms/VALIDATE';
export declare const ADD_RENDERER: 'jsonforms/ADD_RENDERER';
export declare const REMOVE_RENDERER: 'jsonforms/REMOVE_RENDERER';
export declare const ADD_CELL: 'jsonforms/ADD_CELL';
export declare const REMOVE_CELL: 'jsonforms/REMOVE_CELL';
export declare const SET_CONFIG: 'jsonforms/SET_CONFIG';
export declare const ADD_UI_SCHEMA: 'jsonforms/ADD_UI_SCHEMA';
export declare const REMOVE_UI_SCHEMA: 'jsonforms/REMOVE_UI_SCHEMA';
export declare const SET_SCHEMA: 'jsonforms/SET_SCHEMA';
export declare const SET_UISCHEMA: 'jsonforms/SET_UISCHEMA';
export declare const SET_VALIDATION_MODE: 'jsonforms/SET_VALIDATION_MODE';
export declare const SET_LOCALE: 'jsonforms/SET_LOCALE';
export declare const SET_LOCALIZED_SCHEMAS: 'jsonforms/SET_LOCALIZED_SCHEMAS';
export declare const SET_LOCALIZED_UISCHEMAS: 'jsonforms/SET_LOCALIZED_UISCHEMAS';
export declare const ADD_DEFAULT_DATA: 'jsonforms/ADD_DEFAULT_DATA';
export declare const REMOVE_DEFAULT_DATA: 'jsonforms/REMOVE_DEFAULT_DATA';
export declare type CoreActions = InitAction | UpdateCoreAction | UpdateAction | UpdateErrorsAction | SetAjvAction | SetSchemaAction | SetUISchemaAction | SetValidationModeAction;
export interface UpdateAction {
    type: 'jsonforms/UPDATE';
    path: string;
    updater(existingData?: any): any;
}
export interface UpdateErrorsAction {
    type: 'jsonforms/UPDATE_ERRORS';
    errors: ErrorObject[];
}
export interface InitAction {
    type: 'jsonforms/INIT';
    data: any;
    schema: JsonSchema;
    uischema: UISchemaElement;
    options?: InitActionOptions | AJV.Ajv;
}
export interface UpdateCoreAction {
    type: 'jsonforms/UPDATE_CORE';
    data?: any;
    schema?: JsonSchema;
    uischema?: UISchemaElement;
    options?: InitActionOptions | AJV.Ajv;
}
export interface InitActionOptions {
    ajv?: AJV.Ajv;
    refParserOptions?: RefParser.Options;
    validationMode?: ValidationMode;
}
export interface SetValidationModeAction {
    type: 'jsonforms/SET_VALIDATION_MODE';
    validationMode: ValidationMode;
}
export declare const init: (data: any, schema?: JsonSchema, uischema?: UISchemaElement, options?: AJV.Ajv | InitActionOptions) => {
    type: "jsonforms/INIT";
    data: any;
    schema: JsonSchema;
    uischema: UISchemaElement;
    options: AJV.Ajv | InitActionOptions;
};
export declare const updateCore: (data: any, schema: JsonSchema, uischema?: UISchemaElement, options?: AJV.Ajv | InitActionOptions) => UpdateCoreAction;
export interface RegisterDefaultDataAction {
    type: 'jsonforms/ADD_DEFAULT_DATA';
    schemaPath: string;
    data: any;
}
export declare const registerDefaultData: (schemaPath: string, data: any) => {
    type: "jsonforms/ADD_DEFAULT_DATA";
    schemaPath: string;
    data: any;
};
export interface UnregisterDefaultDataAction {
    type: 'jsonforms/REMOVE_DEFAULT_DATA';
    schemaPath: string;
}
export declare const unregisterDefaultData: (schemaPath: string) => {
    type: "jsonforms/REMOVE_DEFAULT_DATA";
    schemaPath: string;
};
export interface SetAjvAction {
    type: 'jsonforms/SET_AJV';
    ajv: AJV.Ajv;
}
export declare const setAjv: (ajv: AJV.Ajv) => {
    type: "jsonforms/SET_AJV";
    ajv: AJV.Ajv;
};
export declare const update: (path: string, updater: (existingData: any) => any) => UpdateAction;
export declare const updateErrors: (errors: AJV.ErrorObject[]) => UpdateErrorsAction;
export interface AddRendererAction {
    type: 'jsonforms/ADD_RENDERER';
    tester: RankedTester;
    renderer: any;
}
export declare const registerRenderer: (tester: RankedTester, renderer: any) => {
    type: "jsonforms/ADD_RENDERER";
    tester: RankedTester;
    renderer: any;
};
export interface AddCellRendererAction {
    type: 'jsonforms/ADD_CELL';
    tester: RankedTester;
    cell: any;
}
export declare const registerCell: (tester: RankedTester, cell: any) => {
    type: "jsonforms/ADD_CELL";
    tester: RankedTester;
    cell: any;
};
export interface RemoveCellRendererAction {
    type: 'jsonforms/REMOVE_CELL';
    tester: RankedTester;
    cell: any;
}
export declare const unregisterCell: (tester: RankedTester, cell: any) => {
    type: "jsonforms/REMOVE_CELL";
    tester: RankedTester;
    cell: any;
};
export interface RemoveRendererAction {
    type: 'jsonforms/REMOVE_RENDERER';
    tester: RankedTester;
    renderer: any;
}
export declare const unregisterRenderer: (tester: RankedTester, renderer: any) => {
    type: "jsonforms/REMOVE_RENDERER";
    tester: RankedTester;
    renderer: any;
};
export interface SetConfigAction {
    type: 'jsonforms/SET_CONFIG';
    config: any;
}
export declare const setConfig: (config: any) => SetConfigAction;
export declare const setValidationMode: (validationMode: ValidationMode) => SetValidationModeAction;
export declare type UISchemaActions = AddUISchemaAction | RemoveUISchemaAction;
export interface AddUISchemaAction {
    type: 'jsonforms/ADD_UI_SCHEMA';
    tester: UISchemaTester;
    uischema: UISchemaElement;
}
export declare const registerUISchema: (tester: UISchemaTester, uischema: UISchemaElement) => AddUISchemaAction;
export interface RemoveUISchemaAction {
    type: 'jsonforms/REMOVE_UI_SCHEMA';
    tester: UISchemaTester;
}
export declare const unregisterUISchema: (tester: UISchemaTester) => RemoveUISchemaAction;
export declare type LocaleActions = SetLocaleAction | SetLocalizedSchemasAction | SetLocalizedUISchemasAction;
export interface SetLocaleAction {
    type: 'jsonforms/SET_LOCALE';
    locale: string;
}
export declare const setLocale: (locale: string) => SetLocaleAction;
export interface SetLocalizedSchemasAction {
    type: 'jsonforms/SET_LOCALIZED_SCHEMAS';
    localizedSchemas: Map<string, JsonSchema>;
}
export declare const setLocalizedSchemas: (localizedSchemas: Map<string, JsonSchema>) => SetLocalizedSchemasAction;
export interface SetSchemaAction {
    type: 'jsonforms/SET_SCHEMA';
    schema: JsonSchema;
}
export declare const setSchema: (schema: JsonSchema) => SetSchemaAction;
export interface SetLocalizedUISchemasAction {
    type: 'jsonforms/SET_LOCALIZED_UISCHEMAS';
    localizedUISchemas: Map<string, UISchemaElement>;
}
export declare const setLocalizedUISchemas: (localizedUISchemas: Map<string, UISchemaElement>) => SetLocalizedUISchemasAction;
export interface SetUISchemaAction {
    type: 'jsonforms/SET_UISCHEMA';
    uischema: UISchemaElement;
}
export declare const setUISchema: (uischema: UISchemaElement) => SetUISchemaAction;
