"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The different rule effects.
 */
var RuleEffect;
(function (RuleEffect) {
    /**
     * Effect that hides the associated element.
     */
    RuleEffect["HIDE"] = "HIDE";
    /**
     * Effect that shows the associated element.
     */
    RuleEffect["SHOW"] = "SHOW";
    /**
     * Effect that enables the associated element.
     */
    RuleEffect["ENABLE"] = "ENABLE";
    /**
     * Effect that disables the associated element.
     */
    RuleEffect["DISABLE"] = "DISABLE";
})(RuleEffect = exports.RuleEffect || (exports.RuleEffect = {}));
exports.isGroup = function (layout) {
    return layout.type === 'Group';
};
exports.isLayout = function (uischema) {
    return uischema.elements !== undefined;
};
//# sourceMappingURL=uischema.js.map