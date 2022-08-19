"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
exports.cellReducer = function (state, _a) {
    if (state === void 0) { state = []; }
    var type = _a.type, tester = _a.tester, cell = _a.cell;
    switch (type) {
        case actions_1.ADD_CELL:
            return state.concat([{ tester: tester, cell: cell }]);
        case actions_1.REMOVE_CELL:
            return state.filter(function (t) { return t.tester !== tester; });
        default:
            return state;
    }
};
//# sourceMappingURL=cells.js.map