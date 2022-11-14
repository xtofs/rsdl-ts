import { ModelPath, ServicePath } from "./paths"

export class Model {
  constructor(
    public service: Service,
    public elements: ModelElement[],
    public capabilities: Capability[] = [],
  ) {
  }
}

export class Service {
  constructor(public alias: string, public properties: Property[]) {
  }
}

export type ModelElement = StructuredType | EnumType;

export class StructuredType {
  public kind: "struct" = "struct";
  constructor(public name: string, public properties: Property[]) {
  }
}

export function ref(name: string): TypeRef {
  return new TypeRef(name);
}

export class TypeRef {
  constructor(public ref: string) {}

  public resolve(model: Model): Type | undefined {
    const builtin = BuiltInType.find(this.ref);
    if (builtin) return builtin;

    const me = model.elements.find((e) => e.name == this.ref);
    if (me != null) return me;
  }
}

export interface PropertyAttributes {
  key: boolean;
  collection: boolean;
}

export class Property {
  constructor(
    public name: string,
    public type: TypeRef,
    opts?: Partial<PropertyAttributes>,
  ) {
    this.attributes = {
      collection: opts?.collection ?? false,
      key: opts?.key ?? false,
    };
  }

  public attributes: PropertyAttributes;
}

export type Type = StructuredType | EnumType | BuiltInType;

export class BuiltInType {
  public kind: "builtin" = "builtin";
  constructor(public name: string) {}

  public static find(typeName: string): BuiltInType {
    return BUILTINS[typeName];
  }

  public static Integer: TypeRef = new TypeRef("Integer");
  public static String: TypeRef = new TypeRef("String");
}

const BUILTINS: { [name: string]: BuiltInType } = {
  String: new BuiltInType("String"),
  Integer: new BuiltInType("Integer"),
};

export class EnumType {
  public kind: "enum" = "enum";
  constructor(public name: string, public members: EnumMember[]) {
  }
}

export class EnumMember {
  constructor(
    public name: string,
    public value?: number,
  ) {}
}

export type Capability = ModelCapability | ServiceCapability;

export enum Cardinality {
  Single,
  Multiple,
}

interface CapabilityOpts {
  cardinality: Cardinality;
}

export class ModelCapability {
  public kind: "model" = "model";
  constructor(
    public modelPath: ModelPath,
    public opts: Partial<CapabilityOpts> = {},
    public capability: CapabilityTerm,
  ) {}
}

export class ServiceCapability {
  public kind: "service" = "service";
  constructor(
    public servicePath: ServicePath,
    public opts: Partial<CapabilityOpts> = {},
    public capability: CapabilityTerm,
  ) {}
}
export type CapabilityTerm = PatchCapability;

export class PatchCapability {
  public verb: "PATCH" = "PATCH";
}
