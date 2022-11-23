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
  Service,
  ServiceCapability,
  StructuredType,
} from "@rsdl-ts/rsdl";

export function getSalesModel() {
  return new Model(
    new Service("service", [
      new Property("products", "Product", { collection: true }),
      new Property("orders", "Order", { collection: true }),
      new Property("categories", "Category", { collection: true }),
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
        new Property("category", "Category"),
      ]),
      new StructuredType("OrderItem", [
        new Property("id", BuiltInType.Integer, { key: true }),
        new Property("amount", BuiltInType.Integer),
        new Property("product", "Product"),
      ]),
      new StructuredType("Order", [
        new Property("id", BuiltInType.Integer, { key: true }),
        new Property("items", "OrderItem", { collection: true }),
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
