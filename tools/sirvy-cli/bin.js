#!/usr/bin/env node

//const sade = require('sade');
//const pkg = require('./package');
import sade from 'sade';

// Note: reading JSON with ESM requires 'top level await' or (worse) experimental flags.
//import pkg from './package.json';

// Note: While 'require' and 'import' read the package's directory, 'readFile*' reads the project directory (with './')
//
// See async version (would need top level async for us) -> https://stackoverflow.com/a/65605311/14455
//
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const pkg = JSON.parse( readFileSync( path.join( path.dirname( fileURLToPath(import.meta.url) ), 'package.json' ), 'utf-8'));

//const boot = require('./index.js');
import boot from './index.js'

sade('sirvy [dir]')
	.version(pkg.version)
	.describe('Run a static file server')
		.example('build --cors --port 8080')
		.example('public --quiet --etag --maxage 31536000 --immutable')
		.example('public --http2 --key priv.pem --cert cert.pem')
		.example('public -qeim 31536000')
		.example('--port 8080 --etag')
		.example('--host --dev')
	.option('-D, --dev', 'Enable "dev" mode')
	.option('-e, --etag', 'Enable "ETag" header')
	.option('-d, --dotfiles', 'Enable dotfile asset requests')
	.option('-c, --cors', 'Enable "CORS" headers to allow any origin requestor')
	.option('-G, --gzip', 'Send precompiled "*.gz" files when "gzip" is supported', true)
	.option('-B, --brotli', 'Send precompiled "*.br" files when "brotli" is supported', true)
	.option('-m, --maxage', 'Enable "Cache-Control" header & define its "max-age" value (sec)')
	.option('-i, --immutable', 'Enable the "immutable" directive for "Cache-Control" header')
	.option('-k, --http2', 'Enable the HTTP/2 protocol. Requires Node.js 8.4.0+')
	.option('-C, --cert', 'Path to certificate file for HTTP/2 server')
	.option('-K, --key', 'Path to certificate key for HTTP/2 server')
	.option('-P, --pass', 'Passphrase to decrypt a certificate key')
	.option('-s, --single', 'Serve as single-page application with "index.html" fallback')
	.option('-I, --ignores', 'Any URL pattern(s) to ignore "index.html" assumptions')
	.option('-q, --quiet', 'Disable logging to terminal')
	.option('-H, --host', 'Hostname to bind', 'localhost')
	.option('-p, --port', 'Port to bind', 5000)
  .option('--forceportX', 'Port to bind (no fallback)')
	.action(boot)
	.parse(process.argv);