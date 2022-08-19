"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var move = function (array, index, delta) {
    var newIndex = index + delta;
    if (newIndex < 0 || newIndex >= array.length) {
        return;
    } // Already at the top or bottom.
    var indexes = [index, newIndex].sort(function (a, b) { return a - b; }); // Sort the indixes
    array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]);
};
var moveUp = function (array, toMove) {
    move(array, toMove, -1);
};
exports.moveUp = moveUp;
var moveDown = function (array, toMove) {
    move(array, toMove, 1);
};
exports.moveDown = moveDown;
//# sourceMappingURL=array.js.map