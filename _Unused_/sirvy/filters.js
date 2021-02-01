/*
* sirvy/filters.js
*
* Code involved with content filtering.
*
* Note: Content filtering did not map well to the original Sirv way of caching content. It feels (and is) a side car.
*/
import { readFileSync } from "fs";
import { Readable } from 'stream';

let configFilter;   // undefined | null | Map of <pathname> -> { <key>: <value> }

/*
* Initialize the filtering system
*/
async function initConfig(fn) {

  const mod = await import(fn).catch( err => {
    if (err.code === 'ERR_MODULE_NOT_FOUND') {
      configFilter= null;   // no config file
    } else {
      throw err;
    }
  });
  const { filter } = mod.default;

  const m = new Map(
    Object.entries(filter || {} )
  );

  for( const k in m.keys() ) {
    if (! /^[a-z][a-z0-9_]*$/i.test(k) ) {    // tbd. check this when reading the filters in
      throw new Error(`Unwanted char in filter key (not [a-zA-Z_]): '${k}'`)
    }
  }

  configFilter = m;
}

// Create a regex that - for 'k == "SOME"' - generates a regex that matches '$SOME' and '${SOME}', capturing them
// for replacement.
//
function reGen(k) {
  if (!reCache[k]) {
    reCache[k] = new RegExp("(\\$(?:"+k+"(?!\\w)|\\{"+k+"\\}))", "g");
  }
  return reCache[k];
}

const reCache = {};

(_ => {
  const x = "Try $SOME $SOME2 ${SOME} ${SOME3} me!".replaceAll(reGen("SOME"), 'a');
  if (x !== "Try a $SOME2 a ${SOME3} me!") {
    throw new Error(`reGen failed: ${x}`);
  }
})();

/*
* Check if 'pathname' is among filtered entries, and handle it separately if it is.
*
* Returns:
*   true if the contents got written to 'res'
*   false if not
*/
function sendIfFiltered(req, res, pathname, fnAbs, headers) {

  if (configFilter === undefined) {
    throw new Error("Hack failed: request came too early");
  } else if (!configFilter) {
    return false;   // fast exit - filters not used
  }

  const m = configFilter.get(pathname);
  if (!m) return false;

  // Do the filtering. Note: We read the source into memory. Easier to do filtering that way, and we need the filtered
  // length (that other files get from the cached stats).
  //
  let s = readFileSync(fnAbs, { encoding: "utf8"});

  Object.entries(m).forEach( ([k,v]) => {
    const re = reGen(k);    // either '$SOME' or '${SOME}'
    s = s.replaceAll(re, v);

    console.debug( `After replacing '${k}':`, { s });
  })
  const body = s;

  // Header handling as in 'send'
  //
  const headers2 = { ... headers };
  for (let key in headers2) {
    const tmp = res.getHeader(key);
    if (tmp) headers2[key] = tmp;
  }

  const ct = res.getHeader('content-type');
  if (ct) {
    headers2['Content-Type'] = ct;
  }

  // Replace the length, now after replacements
  //
  headers2['Content-Length'] = body.length;

  res.writeHead(200, headers2);

  // tbd. What is the standard way to write a string to 'res'? 'res.send(body)' did not work.
  //
  const r = Readable.from([body]);
  r.pipe(res);

  return true;
}

export {
  initConfig,
  sendIfFiltered
}
