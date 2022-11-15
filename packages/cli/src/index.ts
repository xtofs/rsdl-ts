#!/usr/bin/env node
import fs from "fs";
import {
  BuiltInType,
  Cardinality,
  EnumMember,
  EnumType,
  Failure,
  Model,
  ModelCapability,
  ModelPath,
  ModelWriter,
  PatchCapability,
  Property,
  ref,
  Result,
  ResultKind,
  scan,
  Service,
  ServiceCapability,
  ServicePath,
  StructuredType,
  Success,
} from "@rsdl-ts/rsdl";

demoWriter();

// ################### scanner
function demoWriter() {
  const model = new Model(
    new Service("service", [
      new Property("products", ref("Product"), { collection: true }),
      new Property("orders", ref("Order"), { collection: true }),
    ]),
    [
      new EnumType("Color", [
        new EnumMember("red", 1),
        new EnumMember("blue", 2),
      ]),
      new StructuredType("Category", [
        new Property("id", BuiltInType.Integer, { key: true }),
        new Property("name", BuiltInType.String),
      ]),
      new StructuredType("Product", [
        new Property("id", BuiltInType.Integer, { key: true }),
        new Property("name", BuiltInType.String),
        new Property("category", ref("Category")),
      ]),
      new StructuredType("OrderItem", [
        new Property("id", BuiltInType.Integer, { key: true }),
        new Property("amount", BuiltInType.Integer),
        new Property("product", ref("Product")),
      ]),
      new StructuredType("Order", [
        new Property("id", BuiltInType.Integer, { key: true }),
        new Property("items", ref("OrderItem"), { collection: true }),
      ]),
    ],
    [
      new ModelCapability(
        new ModelPath("OrderItem"),
        {},
        new PatchCapability(),
      ),
      new ModelCapability(new ModelPath("Order::items"), {
        cardinality: Cardinality.Multiple,
      }, new PatchCapability()),
      new ServiceCapability(
        new ServicePath("/orders/{id}/items/{id}/product"),
        {},
        new PatchCapability(),
      ),
    ],
  );

  ModelWriter.writeToStdout(model);
  ModelWriter.writeToFile(model, "example.rsdl");
}

// ################### scanner
function demoScanner() {
  const text = fs.readFileSync("./example.rsdl", { encoding: "utf8" });
  const tokens = [...scan(text)];
  // console.log(tokens.length);
  console.log(tokens.map((t) => t.position + t.value).join(""));
}
