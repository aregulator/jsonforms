import { UISchemaElement } from '../models/uischema';
import { Ajv } from 'ajv';
export declare const evalVisibility: (uischema: UISchemaElement, data: any, path: string, ajv: Ajv) => boolean;
export declare const evalEnablement: (uischema: UISchemaElement, data: any, path: string, ajv: Ajv) => boolean;
export declare const hasShowRule: (uischema: UISchemaElement) => boolean;
export declare const hasEnableRule: (uischema: UISchemaElement) => boolean;
export declare const isVisible: (uischema: UISchemaElement, data: any, path: string, ajv: Ajv) => boolean;
export declare const isEnabled: (uischema: UISchemaElement, data: any, path: string, ajv: Ajv) => boolean;
