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
var get_1 = tslib_1.__importDefault(require("lodash/get"));
var union_1 = tslib_1.__importDefault(require("lodash/union"));
var find_1 = tslib_1.__importDefault(require("lodash/find"));
var json_schema_ref_parser_1 = tslib_1.__importDefault(require("json-schema-ref-parser"));
var reducers_1 = require("../reducers");
var util_1 = require("../util");
var actions_1 = require("../actions");
exports.isPlainLabel = function (label) {
    return typeof label === 'string';
};
var isRequired = function (schema, schemaPath, rootSchema) {
    var pathSegments = schemaPath.split('/');
    var lastSegment = pathSegments[pathSegments.length - 1];
    var nextHigherSchemaSegments = pathSegments.slice(0, pathSegments.length - 2);
    var nextHigherSchemaPath = nextHigherSchemaSegments.join('/');
    var nextHigherSchema = util_1.Resolve.schema(schema, nextHigherSchemaPath, rootSchema);
    return (nextHigherSchema !== undefined &&
        nextHigherSchema.required !== undefined &&
        nextHigherSchema.required.indexOf(lastSegment) !== -1);
};
/**
 * Adds an asterisk to the given label string based
 * on the required parameter.
 *
 * @param {string} label the label string
 * @param {boolean} required whether the label belongs to a control which is required
 * @returns {string} the label string
 */
exports.computeLabel = function (label, required, hideRequiredAsterisk) {
    return required && !hideRequiredAsterisk ? label + '*' : label;
};
/**
 * Create a default value based on the given scheam.
 * @param schema the schema for which to create a default value.
 * @returns {any}
 */
exports.createDefaultValue = function (schema) {
    switch (schema.type) {
        case 'string':
            if (schema.format === 'date-time' ||
                schema.format === 'date' ||
                schema.format === 'time') {
                return new Date();
            }
            return '';
        case 'integer':
        case 'number':
            return 0;
        case 'boolean':
            return false;
        case 'array':
            return [];
        case 'null':
            return null;
        default:
            return {};
    }
};
/**
 * Whether an element's description should be hidden.
 *
 * @param visible whether an element is visible
 * @param description the element's description
 * @param isFocused whether the element is focused
 *
 * @returns {boolean} true, if the description is to be hidden, false otherwise
 */
exports.isDescriptionHidden = function (visible, description, isFocused, showUnfocusedDescription) {
    return (description === undefined ||
        (description !== undefined && !visible) ||
        (!showUnfocusedDescription && !isFocused));
};
exports.enumToEnumOptionMapper = function (e) {
    var stringifiedEnum = typeof e === 'string' ? e : JSON.stringify(e);
    return { label: stringifiedEnum, value: e };
};
exports.oneOfToEnumOptionMapper = function (e) {
    var _a;
    return ({
        value: e.const,
        label: (_a = e.title) !== null && _a !== void 0 ? _a : (typeof e.const === 'string' ? e.const : JSON.stringify(e.const))
    });
};
/**
 * Map state to control props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
exports.mapStateToControlProps = function (state, ownProps) {
    var uischema = ownProps.uischema;
    var rootData = reducers_1.getData(state);
    var path = util_1.composeWithUi(uischema, ownProps.path);
    var visible = ownProps.visible === undefined || util_1.hasShowRule(uischema)
        ? util_1.isVisible(uischema, rootData, ownProps.path, reducers_1.getAjv(state))
        : ownProps.visible;
    var readonly = state.jsonforms.readonly;
    var enabled = !readonly && (ownProps.enabled === undefined || util_1.hasEnableRule(uischema)
        ? util_1.isEnabled(uischema, rootData, ownProps.path, reducers_1.getAjv(state))
        : ownProps.enabled);
    var controlElement = uischema;
    var id = ownProps.id;
    var rootSchema = reducers_1.getSchema(state);
    var required = controlElement.scope !== undefined &&
        isRequired(ownProps.schema, controlElement.scope, rootSchema);
    var resolvedSchema = util_1.Resolve.schema(ownProps.schema || rootSchema, controlElement.scope, rootSchema);
    var errors = util_1.formatErrorMessage(union_1.default(reducers_1.getErrorAt(path, resolvedSchema)(state).map(function (error) { return error.message; })));
    var description = resolvedSchema !== undefined ? resolvedSchema.description : '';
    var data = util_1.Resolve.data(rootData, path);
    var labelDesc = util_1.createLabelDescriptionFrom(uischema, resolvedSchema);
    var label = labelDesc.show ? labelDesc.text : '';
    return {
        data: data,
        description: description,
        errors: errors,
        label: label,
        visible: visible,
        enabled: enabled,
        id: id,
        path: path,
        required: required,
        uischema: ownProps.uischema,
        schema: resolvedSchema || rootSchema,
        config: reducers_1.getConfig(state),
        cells: ownProps.cells || state.jsonforms.cells,
        rootSchema: rootSchema
    };
};
/**
 *
 * Map dispatch to control props.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfControl} dispatch props for a control
 */
