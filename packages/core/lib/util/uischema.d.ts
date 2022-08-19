import { UISchemaElement } from '../models/uischema';
export declare type IterateCallback = (uischema: UISchemaElement) => void;
export declare const setReadonly: (uischema: UISchemaElement) => void;
export declare const unsetReadonly: (uischema: UISchemaElement) => void;
export declare const iterateSchema: (uischema: UISchemaElement, toApply: IterateCallback) => void;
