// deltaで示した方向について、スクロールできるエレメントを探す
declare var window: any;
export const getScrollableAnscesterWithDelta = (element: any, delta: any) => {
  const selector = '.scrollX,.scrollY';
  for (
    let target = element;
    target;
    target = target.parentElement && target.parentElement.closest(selector)
  ) {
    if (target.classList.contains('scrollX') && delta.x !== 0) {
      // 横スクロールに関しては、propagationしない
      return target;
    } else if (target.classList.contains('scrollY')) {
      // 縦スクロールに関しては、実際にスクロール可能範囲になければ、propagationする
      if (delta.y < 0 && target.scrollTop > 0) {
        return target;
      } else if (
        delta.y > 0 &&
        target.scrollHeight - target.clientHeight > target.scrollTop
      ) {
        return target;
      }
    }
  }
  return window;
};

// directionで示した方向で、スクロールできるエレメントを探す
export const getScrollableAnscester = (element: any, direction: any) => {
  const selector = direction
    ? '.scroll' + direction.toUpperCase()
    : '.scrollX,.scrollY';
  const target = element.closest(selector);
  return target || window;
};

const getOffsetTop = (element: any, scrollableElement: any) => {
  const scrollOffsetParent = scrollableElement.offsetParent;
  let offsetTop = 0;
  /* eslint-disable no-unmodified-loop-condition */
  for (
    let target = element;
    scrollOffsetParent &&
    target &&
    target !== scrollOffsetParent &&
    scrollOffsetParent.contains(target);
    target = target.offsetParent
  ) {
    offsetTop += target.offsetTop;
  }
  return offsetTop - (scrollableElement ? scrollableElement.offsetTop : 0);
};

export function scrollIntoViewX(element: any, mode: any) {
  const scrollElement = getScrollableAnscester(element, 'x');
  // console.log("scrollIntoViewX", scrollElement, element, mode);
  if (scrollElement === window) {
    console.error('scrollElement not found');
    return;
  }

  const firstElement = element.parentElement.children[0];
  window.scrollElement = scrollElement;
  if (!mode) {
    scrollElement.scrollTo({
      left: element.offsetLeft - firstElement.offsetLeft,
      behavior: 'smooth',
    });
  } else if (mode === 'center') {
    scrollElement.scrollTo({
      left:
        element.offsetLeft -
        firstElement.offsetLeft +
        element.offsetWidth / 2 -
        scrollElement.clientWidth / 2,
      behavior: 'smooth',
    });
  }
}

export function scrollIntoViewY(element: any, { behavior = 'smooth', mode }: any = {}) {
  const mainHeight = 320; // Math.max(element.offsetHeight, 320);
  const upperHeight = 520;

  const scrollElement = getScrollableAnscester(element.parentElement, 'y');
  const offsetTop = getOffsetTop(element, scrollElement);

  const scrollElementHeight =
    scrollElement.clientHeight || scrollElement.innerHeight;

  let newOffsetHeight = null;
  if (mode === 'exact' || scrollElementHeight < mainHeight) {
    newOffsetHeight = offsetTop;
  } else if (scrollElementHeight < mainHeight + upperHeight) {
    newOffsetHeight = offsetTop - scrollElementHeight + mainHeight;
  } else {
    newOffsetHeight = offsetTop - upperHeight;
  }
  scrollElement.scrollTo({
    top: newOffsetHeight,
    behavior,
  });
}

export function scrollToTop(element: any, { behavior = 'smooth' } = {}) {
  const scrollElement = getScrollableAnscester(element.parentElement, 'y');
  scrollElement.scrollTo({
    top: 0,
    behavior,
  });
}

window.scrollIntoViewY = scrollIntoViewY;

export function scrollIntoViewDualY(mainElement: any, optionalElement: any) {
  const requiredMainHeight = 430;
  const scrollElement = getScrollableAnscester(mainElement, 'y');
  // console.log(
  //   "scrollIntoViewDualY",
  //   scrollElement,
  //   mainElement,
  //   optionalElement
  // );
  window.scrollElement = scrollElement;
  const optionalHeight = mainElement.offsetTop - optionalElement.offsetTop;
  const scrollElementHeight =
    scrollElement.clientHeight || scrollElement.innerHeight;
  if (scrollElementHeight < requiredMainHeight) {
    console.log('#');
    scrollElement.scrollTo({
      top: mainElement.offsetTop,
      behavior: 'smooth',
    });
  } else if (scrollElementHeight > optionalHeight + requiredMainHeight) {
    console.log('#');
    scrollElement.scrollTo({
      top: optionalElement.offsetTop,
      behavior: 'smooth',
    });
  } else {
    console.log('#');
    scrollElement.scrollTo({
      top: mainElement.offsetTop + requiredMainHeight - scrollElementHeight,
      behavior: 'smooth',
    });
  }
}
