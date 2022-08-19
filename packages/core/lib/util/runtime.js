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
var has_1 = tslib_1.__importDefault(require("lodash/has"));
var uischema_1 = require("../models/uischema");
var resolvers_1 = require("./resolvers");
var path_1 = require("./path");
var isOrCondition = function (condition) {
    return condition.type === 'OR';
};
var isAndCondition = function (condition) {
    return condition.type === 'AND';
};
var isLeafCondition = function (condition) {
    return condition.type === 'LEAF';
};
var isSchemaCondition = function (condition) { return has_1.default(condition, 'schema'); };
var getConditionScope = function (condition, path) {
    return path_1.composeWithUi(condition, path);
};
var evaluateCondition = function (data, condition, path, ajv) {
    if (isAndCondition(condition)) {
        return condition.conditions.reduce(function (acc, cur) { return acc && evaluateCondition(data, cur, path, ajv); }, true);
    }
    else if (isOrCondition(condition)) {
        return condition.conditions.reduce(function (acc, cur) { return acc || evaluateCondition(data, cur, path, ajv); }, false);
    }
    else if (isLeafCondition(condition)) {
        var value = resolvers_1.resolveData(data, getConditionScope(condition, path));
        return value === condition.expectedValue;
    }
    else if (isSchemaCondition(condition)) {
        var value = resolvers_1.resolveData(data, getConditionScope(condition, path));
        return ajv.validate(condition.schema, value);
    }
    else {
        // unknown condition
        return true;
    }
};
var isRuleFulfilled = function (uischema, data, path, ajv) {
    var condition = uischema.rule.condition;
    return evaluateCondition(data, condition, path, ajv);
};
exports.evalVisibility = function (uischema, data, path, ajv) {
    if (path === void 0) { path = undefined; }
    var fulfilled = isRuleFulfilled(uischema, data, path, ajv);
    switch (uischema.rule.effect) {
        case uischema_1.RuleEffect.HIDE:
            return !fulfilled;
        case uischema_1.RuleEffect.SHOW:
            return fulfilled;
        // visible by default
        default:
            return true;
    }
};
exports.evalEnablement = function (uischema, data, path, ajv) {
    if (path === void 0) { path = undefined; }
    var fulfilled = isRuleFulfilled(uischema, data, path, ajv);
    switch (uischema.rule.effect) {
        case uischema_1.RuleEffect.DISABLE:
            return !fulfilled;
        case uischema_1.RuleEffect.ENABLE:
            return fulfilled;
        // enabled by default
        default:
            return true;
    }
};
exports.hasShowRule = function (uischema) {
    if (uischema.rule &&
        (uischema.rule.effect === uischema_1.RuleEffect.SHOW ||
            uischema.rule.effect === uischema_1.RuleEffect.HIDE)) {
        return true;
    }
    return false;
};
exports.hasEnableRule = function (uischema) {
    if (uischema.rule &&
        (uischema.rule.effect === uischema_1.RuleEffect.ENABLE ||
            uischema.rule.effect === uischema_1.RuleEffect.DISABLE)) {
        return true;
    }
    return false;
};
exports.isVisible = function (uischema, data, path, ajv) {
    if (path === void 0) { path = undefined; }
    if (uischema.rule) {
        return exports.evalVisibility(uischema, data, path, ajv);
    }
    return true;
};
exports.isEnabled = function (uischema, data, path, ajv) {
    if (path === void 0) { path = undefined; }
    if (uischema.rule) {
        return exports.evalEnablement(uischema, data, path, ajv);
    }
    return true;
};
//# sourceMappingURL=runtime.js.map