exports.mapDispatchToControlProps = function (dispatch) { return ({
    handleChange: function (path, value) {
        dispatch(actions_1.update(path, function () { return value; }));
    }
}); };
/**
 * Default mapStateToCellProps for enum control. Options is used for populating dropdown list
 * @param state
 * @param ownProps
 * @returns {StatePropsOfControl & OwnPropsOfEnum}
 */
exports.mapStateToEnumControlProps = function (state, ownProps) {
    var _a;
    var props = exports.mapStateToControlProps(state, ownProps);
    var options = ownProps.options || ((_a = props.schema.enum) === null || _a === void 0 ? void 0 : _a.map(exports.enumToEnumOptionMapper)) ||
        props.schema.const && [exports.enumToEnumOptionMapper(props.schema.const)];
    return tslib_1.__assign(tslib_1.__assign({}, props), { options: options });
};
/**
 * Default mapStateToCellProps for enum control based on oneOf. Options is used for populating dropdown list
 * @param state
 * @param ownProps
 * @returns {StatePropsOfControl & OwnPropsOfEnum}
 */
exports.mapStateToOneOfEnumControlProps = function (state, ownProps) {
    var _a;
    var props = exports.mapStateToControlProps(state, ownProps);
    var options = ownProps.options || ((_a = props.schema.oneOf) === null || _a === void 0 ? void 0 : _a.map(exports.oneOfToEnumOptionMapper));
    return tslib_1.__assign(tslib_1.__assign({}, props), { options: options });
};
/**
 * Default mapStateToCellProps for multi enum control. Options is used for populating dropdown list
 * @param state
 * @param ownProps
 * @returns {StatePropsOfControl & OwnPropsOfEnum}
 */
exports.mapStateToMultiEnumControlProps = function (state, ownProps) {
    var _a;
    var props = exports.mapStateToControlProps(state, ownProps);
    var items = props.schema.items;
    var options = ownProps.options ||
        ((items === null || items === void 0 ? void 0 : items.oneOf) && items.oneOf.map(exports.oneOfToEnumOptionMapper)) || ((_a = items === null || items === void 0 ? void 0 : items.enum) === null || _a === void 0 ? void 0 : _a.map(exports.enumToEnumOptionMapper));
    return tslib_1.__assign(tslib_1.__assign({}, props), { options: options });
};
/**
 * Map state to control props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
exports.mapStateToMasterListItemProps = function (state, ownProps) {
    var schema = ownProps.schema, path = ownProps.path, index = ownProps.index;
    var firstPrimitiveProp = schema.properties
        ? find_1.default(Object.keys(schema.properties), function (propName) {
            var prop = schema.properties[propName];
            return (prop.type === 'string' ||
                prop.type === 'number' ||
                prop.type === 'integer');
        })
        : undefined;
    var childPath = util_1.composePaths(path, "" + index);
    var childData = util_1.Resolve.data(reducers_1.getData(state), childPath);
    var childLabel = firstPrimitiveProp ? childData[firstPrimitiveProp] : '';
    return tslib_1.__assign(tslib_1.__assign({}, ownProps), { childLabel: childLabel });
};
/**
 * Map state to control with detail props
 *
 * @param state the store's state
 * @param ownProps any element's own props
 * @returns {StatePropsOfArrayControl} state props for a table control
 */
exports.mapStateToControlWithDetailProps = function (state, ownProps) {
    var props = tslib_1.__rest(exports.mapStateToControlProps(state, ownProps), []);
    return tslib_1.__assign(tslib_1.__assign({}, props), { uischemas: state.jsonforms.uischemas });
};
/**
 * Map state to table props
 *
 * @param state the store's state
 * @param ownProps any element's own props
 * @returns {StatePropsOfArrayControl} state props for a table control
 */
