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
export declare class Scratch {
    private _config;
    private _canvas;
    private _ctx;
    private _rect;
    private _startPoint;
    private _isFirstStart;
    private readonly _isMobile;
    readonly context: CanvasRenderingContext2D;
    onScrachEnd: Function;
    onScrachStart: Function;
    constructor(id?: string, config?: ScratchConfig, autoDraw?: boolean);
    constructor(el?: HTMLElement, config?: ScratchConfig);
    constructor(config?: ScratchConfigWidthDOM);
    private _init;
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
    setConfig(name: 'lineWidth' | 'threshold' | 'fillStyle', value: number | string): void;
    setConfig(config: ScratchConfig): void;
    /**
     * 画遮罩层
     * @param fillStyle 填充颜色
     */
    drawMask(fillStyle?: string | CanvasGradient | CanvasPattern): this;
    private _loadEvent;
    private _unLoadEvent;
    private drawLine;
    private touchStart;
    private touchMove;
    private touchEnd;
    clearMask(): void;
}
