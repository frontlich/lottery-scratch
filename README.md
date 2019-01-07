# how to use

# 初始化
1.

`const sc = new Scratch('#div');`

2.

```
const el = document.getElementById('#div');
const sc = new Scratch(el);
```

3.

```
const sc = new Scratch({
  id: '#div'
});
```

4.

```
const el = document.getElementById('#div');
const sc = new Scratch({
  el
});
```

5.
```
const sc = new Scratch();
sc.init('#div');
```

6.
```
const sc = new Scratch();
const el = document.getElementById('#div');
sc.init(el);
```

7.
```
const sc = new Scratch();
sc.init({
  id: '#div'
});
```

8.
```
const sc = new Scratch();
const el = document.getElementById('#div');
sc.init({
  el
});
```

# 配置项

```
interface ScratchConfig {
  /** 刮线的宽度，默认40 */
  lineWidth?: number;
  /** 全显阈值 0 ~ 1，默认0.3 */
  threshold?: number;
  /** 遮罩层颜色，默认#ccc */
  fillStyle?: string;
}
```

有两种方法改变配置项：1、在初始化时将配置项传入；2、调用setConfig方法设置配置项
注意：在初始化之后,，改变fillStyle不会立即改变遮罩层颜色，想要更新需要重新调用drawMask方法;

# drawMask 和 clearMask

  drawMask：画出遮罩层；

  clearMask：清除遮罩层；
