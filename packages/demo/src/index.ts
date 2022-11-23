#!/usr/bin/env node

import * as demo from "./demos";

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log("missing demo name");
  process.exit(0);
}
switch (args[0]) {
  case "scanner":
    demo.scanner.main();
    break;
  case "parser":
    demo.parser.main();
    break;
  case "writer":
    demo.writer.main();
    break;
  case "paths":
    demo.paths.main();
    break;
  default:
    console.log(`no demo named '${args}'`);
    console.log(`available demos: ${Object.keys(demo).join(", ")}`);
}
