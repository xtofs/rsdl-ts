import {
  BuiltInType,
  Cardinality,
  EnumMember,
  EnumType,
  GetCapability,
  Model,
  ModelCapability,
  PatchCapability,
  Permission,
  Property,
  ref,
  Service,
  ServiceCapability,
  StructuredType,
} from "@rsdl-ts/rsdl";

export function getModel01() {
  return new Model(
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
      new ModelCapability("OrderItem", {}, new PatchCapability()),
      new ModelCapability(
        "Order::items",
        {
          cardinality: Cardinality.Multiple,
        },
        new GetCapability(),
      ),
      new ServiceCapability(
        "/orders/{id}/items/{id}/product",
        {},
        new PatchCapability(true, false, [
          new Permission("scheme", [{ scope: "read" }]),
        ]),
      ),
    ],
  );
}
