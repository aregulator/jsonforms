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
var get_1 = tslib_1.__importDefault(require("lodash/get"));
var isArray_1 = tslib_1.__importDefault(require("lodash/isArray"));
var isObject_1 = tslib_1.__importDefault(require("lodash/isObject"));
var isFunction_1 = tslib_1.__importDefault(require("lodash/isFunction"));
var isUndefined_1 = tslib_1.__importDefault(require("lodash/isUndefined"));
var forOwn_1 = tslib_1.__importDefault(require("lodash/forOwn"));
var isString_1 = tslib_1.__importDefault(require("lodash/isString"));
var isPlainObject_1 = tslib_1.__importDefault(require("lodash/isPlainObject"));
var uri_js_1 = require("uri-js");
var isObjectSchema = function (schema) {
    return schema.properties !== undefined;
};
var isArraySchema = function (schema) {
    return schema.type === 'array' && schema.items !== undefined;
};
exports.resolveData = function (instance, dataPath) {
    if (isEmpty_1.default(dataPath)) {
        return instance;
    }
    var dataPathSegments = dataPath.split('.');
    return dataPathSegments
        .map(function (segment) { return decodeURIComponent(segment); })
        .reduce(function (curInstance, decodedSegment) {
        if (!curInstance || !curInstance.hasOwnProperty(decodedSegment)) {
            return undefined;
        }
        return curInstance[decodedSegment];
    }, instance);
};
/**
 * Finds all references inside the given schema.
 *
 * @param schema The {@link JsonSchema} to find the references in
 * @param result The initial result map, default: empty map (this parameter is used for recursion
 *               inside the function)
 * @param resolveTuples Whether arrays of tuples should be considered; default: false
 */
exports.findAllRefs = function (schema, result, resolveTuples) {
    if (result === void 0) { result = {}; }
    if (resolveTuples === void 0) { resolveTuples = false; }
    if (isObjectSchema(schema)) {
        Object.keys(schema.properties).forEach(function (key) {
            return exports.findAllRefs(schema.properties[key], result);
        });
    }
    if (isArraySchema(schema)) {
        if (Array.isArray(schema.items)) {
            if (resolveTuples) {
                var items = schema.items;
                items.forEach(function (child) { return exports.findAllRefs(child, result); });
            }
        }
        else {
            exports.findAllRefs(schema.items, result);
        }
    }
    if (Array.isArray(schema.anyOf)) {
        var anyOf = schema.anyOf;
        anyOf.forEach(function (child) { return exports.findAllRefs(child, result); });
    }
    if (schema.$ref !== undefined) {
        result[schema.$ref] = schema;
    }
    return result;
};
var invalidSegment = function (pathSegment) {
    return pathSegment === '#' || pathSegment === undefined || pathSegment === '';
};
/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @param {JsonSchema} rootSchema the actual root schema
 * @returns {JsonSchema} the resolved sub-schema
 */
exports.resolveSchema = function (schema, schemaPath, rootSchema) {
    var _a, _b, _c;
    if (isEmpty_1.default(schema)) {
        return undefined;
    }
    var validPathSegments = schemaPath.split('/');
    var resultSchema = schema;
    for (var i = 0; i < validPathSegments.length; i++) {
        var pathSegment = validPathSegments[i];
        resultSchema =
            resultSchema === undefined || resultSchema.$ref === undefined
                ? resultSchema
                : exports.resolveSchema(schema, resultSchema.$ref);
        if (invalidSegment(pathSegment)) {
            // skip invalid segments
            continue;
        }
        var curSchema = get_1.default(resultSchema, pathSegment);
        if (!curSchema) {
            // resolving was not successful, check whether the scope omitted an oneOf, allOf or anyOf and resolve anyway
            var schemas = [].concat((_a = resultSchema === null || resultSchema === void 0 ? void 0 : resultSchema.oneOf) !== null && _a !== void 0 ? _a : [], (_b = resultSchema === null || resultSchema === void 0 ? void 0 : resultSchema.allOf) !== null && _b !== void 0 ? _b : [], (_c = resultSchema === null || resultSchema === void 0 ? void 0 : resultSchema.anyOf) !== null && _c !== void 0 ? _c : []);
            for (var _i = 0, schemas_1 = schemas; _i < schemas_1.length; _i++) {
                var item = schemas_1[_i];
                curSchema = exports.resolveSchema(item, validPathSegments.slice(i).join('/'));
                if (curSchema) {
                    break;
                }
            }
            if (curSchema) {
                // already resolved rest of the path
                resultSchema = curSchema;
                break;
            }
        }
        resultSchema = curSchema;
    }
    // TODO: because schema is already scoped we might end up with refs pointing
    // outside of the current schema. It would be better if we'd always could deal
    // with absolute paths here, so that we don't need to keep two different
    // schemas around
    if (resultSchema !== undefined && resultSchema.$ref !== undefined) {
        try {
            return retrieveResolvableSchema(schema, resultSchema.$ref);
        }
        catch (e) {
            return retrieveResolvableSchema(rootSchema, resultSchema.$ref);
        }
    }
    return resultSchema;
};
/**
 * Normalizes the schema and resolves the given ref.
 *
 * @param {JsonSchema} full the JSON schema to resolved the reference against
 * @param {string} reference the reference to be resolved
 * @returns {JsonSchema} the resolved sub-schema
 */
