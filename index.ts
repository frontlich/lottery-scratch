export interface ScratchConfig {
  /** dom的id */
  id?: string;
  /** dom元素 */
  el?: HTMLElement;
  /**  刮线的宽度 */
  lineWidth?: number;
  /** 全显阈值 0 ~ 1 */
  threshold?: number;
  /** 遮罩层颜色 */
  fillStyle?: string;
}

export class Scratch {

  private _config: ScratchConfig = {
    lineWidth: 40,
    threshold: 0.3
  };
  private _canvas = document.createElement('canvas');
  private _ctx: CanvasRenderingContext2D = this._canvas.getContext('2d');
  private _rect: ClientRect;
  private _startPoint: [number, number];
  private _isFirstStart = true;

  onScrachEnd = Function.prototype;
  onScrachStart = Function.prototype;

  get context() {
    return this._ctx;
  }

  get _isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
  }

  constructor(config?: ScratchConfig) {
    config && this.init(config);
  }

  init(config: ScratchConfig, autoDraw = true) {
    if (!config.el || !config.id) {
      throw new Error('element or id is need');
    }
    Object.assign(this._config, config);

    const el = config.el || document.getElementById(config.id);
    const clientRect = el.getBoundingClientRect();
    this._rect = clientRect;
    el.style.position = 'relative';

    this._canvas.width = clientRect.width;
    this._canvas.height = clientRect.height;

    const _style = getComputedStyle(el);
    Object.assign(this._canvas.style, {
      position: 'absolute',
      top: `-${_style.borderTopWidth}`,
      left: `-${_style.borderLeftWidth}`,
      cursor: 'pointer'
    });

    el.appendChild(this._canvas);
    autoDraw && this.drawMask(config.fillStyle);
    return this;
  }

  /**
   * 画遮罩层
   * @param fillStyle 填充颜色
   */
  drawMask(fillStyle: string | CanvasGradient | CanvasPattern = '#ccc') {
    const ctx = this._ctx;
    this._isFirstStart = true;
    ctx.fillStyle = fillStyle;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, this._rect.width, this._rect.height);
    this._loadEvent(this._canvas, this._rect);
    return this;
  }

  private _loadEvent(el: HTMLCanvasElement, rect: ClientRect) {
    if (this._isMobile) {
      el.ontouchstart = (e) => {
        e.preventDefault();
        this.touchStart([e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top]);
        return false;
      };
      el.ontouchmove = (e) => {
        e.preventDefault();
        this.touchMove([e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top]);
        return false;
      }
      document.ontouchend = this.touchEnd.bind(this);
    } else {
      el.onmousedown = (e) => {
        e.preventDefault();
        this.touchStart([e.offsetX, e.offsetY]);
        return false;
      };
      el.onmousemove = (e) => {
        e.preventDefault();
        this.touchMove([e.offsetX, e.offsetY]);
        return false;
      }
      document.onmouseup = this.touchEnd.bind(this);
    }
  }

  private _unLoadEvent(el: HTMLCanvasElement) {
    el.ontouchstart = null;
    el.ontouchmove = null;
    document.ontouchend = null;
    el.onmousedown = null;
    el.onmousemove = null;
    document.onmouseup = null;
  }

  private drawLine(start: [number, number], end: [number, number]) {
    const ctx = this._ctx;
    ctx.beginPath();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.moveTo(...start);
    ctx.lineCap = 'round';
    ctx.lineWidth = this._config.lineWidth;
    ctx.lineTo(...end);
    ctx.stroke();
    ctx.closePath();
  }

  private touchStart(point: [number, number]) {
    if (this._isFirstStart) {
      this.onScrachStart();
      this._isFirstStart = false;
    }
    this._startPoint = point;
  }

  private touchMove(point: [number, number]) {
    if (this._startPoint) {
      this.drawLine(this._startPoint, point);
      this._startPoint = point;
    }
  }

  private touchEnd() {
    this._startPoint = null;
    const pixels = this._ctx.getImageData(0, 0, this._rect.width, this._rect.height);
    const alphas = pixels.data.filter((v, i) => i % 4 === 3);
    if (alphas.filter(v => !v).length > alphas.length * this._config.threshold) {
      this.clearMask();
      this.onScrachEnd();
      this._unLoadEvent(this._canvas);
    }
  }

  clearMask() {
    this._ctx.clearRect(0, 0, this._rect.width, this._rect.height);
  }
}
