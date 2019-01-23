import { Scratch } from '../index';

const btn = document.getElementById('btn');

const sc = new Scratch('demo');

btn.onclick = () => {
  sc.drawMask();
}
