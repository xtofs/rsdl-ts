import * as rsdl from "@rsdl-ts/rsdl";
import { ModelWriter, Permission } from "@rsdl-ts/rsdl";

// ################### writer
export function main() {
  const model = new rsdl.Model(
    new rsdl.Service("service", [new rsdl.Property("products", rsdl.ref("Product"), { collection: true }), new rsdl.Property("orders", rsdl.ref("Order"), { collection: true })]),
    [
      new rsdl.EnumType("Color", [new rsdl.EnumMember("red", 1), new rsdl.EnumMember("blue", 2)]),
      new rsdl.StructuredType("Category", [new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }), new rsdl.Property("name", rsdl.BuiltInType.String)]),
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
      new rsdl.StructuredType("Order", [new rsdl.Property("id", rsdl.BuiltInType.Integer, { key: true }), new rsdl.Property("items", rsdl.ref("OrderItem"), { collection: true })]),
    ],
    [
      new rsdl.ModelCapability("OrderItem", {}, new rsdl.PatchCapability()),
      new rsdl.ModelCapability(
        "Order::items",
        {
          cardinality: rsdl.Cardinality.Multiple,
        },
        new rsdl.GetCapability()
      ),
      new rsdl.ServiceCapability("/orders/{id}/items/{id}/product", {}, new rsdl.PatchCapability(true, false, [new Permission("scheme", [{ scope: "read" }])])),
    ]
  );

  ModelWriter.writeToStdout(model);
  ModelWriter.writeToFile(model, "example.rsdl");
}