exports.mapStateToArrayControlProps = function (state, ownProps) {
    var _a = exports.mapStateToControlWithDetailProps(state, ownProps), path = _a.path, schema = _a.schema, uischema = _a.uischema, props = tslib_1.__rest(_a, ["path", "schema", "uischema"]);
    var resolvedSchema = util_1.Resolve.schema(schema, 'items', props.rootSchema);
    var childErrors = reducers_1.getSubErrorsAt(path, resolvedSchema)(state);
    return tslib_1.__assign(tslib_1.__assign({}, props), { path: path,
        uischema: uischema, schema: resolvedSchema, childErrors: childErrors, renderers: ownProps.renderers || reducers_1.getRenderers(state), cells: ownProps.cells || reducers_1.getCells(state) });
};
/**
 * Maps state to dispatch properties of an array control.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfArrayControl} dispatch props of an array control
 */
exports.mapDispatchToArrayControlProps = function (dispatch) { return ({
    addItem: function (path, value) { return function () {
        dispatch(actions_1.update(path, function (array) {
            if (array === undefined || array === null) {
                return [value];
            }
            array.push(value);
            return array;
        }));
    }; },
    removeItems: function (path, toDelete) { return function () {
        dispatch(actions_1.update(path, function (array) {
            toDelete
                .sort()
                .reverse()
                .forEach(function (s) { return array.splice(s, 1); });
            return array;
        }));
    }; },
    moveUp: function (path, toMove) { return function () {
        dispatch(actions_1.update(path, function (array) {
            util_1.moveUp(array, toMove);
            return array;
        }));
    }; },
    moveDown: function (path, toMove) { return function () {
        dispatch(actions_1.update(path, function (array) {
            util_1.moveDown(array, toMove);
            return array;
        }));
    }; }
}); };
exports.mapDispatchToMultiEnumProps = function (dispatch) { return ({
    addItem: function (path, value) {
        dispatch(actions_1.update(path, function (data) {
            if (data === undefined || data === null) {
                return [value];
            }
            data.push(value);
            return data;
        }));
    },
    removeItem: function (path, toDelete) {
        dispatch(actions_1.update(path, function (data) {
            var indexInData = data.indexOf(toDelete);
            data.splice(indexInData, 1);
            return data;
        }));
    }
}); };
exports.layoutDefaultProps = {
    visible: true,
    enabled: true,
    path: '',
    direction: 'column'
};
var getDirection = function (uischema) {
    if (uischema.type === 'HorizontalLayout') {
        return 'row';
    }
    if (uischema.type === 'VerticalLayout') {
        return 'column';
    }
    return exports.layoutDefaultProps.direction;
};
/**
 * Map state to layout props.
 * @param state JSONForms state tree
 * @param ownProps any own props
 * @returns {StatePropsOfLayout}
 */
