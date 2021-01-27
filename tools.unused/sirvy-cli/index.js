/*
* tools/sirvy-cli/index.js
*
* Adaptation of 'sirv-cli' source, by Luke Edwards.
*
*   Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (https://lukeed.com)
*   MIT licensed
*
* Modifications:
*   - string replacement (in '@local/sirvy'); needed this to inject Firebase access values into served plain HTML
*   - force port: if requested port is already in use, we fail ('sirv-cli' uses another port, and just prints out a notice)
*
* Naturally, the author is pleased if the above can be done in 'sirv' proper, but needed this ASAP.
*/

// Since I (blame-on-me!!!) made 'sirvy' ESM, also this one needs to be. :S

//import sirv from '@local/sirvy';    // "cannot find package ..."
import sirv from '../sirvy/index.js';

import colors from 'kleur';
//const semiver = require('semiver');
import { resolve } from 'path';
import { readFileSync } from 'fs';
import laccess from 'local-access';
import clear from 'console-clear';    // does THIS have the secretish '--no-clear'?? nope. Where does it come from? tbd.
import tinydate from 'tinydate';
import toPort from 'get-port';

const PAD = '  ';
const { HOST, PORT } = process.env;
const stamp = tinydate('{HH}:{mm}:{ss}');

function toTime() {
  return '[' + colors.magenta(stamp()) + '] ';
}

function toMS(arr) {
  return colors.white().bold(`${(arr[1] / 1e6).toFixed(2)}ms`);
}

function toCode(code) {
  let fn = code >= 400 ? 'red' : code > 300 ? 'yellow' : 'green';
  return colors[fn](code);
}

function exit(msg) {
  process.stderr.write('\n' + PAD + colors.red().bold('ERROR: ') + msg + '\n\n');
  process.exit(1);
}

async function boot (dir, opts) {
  dir = resolve(dir || '.');
  opts.maxAge = opts.m;

  if (opts.cors) {
    opts.setHeaders = res => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Range');
    }
  }

  let server;
  let fn = sirv(dir, opts);   // note: seems 'sirv' handles the undocumented '--no-clear' within it? (should really be the CLI)
  let { hrtime, stdout } = process;
  let isLog = opts.logs !== false;

  if (opts.http2) {
    /***
    // We have '>= 10', by the 'engine.node' so this test is unnecessary
    if (semiver(process.version.substring(1), '8.4.0') < 0) {
      return exit('HTTP/2 requires Node v8.4.0 or greater');
    }***/

    if (!opts.key || !opts.cert) {
      return exit('HTTP/2 requires "key" and "cert" values');
    }

    opts.allowHTTP1 = true; // grace
    opts.key = readFileSync(opts.key);
    opts.cert = readFileSync(opts.cert);
    if (opts.cacert) opts.cacert = readFileSync(opts.cacert);
    if (opts.pass) opts.passphrase = opts.pass;

    server = (await import('http2')).createSecureServer(opts, fn);
  } else {
    server = (await import('http')).createServer(fn);
  }

  if (isLog && !opts.quiet) {
    let uri, dur, start, dash=colors.gray(' ─ ');
    server.on('request', (req, res) => {
      start = hrtime();
      req.once('end', _ => {
        dur = hrtime(start);
        uri = req.originalUrl || req.url;
        stdout.write(PAD + toTime() + toCode(res.statusCode) + dash + toMS(dur) + dash + uri + '\n');
      });
    });
  }

  const wantedPort = PORT || opts.port;
  const hostname = HOST || opts.host || '0.0.0.0';

  const port = opts.forceportX ? wantedPort : await toPort({ host: hostname, port: wantedPort });

  ;(() => {    // to keep indentation as it was (least git diff)
    let isOther = port !== wantedPort;
    let https = opts.http2 || !!opts.ssl; // TODO
    // 'sirv' code has misleading code (that doesn't affect anything): 'listeningListener' has no parameters
    server.listen(port, hostname, () /*was: err*/ => {    // "callback to be executed once the listener has been added"
      /* if (err) {
        throw err;
      } */
      if (opts.quiet) return;
      if (opts.clear !== false) clear(true);
      let { local, network } = laccess({ port, hostname, https });
      stdout.write('\n' + PAD + colors.green('Your application is ready~! 🚀\n\n'));
      isOther && stdout.write(PAD + colors.italic().dim(`➡ Port ${wantedPort} is taken; using ${port} instead\n\n`));
      stdout.write(PAD + `${colors.bold('- Local:')}      ${local}\n`);
      stdout.write(PAD + `${colors.bold('- Network:')}    ${/localhost/i.test(hostname) ? colors.dim('Add `--host` to expose') : network}\n\n`);
      let border = '─'.repeat(Math.min(stdout.columns, 36) / 2);
      if (isLog) stdout.write(border + colors.inverse(' LOGS ') + border + '\n\n');
    })
    .once( "error", (err) => {
      if (err.code === 'EADDRINUSE') {
        server.close(() => {
          exit(`Port ${wantedPort} is already in use.`);
        });
      } else {
        throw err;
      }
    });
  })();
}

export default boot;

