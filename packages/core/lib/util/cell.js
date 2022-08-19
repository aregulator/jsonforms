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
var union_1 = tslib_1.__importDefault(require("lodash/union"));
var reducers_1 = require("../reducers");
var _1 = require(".");
var renderer_1 = require("./renderer");
/**
 * Map state to cell props.
 *
 * @param state JSONForms state tree
 * @param ownProps any own props
 * @returns {StatePropsOfCell} state props of a cell
 */
exports.mapStateToCellProps = function (state, ownProps) {
    var id = ownProps.id, schema = ownProps.schema, path = ownProps.path, uischema = ownProps.uischema, renderers = ownProps.renderers, cells = ownProps.cells;
    var rootData = reducers_1.getData(state);
    var visible = ownProps.visible !== undefined
        ? ownProps.visible
        : _1.isVisible(uischema, rootData, undefined, reducers_1.getAjv(state));
    var readonly = state.jsonforms.readonly;
    var enabled = !readonly && (ownProps.enabled !== undefined
        ? ownProps.enabled
        : _1.isEnabled(uischema, rootData, undefined, reducers_1.getAjv(state)));
    var errors = _1.formatErrorMessage(union_1.default(reducers_1.getErrorAt(path, schema)(state).map(function (error) { return error.message; })));
    var isValid = isEmpty_1.default(errors);
    var rootSchema = reducers_1.getSchema(state);
    return {
        data: _1.Resolve.data(rootData, path),
        visible: visible,
        enabled: enabled,
        id: id,
        path: path,
        errors: errors,
        isValid: isValid,
        schema: schema,
        uischema: uischema,
        config: reducers_1.getConfig(state),
        rootSchema: rootSchema,
        renderers: renderers,
        cells: cells
    };
};
exports.mapStateToDispatchCellProps = function (state, ownProps) {
    var props = exports.mapStateToCellProps(state, ownProps);
    var renderers = ownProps.renderers, cells = ownProps.cells, otherOwnProps = tslib_1.__rest(ownProps, ["renderers", "cells"]);
    return tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, props), otherOwnProps), { cells: cells || state.jsonforms.cells || [] });
};
/**
 * Default mapStateToCellProps for enum cell. Options is used for populating dropdown list
 * @param state
 * @param ownProps
 * @returns {StatePropsOfEnumCell}
 */
exports.defaultMapStateToEnumCellProps = function (state, ownProps) {
    var _a;
    var props = exports.mapStateToCellProps(state, ownProps);
    var options = ownProps.options || ((_a = props.schema.enum) === null || _a === void 0 ? void 0 : _a.map(renderer_1.enumToEnumOptionMapper)) ||
        props.schema.const && [renderer_1.enumToEnumOptionMapper(props.schema.const)];
    return tslib_1.__assign(tslib_1.__assign({}, props), { options: options });
};
/**
 * Synonym for mapDispatchToControlProps.
 *
 * @type {(dispatch) => {handleChange(path, value): void}}
 */
exports.mapDispatchToCellProps = renderer_1.mapDispatchToControlProps;
/**
 * Default dispatch to control props which can be customized to set handleChange action
 *
 */
exports.defaultMapDispatchToControlProps = 
// TODO: ownProps types
function (dispatch, ownProps) {
    var handleChange = exports.mapDispatchToCellProps(dispatch).handleChange;
    return {
        handleChange: ownProps.handleChange || handleChange
    };
};
//# sourceMappingURL=cell.js.map