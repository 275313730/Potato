"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getSpriteComponents(sprite1, sprite2) {
    var size1 = sprite1.transform.size;
    var position1 = sprite1.transform.position;
    var size2 = sprite2.transform.size;
    var position2 = sprite2.transform.position;
    return { size1: size1, position1: position1, size2: size2, position2: position2 };
}
var Geometry = (function () {
    function Geometry() {
    }
    Geometry.prototype.above = function (sprite1, sprite2) {
        var _a = getSpriteComponents(sprite1, sprite2), size1 = _a.size1, position1 = _a.position1, size2 = _a.size2, position2 = _a.position2;
        if (position1.y + size1.y <= position2.y && position1.x + size1.x >= size2.x && position1.x <= position2.x + size2.x) {
            return true;
        }
        return false;
    };
    Geometry.prototype.contain = function (sprite1, sprite2) {
        var _a = getSpriteComponents(sprite1, sprite2), size1 = _a.size1, position1 = _a.position1, size2 = _a.size2, position2 = _a.position2;
        if (w1 < w2 && h1 < h2 &&
            (x1 <= x2 || x1 + w1 >= x2 + w2) &&
            (y1 <= y2 || y1 + h1 >= y2 + h2)) {
            return false;
        }
        return true;
    };
    Geometry.prototype.distance = function (type, unit1, unit2) {
        var _a = getData(unit1, unit2), x1 = _a.x1, y1 = _a.y1, w1 = _a.w1, h1 = _a.h1, x2 = _a.x2, y2 = _a.y2, w2 = _a.w2, h2 = _a.h2;
        if (type === 'y') {
            if (y2 > y1 + h1) {
                return y2 - (y1 + h1);
            }
            else if (y1 > y2 + h2) {
                return y1 - (y2 + h2);
            }
            else {
                return 0;
            }
        }
        if (type === 'x') {
            if (x2 > x1 + w1) {
                return x2 - (x1 + w1);
            }
            else if (x1 > x2 + w2) {
                return x1 - (x2 + w2);
            }
            else {
                return 0;
            }
        }
        if (type === "o") {
            var o1 = [x1 + w1 / 2, y1 + h1 / 2];
            var o2 = [x2 + w2 / 2, y2 + h2 / 2];
            return Math.sqrt(Math.pow((o1[0] - o2[0]), 2) + Math.pow((o1[1] - o2[1]), 2));
        }
    };
    Geometry.prototype.intersect = function (unit1, unit2) {
        var _a = getData(unit1, unit2), x1 = _a.x1, y1 = _a.y1, w1 = _a.w1, h1 = _a.h1, x2 = _a.x2, y2 = _a.y2, w2 = _a.w2, h2 = _a.h2;
        if (x1 >= x2 + w2 ||
            x1 + w1 <= x2 ||
            y1 >= y2 + h2 ||
            y1 + h1 <= y2) {
            return false;
        }
        return true;
    };
    Geometry.prototype.onRight = function (unit1, unit2) {
        var _a = getData(unit1, unit2), x1 = _a.x1, y1 = _a.y1, h1 = _a.h1, x2 = _a.x2, y2 = _a.y2, w2 = _a.w2, h2 = _a.h2;
        if (x1 >= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
            return true;
        }
        return false;
    };
    Geometry.prototype.onLeft = function (unit1, unit2) {
        var _a = getData(unit1, unit2), x1 = _a.x1, y1 = _a.y1, w1 = _a.w1, h1 = _a.h1, x2 = _a.x2, y2 = _a.y2, h2 = _a.h2;
        if (x1 + w1 <= x2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
            return true;
        }
        return false;
    };
    Geometry.prototype.tangent = function (unit1, unit2) {
        var _a = getData(unit1, unit2), x1 = _a.x1, y1 = _a.y1, w1 = _a.w1, h1 = _a.h1, x2 = _a.x2, y2 = _a.y2, w2 = _a.w2, h2 = _a.h2;
        if (x1 > x2 + w2 ||
            x1 + w1 < x2 ||
            y1 > y2 + h2 ||
            y1 + h1 < y2) {
            return false;
        }
        return true;
    };
    Geometry.prototype.under = function (unit1, unit2) {
        var _a = getData(unit1, unit2), x1 = _a.x1, y1 = _a.y1, w1 = _a.w1, x2 = _a.x2, y2 = _a.y2, w2 = _a.w2, h2 = _a.h2;
        if (y1 >= y2 + h2 && x1 + w1 >= x2 && x1 <= x2 + w2) {
            return true;
        }
        return false;
    };
    return Geometry;
}());
;
//# sourceMappingURL=Geometry.js.map