export interface ScratchConfig {
  /** 刮线的宽度，默认40 */
  lineWidth?: number;
  /** 全显阈值 0 ~ 1，默认0.3 */
  threshold?: number;
  /** 遮罩层颜色，默认#ccc */
  fillStyle?: string;
}

export interface ScratchConfigWidthDOM extends ScratchConfig {
  /** dom的id */
  id?: string;
  /** dom元素 */
  el?: HTMLElement;
}

export class Scratch {

  private _config: ScratchConfig = {
    lineWidth: 40,
    threshold: 0.3,
    fillStyle: '#ccc'
  };
  private _canvas = document.createElement('canvas');
  private _ctx: CanvasRenderingContext2D = this._canvas.getContext('2d');
  private _rect: ClientRect;
  private _startPoint: [number, number];
  private _isFirstStart = true;

  private get _isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
  }

  get context() {
    return this._ctx;
  }

  onScrachEnd = Function.prototype;
  onScrachStart = Function.prototype;

  constructor(id?: string, config?: ScratchConfig, autoDraw?: boolean);
  constructor(el?: HTMLElement, config?: ScratchConfig);
  constructor(config?: ScratchConfigWidthDOM);
  constructor(first?: any, second?: any, third?: any) {
    first && this.init(first, second, third);
  }

  private _init(el: HTMLElement, config: ScratchConfig, autoDraw: boolean = true) {
    Object.assign(this._config, config || {});

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
    autoDraw && this.drawMask();
    return this;
  }

  /**
   * 初始化
   * @param id DOM的id
   * @param config 配置项
   * @param autoDraw 是否自动画出遮罩层，默认是
   */
  init(id: string, config?: ScratchConfig, autoDraw?: boolean): Scratch;
  /**
   * 初始化
   * @param el DOM元素
   * @param config 配置项
   * @param autoDraw 是否自动画出遮罩层，默认是
   */
  init(el: HTMLElement, config?: ScratchConfig, autoDraw?: boolean): Scratch;
  /**
   * 初始化
   * @param config 配置项
   * @param autoDraw 是否自动画出遮罩层，默认是
   */
  init(config: ScratchConfigWidthDOM, autoDraw?: boolean): Scratch;
  init(first: any, second?: any, third?: any) {
    if (first instanceof HTMLElement) {
      return this._init(first, second, third);
    } else if (typeof first === 'string') {
      return this._init(document.getElementById(first), second, third);
    } else {
      if (!first || (!first.el && !first.id)) {
        throw new Error('element or id is need');
      }
      return this._init(first.el || document.getElementById(first.id), first, second);
    }
  }

  setConfig(name: 'lineWidth' | 'threshold' | 'fillStyle', value: number | string): void;
  setConfig(config: ScratchConfig): void;
  setConfig(first: any, second?: any) {
    Object.assign(this._config, typeof first === 'string' ? { [first]: second } : first);
  };

  /**
   * 画遮罩层
   * @param fillStyle 填充颜色
   */
  drawMask(fillStyle: string | CanvasGradient | CanvasPattern = this._config.fillStyle) {
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
      el.ontouchend = this.touchEnd.bind(this);
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
      el.onmouseout = el.onmouseup = (e) => {
        e.preventDefault();
        this.touchEnd();
        return false;
      }
    }
  }

  private _unLoadEvent(el: HTMLCanvasElement) {
    el.ontouchstart = el.ontouchmove = el.ontouchend = null;
    el.onmousedown = el.onmousemove = el.onmouseout = el.onmouseup = null;
  }

  private _drawLine(start: [number, number], end: [number, number]) {
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
      this._drawLine(this._startPoint, point);
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
