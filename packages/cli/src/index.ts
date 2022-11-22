#!/usr/bin/env node

import * as scanner from "./demo/scanner";
import * as parser from "./demo/parser";
import * as writer from "./demo/writer";

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log("missing demo name");
  process.exit(0);
}
switch (args[0]) {
  case "scanner":
    scanner.main();
    break;
  case "parser":
    parser.main();
    break;
  case "writer":
    writer.main();
    break;

  default:
    console.log(`no demo named '${args}'`);
}
