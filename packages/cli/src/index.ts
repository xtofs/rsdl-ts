#!/usr/bin/env node
import fs from "fs";
import * as rsdl from "@rsdl-ts/rsdl";
import {
  any,
  escapeControlChars,
  expect,
  many,
  ModelWriter,
  parseModel,
  Permission,
  Token,
} from "@rsdl-ts/rsdl";

// demoWriter();
// demoScanner();

// ################### parsing tests

export function test2(tokens: Token[]): rsdl.ParseResult<Token[]> {
  const parse = many(expect("ident"));
  return parse(tokens);
}
function show<T>(items: T[], f: (t: T) => string) {
  return "[" + items.map(f).join(", ") + "]";
}

const text = "hello world 1234.";
const tokens = [...rsdl.scan(text, true)];
console.log("tokens    =", show(tokens, (t) => t.value));
const res = test2(tokens);
if (res.kind == rsdl.ResultKind.Success) {
  console.log(
    "result    =",
    show(res.value.result, (t) => t.value),
  );

  console.log(
    "remainder =",
    show(res.value.remainder, (t) => t.value),
  );
}

// ################### writer
function demoWriter() {
  const model = new rsdl.Model(
    new rsdl.Service("service", [
      new rsdl.Property("products", rsdl.ref("Product"), { collection: true }),
      new rsdl.Property("orders", rsdl.ref("Order"), { collection: true }),
    ]),
    [
      new rsdl.EnumType("Color", [
        new rsdl.EnumMember("red", 1),
        new rsdl.EnumMember("blue", 2),
      ]),
      new rsdl.StructuredType("Category", [
        new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }),
        new rsdl.Property("name", rsdl.BuiltInType.String),
      ]),
      new rsdl.StructuredType("Product", [
        new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }),
        new rsdl.Property("name", rsdl.BuiltInType.String),
        new rsdl.Property("category", rsdl.ref("Category")),
      ]),
      new rsdl.StructuredType("OrderItem", [
        new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }),
        new rsdl.Property("amount", rsdl.BuiltInType.Integer),
        new rsdl.Property("product", rsdl.ref("Product")),
      ]),
      new rsdl.StructuredType("Order", [
        new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }),
        new rsdl.Property("items", rsdl.ref("OrderItem"), { collection: true }),
      ]),
    ],
    [
      new rsdl.ModelCapability("OrderItem", {}, new rsdl.PatchCapability()),
      new rsdl.ModelCapability(
        "Order::items",
        {
          cardinality: rsdl.Cardinality.Multiple,
        },
        new rsdl.GetCapability(),
      ),
      new rsdl.ServiceCapability(
        "/orders/{id}/items/{id}/product",
        {},
        new rsdl.PatchCapability(true, false, [
          new Permission("scheme", [{ scope: "read" }]),
        ]),
      ),
    ],
  );

  ModelWriter.writeToStdout(model);
  ModelWriter.writeToFile(model, "example.rsdl");
}

// ################### scanner
function demoScanner() {
  const text = fs.readFileSync("./example.rsdl", { encoding: "utf8" });

  // const arr = [...rsdl.scan(tokens)];
  // console.log(arr.map((t) => t.position + t.value).join(""));
  for (var token of rsdl.scan(text)) {
    const k = token.kind.padEnd(12);
    const p = token.position.toString().padEnd(4);
    const v = escapeControlChars(token.value);
    console.log(`${k} ${p}: '${v}'`);
  }
}
