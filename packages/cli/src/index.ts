#!/usr/bin/env node
import fs from "fs";
import { Failure, Result, ResultKind, scan, Success } from "@rsdl-ts/rsdl";

// import * as rsdl from "@rsdl-ts/rsdl";
// // import { Failure, Result, ResultKind, Success } from "./results.ts";
// import { ModelPath, ServicePath } from "./paths.ts";
// // import { ModelWriter } from "./ModelWriter.ts";
// // import { scan } from "./parsing.ts";

// const model = new rsdl.Model(
//   new rsdl.Service("service", [
//     new rsdl.Property("products", rsdl.ref("Product"), { collection: true }),
//     new rsdl.Property("orders", rsdl.ref("Order"), { collection: true }),
//   ]),
//   [
//     new rsdl.EnumType("Color", [
//       new rsdl.EnumMember("red", 1),
//       new rsdl.EnumMember("blue", 2),
//     ]),
//     new rsdl.StructuredType("Category", [
//       new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }),
//       new rsdl.Property("name", rsdl.BuiltInType.String),
//     ]),
//     new rsdl.StructuredType("Product", [
//       new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }),
//       new rsdl.Property("name", rsdl.BuiltInType.String),
//       new rsdl.Property("category", rsdl.ref("Category")),
//     ]),
//     new rsdl.StructuredType("OrderItem", [
//       new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }),
//       new rsdl.Property("amount", rsdl.BuiltInType.Integer),
//       new rsdl.Property("product", rsdl.ref("Product")),
//     ]),
//     new rsdl.StructuredType("Order", [
//       new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }),
//       new rsdl.Property("items", rsdl.ref("OrderItem"), { collection: true }),
//     ]),
//   ],
//   [
//     new rsdl.ModelCapability(
//       new ModelPath("OrderItem"),
//       {},
//       new rsdl.PatchCapability(),
//     ),
//     new rsdl.ModelCapability(new ModelPath("Order::items"), {
//       cardinality: rsdl.Cardinality.Multiple,
//     }, new rsdl.PatchCapability()),
//     new rsdl.ServiceCapability(
//       new ServicePath("/orders/{id}/items/{id}/product"),
//       {},
//       new rsdl.PatchCapability(),
//     ),
//   ],
// );

// // ModelWriter.writeToStdout(model);
// ModelWriter.writeToFile(model, "example.rsdl");

const text = fs.readFileSync("./example.rsdl", { encoding: "utf8" });
const tokens = [...scan(text)];
// console.log(tokens.length);
console.log(tokens.map((t) => t.position + t.value).join(""));

const a = Failure(2);
_test(a);
const b = Success("2");
_test(b);

function _test<A, B>(x: Result<A, B>) {
  switch (x.kind) {
    case ResultKind.Failure:
      return `failure ${x.error}`;
    case ResultKind.Success:
      return `Success ${x.value}`;
  }
}
