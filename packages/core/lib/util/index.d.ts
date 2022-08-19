import { JsonSchema, Scopable, UISchemaElement } from '../';
import { compose as composePaths, composeWithUi, toDataPath } from './path';
import { isEnabled, isVisible } from './runtime';
import { Ajv } from 'ajv';
export { createCleanLabel, createLabelDescriptionFrom } from './label';
/**
 * Escape the given string such that it can be used as a class name,
 * i.e. hashes and slashes will be replaced.
 *
 * @param {string} s the string that should be converted to a valid class name
 * @returns {string} the escaped string
 */
export declare const convertToValidClassName: (s: string) => string;
export declare const formatErrorMessage: (errors: string[]) => string;
declare const hasType: (jsonSchema: JsonSchema, expected: string) => boolean;
/**
 * Derives the type of the jsonSchema element
 */
declare const deriveTypes: (jsonSchema: JsonSchema) => string[];
/**
 * Convenience wrapper around resolveData and resolveSchema.
 */
declare const Resolve: {
    schema(schema: JsonSchema, schemaPath: string, rootSchema?: JsonSchema): JsonSchema;
    data(data: any, path: string): any;
};
export { resolveData, resolveSchema, findRefs, SchemaRef, SchemaRefs } from './resolvers';
export { Resolve };
declare const Paths: {
    compose: (path1: string, path2: string) => string;
    fromScopable: (scopable: Scopable) => string;
};
export { composePaths, composeWithUi, Paths, toDataPath };
declare const Runtime: {
    isEnabled(uischema: UISchemaElement, data: any, ajv: Ajv): boolean;
    isVisible(uischema: UISchemaElement, data: any, ajv: Ajv): boolean;
};
export { isEnabled, isVisible, Runtime, deriveTypes, hasType };
export * from './renderer';
export * from './cell';
export * from './runtime';
export * from './Formatted';
export * from './ids';
export * from './validator';
export * from './combinators';
export * from './uischema';
export * from './array';
export * from './type';
export * from './schema';
