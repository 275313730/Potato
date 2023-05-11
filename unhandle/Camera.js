"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_js_1 = require("../src/game/Game.js");
function camera(stage) {
    var camera = {
        x: 0,
        y: 0,
        follow: null,
        movement: null
    };
    function createMovement(x, y, time, callback, disable) {
        if (disable === void 0) { disable = true; }
        var frames = time * 60 || 1;
        var perX = x / frames;
        var perY = y / frames;
        if (perX === 0 && perY === 0)
            return;
        camera.follow = null;
        var sw = stage.width, sh = stage.height;
        var _a = Game_js_1.default.width, gw = _a.width, gh = _a.height;
        var count = 0;
        if (disable === true) {
            Game_js_1.default.sprite.travel(function (sprite) {
                sprite.disabled = true;
            });
        }
        camera.movement = function () {
            camera.x += perX;
            camera.y += perY;
            count++;
            if (count > frames ||
                (camera.x < 0 || camera.x > sw - gw) ||
                (camera.y < 0 || camera.y > sh - gh)) {
                camera.x = Math.max(0, camera.x);
                camera.x = Math.min(camera.x, sw - gw);
                camera.y = Math.max(0, camera.y);
                camera.y = Math.min(camera.y, sh - gh);
                camera.movement = null;
                if (disable === true) {
                    Game_js_1.default.sprite.travel(function (sprite) {
                        sprite.disabled = false;
                    });
                }
                callback && callback();
            }
        };
    }
    function cameraCal() {
        var follow = camera.follow;
        if (follow) {
            var position = borderCal(follow);
            camera.x = position.x;
            camera.y = position.y;
        }
        else {
            camera.movement && camera.movement();
        }
    }
    function borderCal(sprite) {
        var ux = sprite.x, uy = sprite.y, uw = sprite.width, uh = sprite.height;
        var sw = stage.width, sh = stage.height;
        var gw = Game_js_1.default.width, gh = Game_js_1.default.height;
        var x, y;
        if (ux < (gw - uw) / 2) {
            x = 0;
        }
        else if (ux > sw - (gw + uw) / 2) {
            x = sw - gw;
        }
        else {
            x = ux - (gw - uw) / 2;
        }
        if (uy < (gh - uh) / 2) {
            y = 0;
        }
        else if (uy > sh - (gh + uh) / 2) {
            y = sh - gh;
        }
        else {
            y = uy - (gh - uh) / 2;
        }
        return { x: x, y: y };
    }
    return {
        follow: function (sprite) {
            if (sprite === camera.follow)
                return;
            camera.follow = sprite;
        },
        update: function () {
            cameraCal();
            return camera;
        },
        move: function (x, y, time, callback) {
            createMovement(x, y, time, callback);
        },
        moveTo: function (sprite, time, callback) {
            var _a = borderCal(sprite), x = _a.x, y = _a.y;
            createMovement((x - camera.x), (y - camera.y), time, callback);
        },
        unFollow: function () {
            camera.follow = null;
        }
    };
}
exports.default = camera;
//# sourceMappingURL=Camera.js.map