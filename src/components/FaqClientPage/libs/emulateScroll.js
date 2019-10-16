/* Firefox用にホイールでのスクロールをエミュレートする */

import { getScrollableAnscesterWithDelta } from '../common/scrollUtil';

if (navigator.userAgent.indexOf('Firefox') !== -1) {
  document.body.addEventListener('wheel', e => {
    console.log(e.deltaX, e.deltaY);
    const scrollElement = getScrollableAnscesterWithDelta(e.target, {
      x: e.deltaX,
      y: e.deltaY,
    });
    if (scrollElement !== window) {
      scrollElement.scrollBy({
        top: e.deltaY * 1,
        left: e.deltaX * 1,
      });
      e.preventDefault();
    }
  });
}
