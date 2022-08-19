"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("./core");
exports.coreReducer = core_1.coreReducer;
exports.errorsAt = core_1.errorsAt;
var default_data_1 = require("./default-data");
var default_data_2 = require("../reducers/default-data");
var renderers_1 = require("./renderers");
exports.rendererReducer = renderers_1.rendererReducer;
var uischemas_1 = require("./uischemas");
exports.findMatchingUISchema = uischemas_1.findMatchingUISchema;
exports.uischemaRegistryReducer = uischemas_1.uischemaRegistryReducer;
var i18n_1 = require("./i18n");
exports.i18nReducer = i18n_1.i18nReducer;
var generators_1 = require("../generators");
var cells_1 = require("./cells");
exports.cellReducer = cells_1.cellReducer;
var config_1 = require("./config");
exports.configReducer = config_1.configReducer;
var get_1 = tslib_1.__importDefault(require("lodash/get"));
exports.jsonFormsReducerConfig = {
    core: core_1.coreReducer,
    renderers: renderers_1.rendererReducer,
    cells: cells_1.cellReducer,
    config: config_1.configReducer,
    uischemas: uischemas_1.uischemaRegistryReducer,
    defaultData: default_data_2.defaultDataReducer,
    i18n: i18n_1.i18nReducer
};
exports.getData = function (state) {
    return core_1.extractData(get_1.default(state, 'jsonforms.core'));
};
exports.getSchema = function (state) {
    return core_1.extractSchema(get_1.default(state, 'jsonforms.core'));
};
exports.getUiSchema = function (state) {
    return core_1.extractUiSchema(get_1.default(state, 'jsonforms.core'));
};
exports.getRefParserOptions = function (state) {
    return core_1.extractRefParserOptions(get_1.default(state, 'jsonforms.core'));
};
exports.getAjv = function (state) { return core_1.extractAjv(get_1.default(state, 'jsonforms.core')); };
exports.getDefaultData = function (state) {
    return default_data_1.extractDefaultData(get_1.default(state, 'jsonforms.defaultData'));
};
exports.getRenderers = function (state) { return get_1.default(state, 'jsonforms.renderers'); };
exports.getCells = function (state) { return get_1.default(state, 'jsonforms.cells'); };
exports.getUISchemas = function (state) { return get_1.default(state, 'jsonforms.uischemas'); };
/**
 * Finds a registered UI schema to use, if any.
 * @param schema the JSON schema describing the data to be rendered
 * @param schemaPath the according schema path
 * @param path the instance path
 * @param fallbackLayoutType the type of the layout to use
 * @param control may be checked for embedded inline uischema options
 */
exports.findUISchema = function (uischemas, schema, schemaPath, path, fallbackLayoutType, control, rootSchema) {
    if (fallbackLayoutType === void 0) { fallbackLayoutType = 'VerticalLayout'; }
    // handle options
    if (control && control.options && control.options.detail) {
        if (typeof control.options.detail === 'string') {
            if (control.options.detail.toUpperCase() === 'GENERATE') {
                // force generation of uischema
                return generators_1.Generate.uiSchema(schema, fallbackLayoutType);
            }
        }
        else if (typeof control.options.detail === 'object') {
            // check if detail is a valid uischema
            if (control.options.detail.type &&
                typeof control.options.detail.type === 'string') {
                return control.options.detail;
            }
        }
    }
    // default
    var uiSchema = uischemas_1.findMatchingUISchema(uischemas)(schema, schemaPath, path);
    if (uiSchema === undefined) {
        return generators_1.Generate.uiSchema(schema, fallbackLayoutType, '#', rootSchema);
    }
    return uiSchema;
};
exports.getErrorAt = function (instancePath, schema) { return function (state) {
    return core_1.errorAt(instancePath, schema)(state.jsonforms.core);
}; };
exports.getSubErrorsAt = function (instancePath, schema) { return function (state) { return core_1.subErrorsAt(instancePath, schema)(state.jsonforms.core); }; };
exports.getConfig = function (state) { return state.jsonforms.config; };
exports.getLocale = function (state) {
    return i18n_1.fetchLocale(get_1.default(state, 'jsonforms.i18n'));
};
exports.getLocalizedSchema = function (locale) { return function (state) { return i18n_1.findLocalizedSchema(locale)(get_1.default(state, 'jsonforms.i18n')); }; };
exports.getLocalizedUISchema = function (locale) { return function (state) {
    return i18n_1.findLocalizedUISchema(locale)(get_1.default(state, 'jsonforms.i18n'));
}; };
//# sourceMappingURL=index.js.map