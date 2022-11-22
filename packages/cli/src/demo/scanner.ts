import fs from "fs";
import * as rsdl from "@rsdl-ts/rsdl";
import { any, escapeControlChars, expect, many, ModelWriter, parseModel, Permission, Token } from "@rsdl-ts/rsdl";

export function main() {
  const text = fs.readFileSync("./example.rsdl", { encoding: "utf8" });

  // const arr = [...rsdl.scan(tokens)];
  // console.log(arr.map((t) => t.position + t.value).join(""));
  for (var token of rsdl.scan(text, true)) {
    const k = token.kind.padEnd(12);
    const p = token.position.toString().padEnd(4);
    const v = escapeControlChars(token.value);
    console.log(`${k} ${p}: '${v}'`);
  }
}