// disable rule because resolve is mutually recursive
// tslint:disable:only-arrow-functions
function retrieveResolvableSchema(full, reference) {
    // tslint:enable:only-arrow-functions
    var child = exports.resolveSchema(full, reference);
    var allRefs = exports.findAllRefs(child);
    var innerSelfReference = allRefs[reference];
    if (innerSelfReference !== undefined) {
        innerSelfReference.$ref = '#';
    }
    return child;
}
exports.findRefs = function (obj) {
    var refs = {};
    // Walk the document (or sub document) and find all JSON References
    walk([], obj, [], function (_a, node, path) {
        var processChildren = true;
        var refDetails;
        var refPtr;
        if (isRefLike(node, false)) {
            refDetails = getRefDetails(node);
            if (refDetails.type !== 'invalid') {
                refPtr = pathToPtr(path, undefined);
                refs[refPtr] = refDetails;
            }
            // Whenever a JSON Reference has extra children, its children should not be processed.
            //   See: http://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03#section-3
            if (getExtraRefKeys(node).length > 0) {
                processChildren = false;
            }
        }
        return processChildren;
    });
    return refs;
};
// pure copy of JsonRefs (added types)
var walk = function (ancestors, node, path, fn) {
    var processChildren = true;
    var walkItem = function (item, segment) {
        path.push(segment);
        walk(ancestors, item, path, fn);
        path.pop();
    };
    // Call the iteratee
    if (isFunction_1.default(fn)) {
        processChildren = fn(ancestors, node, path);
    }
    // We do not process circular objects again
    if (ancestors.indexOf(node) === -1) {
        ancestors.push(node);
        if (processChildren !== false) {
            if (isArray_1.default(node)) {
                node.forEach(function (member, index) {
                    walkItem(member, index.toString());
                });
            }
            else if (isObject_1.default(node)) {
                forOwn_1.default(node, function (cNode, key) {
                    walkItem(cNode, key);
                });
            }
        }
        ancestors.pop();
    }
};
var pathToPtr = function (path, hashPrefix) {
    if (!isArray_1.default(path)) {
        throw new Error('path must be an Array');
    }
    // Encode each segment and return
    return ((hashPrefix !== false ? '#' : '') +
        (path.length > 0 ? '/' : '') +
        encodePath(path).join('/'));
};
var encodePath = function (path) {
    if (!isArray_1.default(path)) {
        throw new TypeError('path must be an array');
    }
    return path.map(function (seg) {
        if (!isString_1.default(seg)) {
            seg = JSON.stringify(seg);
        }
        return seg.replace(/~/g, '~0').replace(/\//g, '~1');
    });
};
var uriDetailsCache = {};
var badPtrTokenRegex = /~(?:[^01]|$)/g;
var getRefDetails = function (obj) {
    var details = {
        def: obj
    };
    var cacheKey;
    var extraKeys;
    var uriDetails;
    try {
        if (isRefLike(obj, true)) {
            cacheKey = obj.$ref;
            uriDetails = uriDetailsCache[cacheKey];
            if (isUndefined_1.default(uriDetails)) {
                uriDetails = uriDetailsCache[cacheKey] = parseURI(cacheKey);
            }
            details.uri = cacheKey;
            details.uriDetails = uriDetails;
            if (isUndefined_1.default(uriDetails.error)) {
                details.type = getRefType(details);
                // Validate the JSON Pointer
                try {
                    if (['#', '/'].indexOf(cacheKey[0]) > -1) {
                        isPtr(cacheKey, true);
                    }
                    else if (cacheKey.indexOf('#') > -1) {
                        isPtr(uriDetails.fragment, true);
                    }
                }
                catch (err) {
                    details.error = err.message;
                    details.type = 'invalid';
                }
            }
            else {
                details.error = details.uriDetails.error;
                details.type = 'invalid';
            }
            // Identify warning
            extraKeys = getExtraRefKeys(obj);
            if (extraKeys.length > 0) {
                details.warning =
                    'Extra JSON Reference properties will be ignored: ' +
                        extraKeys.join(', ');
            }
        }
        else {
            details.type = 'invalid';
        }
    }
    catch (err) {
        details.error = err.message;
        details.type = 'invalid';
    }
    return details;
};
var getRefType = function (refDetails) {
    var type;
    // Convert the URI reference to one of our types
    switch (refDetails.uriDetails.reference) {
        case 'absolute':
        case 'uri':
            type = 'remote';
            break;
        case 'same-document':
            type = 'local';
            break;
        default:
            type = refDetails.uriDetails.reference;
    }
    return type;
};
var getExtraRefKeys = function (ref) {
    return Object.keys(ref).filter(function (key) {
        return key !== '$ref';
    });
};
var parseURI = function (uri) {
    // We decode first to avoid doubly encoding
    return uri_js_1.parse(uri);
};
var isPtr = function (ptr, throwWithDetails) {
    var valid = true;
    var firstChar;
    try {
        if (isString_1.default(ptr)) {
            if (ptr !== '') {
                firstChar = ptr.charAt(0);
                if (['#', '/'].indexOf(firstChar) === -1) {
                    throw new Error('ptr must start with a / or #/');
                }
                else if (firstChar === '#' && ptr !== '#' && ptr.charAt(1) !== '/') {
                    throw new Error('ptr must start with a / or #/');
                }
                else if (ptr.match(badPtrTokenRegex)) {
                    throw new Error('ptr has invalid token(s)');
                }
            }
        }
        else {
            throw new Error('ptr is not a String');
        }
    }
    catch (err) {
        if (throwWithDetails === true) {
            throw err;
        }
        valid = false;
    }
    return valid;
};
var isRefLike = function (obj, throwWithDetails) {
    var refLike = true;
    try {
        if (!isPlainObject_1.default(obj)) {
            throw new Error('obj is not an Object');
        }
        else if (!isString_1.default(obj.$ref)) {
            throw new Error('obj.$ref is not a String');
        }
    }
    catch (err) {
        if (throwWithDetails) {
            throw err;
        }
        refLike = false;
    }
    return refLike;
};
//# sourceMappingURL=resolvers.js.map