"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scratch = /** @class */ (function () {
    function Scratch(first, second, third) {
        this._config = {
            lineWidth: 40,
            threshold: 0.3,
            fillStyle: '#ccc'
        };
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d');
        this._isFirstStart = true;
        this.onScrachEnd = Function.prototype;
        this.onScrachStart = Function.prototype;
        first && this.init(first, second, third);
    }
    Object.defineProperty(Scratch.prototype, "_isMobile", {
        get: function () {
            return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scratch.prototype, "context", {
        get: function () {
            return this._ctx;
        },
        enumerable: true,
        configurable: true
    });
    Scratch.prototype._init = function (el, config, autoDraw) {
        if (autoDraw === void 0) { autoDraw = true; }
        Object.assign(this._config, config || {});
        var clientRect = el.getBoundingClientRect();
        this._rect = clientRect;
        el.style.position = 'relative';
        this._canvas.width = clientRect.width;
        this._canvas.height = clientRect.height;
        var _style = getComputedStyle(el);
        Object.assign(this._canvas.style, {
            position: 'absolute',
            top: "-" + _style.borderTopWidth,
            left: "-" + _style.borderLeftWidth,
            cursor: 'pointer'
        });
        el.appendChild(this._canvas);
        autoDraw && this.drawMask();
        return this;
    };
    Scratch.prototype.init = function (first, second, third) {
        if (first instanceof HTMLElement) {
            return this._init(first, second, third);
        }
        else if (typeof first === 'string') {
            return this._init(document.getElementById(first), second, third);
        }
        else {
            if (!first || !first.el || !first.id) {
                throw new Error('element or id is need');
            }
            return this._init(first.el || document.getElementById(first.id), first, second);
        }
    };
    Scratch.prototype.setConfig = function (first, second) {
        var _a;
        Object.assign(this._config, typeof first === 'string' ? (_a = {}, _a[first] = second, _a) : first);
    };
    ;
    /**
     * 画遮罩层
     * @param fillStyle 填充颜色
     */
    Scratch.prototype.drawMask = function (fillStyle) {
        if (fillStyle === void 0) { fillStyle = this._config.fillStyle; }
        var ctx = this._ctx;
        this._isFirstStart = true;
        ctx.fillStyle = fillStyle;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillRect(0, 0, this._rect.width, this._rect.height);
        this._loadEvent(this._canvas, this._rect);
        return this;
    };
    Scratch.prototype._loadEvent = function (el, rect) {
        var _this = this;
        if (this._isMobile) {
            el.ontouchstart = function (e) {
                e.preventDefault();
                _this.touchStart([e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top]);
                return false;
            };
            el.ontouchmove = function (e) {
                e.preventDefault();
                _this.touchMove([e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top]);
                return false;
            };
            document.ontouchend = this.touchEnd.bind(this);
        }
        else {
            el.onmousedown = function (e) {
                e.preventDefault();
                _this.touchStart([e.offsetX, e.offsetY]);
                return false;
            };
            el.onmousemove = function (e) {
                e.preventDefault();
                _this.touchMove([e.offsetX, e.offsetY]);
                return false;
            };
            document.onmouseup = this.touchEnd.bind(this);
        }
    };
    Scratch.prototype._unLoadEvent = function (el) {
        el.ontouchstart = null;
        el.ontouchmove = null;
        document.ontouchend = null;
        el.onmousedown = null;
        el.onmousemove = null;
        document.onmouseup = null;
    };
    Scratch.prototype.drawLine = function (start, end) {
        var ctx = this._ctx;
        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.moveTo.apply(ctx, start);
        ctx.lineCap = 'round';
        ctx.lineWidth = this._config.lineWidth;
        ctx.lineTo.apply(ctx, end);
        ctx.stroke();
        ctx.closePath();
    };
    Scratch.prototype.touchStart = function (point) {
        if (this._isFirstStart) {
            this.onScrachStart();
            this._isFirstStart = false;
        }
        this._startPoint = point;
    };
    Scratch.prototype.touchMove = function (point) {
        if (this._startPoint) {
            this.drawLine(this._startPoint, point);
            this._startPoint = point;
        }
    };
    Scratch.prototype.touchEnd = function () {
        this._startPoint = null;
        var pixels = this._ctx.getImageData(0, 0, this._rect.width, this._rect.height);
        var alphas = pixels.data.filter(function (v, i) { return i % 4 === 3; });
        if (alphas.filter(function (v) { return !v; }).length > alphas.length * this._config.threshold) {
            this.clearMask();
            this.onScrachEnd();
            this._unLoadEvent(this._canvas);
        }
    };
    Scratch.prototype.clearMask = function () {
        this._ctx.clearRect(0, 0, this._rect.width, this._rect.height);
    };
    return Scratch;
}());
exports.Scratch = Scratch;
