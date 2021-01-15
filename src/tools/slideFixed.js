/*
* src/tools/slideFixed.js
*
* Svelte transition to slide in a 'position: fixed' object.
*
* The 'right' CSS property is animated between -<original width>..0. (tbd. check if we need a margin)
*
* Expects:
*   CSS: {
*     position: fixed;
*   }
*/
import { elasticOut } from 'svelte/easing';

const USE_TICK_WORKAROUND = true

function slideFixed(node, {
  duration = 1000
}) {
  const width = node.offsetWidth;
  console.debug( "slideFixed initiated:", { width, node })

  // NOTE: In Svelte (3.31.2) the 'css' return DOES NOT CAUSE the 'aside' to move.
  //    The 'tick' below does (but is jerky since it's not optimized for animations). #svelte
  //
  //    tbd. research and file as Svelte web component bug (or find existing bug report and ref here) #help
  //
  const o = !USE_TICK_WORKAROUND ? {
    css: t => {   // DOES NOT CAUSE ANIMATION
      //console.log("Animation:", { '_': (t-1)*width, width, t })
      return `right: ${(t - 1) * width}px`
    }
  } : {
    tick: t => {  // jer..ky
      node.style.right = `${ (t-1)*width }px`   // 👍🥴
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