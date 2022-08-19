"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var find_1 = tslib_1.__importDefault(require("lodash/find"));
exports.getFirstPrimitiveProp = function (schema) {
    if (schema.properties) {
        return find_1.default(Object.keys(schema.properties), function (propName) {
            var prop = schema.properties[propName];
            return (prop.type === 'string' ||
                prop.type === 'number' ||
                prop.type === 'integer');
        });
    }
    return undefined;
};
//# sourceMappingURL=schema.js.map