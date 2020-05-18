// We tried to use https://deno.land/x/cursor but...
// * CLEAR_SCREEN is "2J" instead of "\u001Bc"
// * the "goTo" function directly writes to stdout :-(
// * ESC is not exposed (used by goTo)

// We'll try to use Deno's node support to load a CJS module from node_modules
// This failes https://github.com/denoland/deno/issues/5442
// That's why we added a --unstable in the start script
import { createRequire } from 'https://deno.land/std/node/module.ts';

const require = createRequire(import.meta.url);

export default require('ansi-escapes');
