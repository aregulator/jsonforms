"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
var isEmpty_1 = tslib_1.__importDefault(require("lodash/isEmpty"));
var isArray_1 = tslib_1.__importDefault(require("lodash/isArray"));
var includes_1 = tslib_1.__importDefault(require("lodash/includes"));
var find_1 = tslib_1.__importDefault(require("lodash/find"));
var resolvers_1 = require("./resolvers");
var path_1 = require("./path");
exports.composePaths = path_1.compose;
exports.composeWithUi = path_1.composeWithUi;
exports.toDataPath = path_1.toDataPath;
var runtime_1 = require("./runtime");
exports.isEnabled = runtime_1.isEnabled;
exports.isVisible = runtime_1.isVisible;
var label_1 = require("./label");
exports.createCleanLabel = label_1.createCleanLabel;
exports.createLabelDescriptionFrom = label_1.createLabelDescriptionFrom;
/**
 * Escape the given string such that it can be used as a class name,
 * i.e. hashes and slashes will be replaced.
 *
 * @param {string} s the string that should be converted to a valid class name
 * @returns {string} the escaped string
 */
exports.convertToValidClassName = function (s) {
    return s.replace('#', 'root').replace(new RegExp('/', 'g'), '_');
};
exports.formatErrorMessage = function (errors) {
    if (errors === undefined || errors === null) {
        return '';
    }
    return errors.join('\n');
};
var hasType = function (jsonSchema, expected) {
    return includes_1.default(deriveTypes(jsonSchema), expected);
};
exports.hasType = hasType;
/**
 * Derives the type of the jsonSchema element
 */
var deriveTypes = function (jsonSchema) {
    if (isEmpty_1.default(jsonSchema)) {
        return [];
    }
    if (!isEmpty_1.default(jsonSchema.type) && typeof jsonSchema.type === 'string') {
        return [jsonSchema.type];
    }
    if (isArray_1.default(jsonSchema.type)) {
        return jsonSchema.type;
    }
    if (!isEmpty_1.default(jsonSchema.properties) ||
        !isEmpty_1.default(jsonSchema.additionalProperties)) {
        return ['object'];
    }
    if (!isEmpty_1.default(jsonSchema.items)) {
        return ['array'];
    }
    if (!isEmpty_1.default(jsonSchema.allOf)) {
        var allOfType = find_1.default(jsonSchema.allOf, function (schema) { return deriveTypes(schema).length !== 0; });
        if (allOfType) {
            return deriveTypes(allOfType);
        }
    }
    // ignore all remaining cases
    return [];
};
exports.deriveTypes = deriveTypes;
/**
 * Convenience wrapper around resolveData and resolveSchema.
 */
var Resolve = {
    schema: resolvers_1.resolveSchema,
    data: resolvers_1.resolveData
};
exports.Resolve = Resolve;
var resolvers_2 = require("./resolvers");
exports.resolveData = resolvers_2.resolveData;
exports.resolveSchema = resolvers_2.resolveSchema;
exports.findRefs = resolvers_2.findRefs;
// Paths --
var fromScopable = function (scopable) {
    return path_1.toDataPathSegments(scopable.scope).join('.');
};
var Paths = {
    compose: path_1.compose,
    fromScopable: fromScopable
};
exports.Paths = Paths;
// Runtime --
var Runtime = {
    isEnabled: function (uischema, data, ajv) {
        return runtime_1.isEnabled(uischema, data, undefined, ajv);
    },
    isVisible: function (uischema, data, ajv) {
        return runtime_1.isVisible(uischema, data, undefined, ajv);
    }
};
exports.Runtime = Runtime;
tslib_1.__exportStar(require("./renderer"), exports);
tslib_1.__exportStar(require("./cell"), exports);
tslib_1.__exportStar(require("./runtime"), exports);
tslib_1.__exportStar(require("./ids"), exports);
tslib_1.__exportStar(require("./validator"), exports);
tslib_1.__exportStar(require("./combinators"), exports);
tslib_1.__exportStar(require("./uischema"), exports);
tslib_1.__exportStar(require("./array"), exports);
tslib_1.__exportStar(require("./schema"), exports);
//# sourceMappingURL=index.js.map