exports.mapStateToLayoutProps = function (state, ownProps) {
    var _a;
    var rootData = reducers_1.getData(state);
    var uischema = ownProps.uischema;
    var visible = ownProps.visible === undefined || util_1.hasShowRule(uischema)
        ? util_1.isVisible(ownProps.uischema, rootData, ownProps.path, reducers_1.getAjv(state))
        : ownProps.visible;
    var readonly = state.jsonforms.readonly;
    var enabled = !readonly && (ownProps.enabled === undefined || util_1.hasEnableRule(uischema)
        ? util_1.isEnabled(ownProps.uischema, rootData, ownProps.path, reducers_1.getAjv(state))
        : ownProps.enabled);
    var data = util_1.Resolve.data(rootData, ownProps.path);
    return tslib_1.__assign(tslib_1.__assign({}, exports.layoutDefaultProps), { renderers: ownProps.renderers || reducers_1.getRenderers(state), cells: ownProps.cells || reducers_1.getCells(state), visible: visible,
        enabled: enabled, path: ownProps.path, data: data, uischema: ownProps.uischema, schema: ownProps.schema, direction: (_a = ownProps.direction) !== null && _a !== void 0 ? _a : getDirection(uischema) });
};
exports.mapStateToJsonFormsRendererProps = function (state, ownProps) {
    var uischema = ownProps.uischema;
    if (uischema === undefined) {
        if (ownProps.schema) {
            uischema = reducers_1.findUISchema(state.jsonforms.uischemas, ownProps.schema, undefined, ownProps.path);
        }
        else {
            uischema = reducers_1.getUiSchema(state);
        }
    }
    return {
        renderers: ownProps.renderers || get_1.default(state.jsonforms, 'renderers') || [],
        cells: ownProps.cells || get_1.default(state.jsonforms, 'cells') || [],
        schema: ownProps.schema || reducers_1.getSchema(state),
        rootSchema: reducers_1.getSchema(state),
        uischema: uischema,
        refResolver: function (schema) {
            return json_schema_ref_parser_1.default.dereference(schema, reducers_1.getRefParserOptions(state));
        },
        path: ownProps.path
    };
};
exports.controlDefaultProps = tslib_1.__assign(tslib_1.__assign({}, exports.layoutDefaultProps), { errors: [] });
var mapStateToCombinatorRendererProps = function (state, ownProps, keyword) {
    var uischema = ownProps.uischema;
    var path = util_1.composeWithUi(uischema, ownProps.path);
    var rootSchema = reducers_1.getSchema(state);
    var resolvedSchema = util_1.Resolve.schema(ownProps.schema || rootSchema, uischema.scope, rootSchema);
    var visible = ownProps.visible === undefined || util_1.hasShowRule(uischema)
        ? util_1.isVisible(uischema, reducers_1.getData(state), ownProps.path, reducers_1.getAjv(state))
        : ownProps.visible;
    var id = ownProps.id;
    var data = util_1.Resolve.data(reducers_1.getData(state), path);
    var ajv = state.jsonforms.core.ajv;
    var schema = resolvedSchema || rootSchema;
    var _schema = util_1.resolveSubSchemas(schema, rootSchema, keyword);
    var structuralKeywords = [
        'required',
        'additionalProperties',
        'type',
        'enum'
    ];
    var dataIsValid = function (errors) {
        return (!errors ||
            errors.length === 0 ||
            !errors.find(function (e) { return structuralKeywords.indexOf(e.keyword) !== -1; }));
    };
    var indexOfFittingSchema;
    for (var i = 0; i < _schema[keyword].length; i++) {
        var valFn = ajv.compile(_schema[keyword][i]);
        valFn(data);
        if (dataIsValid(valFn.errors)) {
            indexOfFittingSchema = i;
            break;
        }
    }
    return {
        data: data,
        path: path,
        schema: schema,
        rootSchema: rootSchema,
        visible: visible,
        id: id,
        indexOfFittingSchema: indexOfFittingSchema,
        uischemas: state.jsonforms.uischemas,
        uischema: uischema
    };
};
/**
 * Map state to all of renderer props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfCombinator} state props for a combinator
 */
exports.mapStateToAllOfProps = function (state, ownProps) {
    return mapStateToCombinatorRendererProps(state, ownProps, 'allOf');
};
exports.mapStateToAnyOfProps = function (state, ownProps) {
    return mapStateToCombinatorRendererProps(state, ownProps, 'anyOf');
};
exports.mapStateToOneOfProps = function (state, ownProps) {
    return mapStateToCombinatorRendererProps(state, ownProps, 'oneOf');
};
/**
 * Map state to table props
 *
 * @param state the store's state
 * @param ownProps any element's own props
 * @returns {StatePropsOfArrayControl} state props for a table control
 */
exports.mapStateToArrayLayoutProps = function (state, ownProps) {
    var _a = exports.mapStateToControlWithDetailProps(state, ownProps), path = _a.path, schema = _a.schema, uischema = _a.uischema, errors = _a.errors, props = tslib_1.__rest(_a, ["path", "schema", "uischema", "errors"]);
    var resolvedSchema = util_1.Resolve.schema(schema, 'items', props.rootSchema);
    var childErrors = util_1.formatErrorMessage(reducers_1.getSubErrorsAt(path, resolvedSchema)(state).map(function (error) { return error.message; }));
    var allErrors = errors +
        (errors.length > 0 && childErrors.length > 0 ? '\n' : '') +
        childErrors;
    return tslib_1.__assign(tslib_1.__assign({}, props), { path: path,
        uischema: uischema, schema: resolvedSchema, data: props.data ? props.data.length : 0, errors: allErrors, minItems: schema.minItems });
};
//# sourceMappingURL=renderer.js.map