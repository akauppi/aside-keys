/*
* src/tools/slideFixed.js
*
* Svelte transition to slide in a 'position: fixed' object.
*
* The 'right' CSS property is animated between -<offsetWidth>..0.
*
* Expects:
*   CSS: {
*     position: fixed;
*   }
*/
const USE_TICK_WORKAROUND = true;

function slideFixed(node, {
  duration = 1000,
  easing = x => x     // default: no easing (one can do better!)
}) {
  const width = node.offsetWidth;

  function f(t) {   // Number -> "<number>px"
    const t2 = easing(t)
    return `${ (t2-1)*width }px`
  }

  // NOTE: In Svelte (3.31.2) the 'css' return DOES NOT CAUSE the 'aside' to move.
  //    The 'tick' below does (but is jerky since it's not optimized for animations). #svelte
  //
  //    tbd. research and file as Svelte web component bug (or find existing bug report and ref here) #help
  //
  const o = !USE_TICK_WORKAROUND ? {
    css: t => {   // DOES NOT CAUSE ANIMATION
      return `right: ${f(t)}`
    }
  } : {
    tick: t => {  // jer..ky
      node.style.right = f(t)   // 👍🥴
    }
  }

  return {
    delay: 0,
    duration,
    ...o
  }
}

export {
  slideFixed
}
