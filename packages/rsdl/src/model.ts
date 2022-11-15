import { stringify } from "querystring";
import { ModelPath, ServicePath } from "./paths";

export class Model {
  constructor(public service: Service, public elements: ModelElement[], public capabilities: Capability[] = []) {}
}

export class Service {
  constructor(public alias: string, public properties: Property[]) {}
}

export type ModelElement = StructuredType | EnumType;

export class StructuredType {
  public kind: "struct" = "struct";
  constructor(public name: string, public properties: Property[]) {}
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
  constructor(public name: string, public type: TypeRef, opts?: Partial<PropertyAttributes>) {
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
  constructor(public name: string, public members: EnumMember[]) {}
}

export class EnumMember {
  constructor(public name: string, public value?: number) {}
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
  public modelPath: ModelPath;

  constructor(modelPath: string | ModelPath, opts: Partial<CapabilityOpts> = {}, capability: CapabilityBase) {
    if (typeof modelPath === "string") {
      this.modelPath = new ModelPath(modelPath);
    } else {
      this.modelPath = modelPath;
    }
  }
}

export class ServiceCapability {
  public kind: "service" = "service";
  public servicePath: ModelPath;
  constructor(servicePath: string | ServicePath, public opts: Partial<CapabilityOpts> = {}, public capability: CapabilityBase) {
    if (typeof servicePath === "string") {
      this.servicePath = new ServicePath(servicePath);
    } else {
      this.servicePath = servicePath;
    }
  }
}

export type CapabilityBase = GetCapability | PatchCapability | PostCapability | DeleteCapability;

export class PatchCapability {
  public method: "PATCH" = "PATCH";

  constructor(public updatable: boolean = true, public upsertable: boolean = false, public permissions: Permission[] = []) {}
}

export class GetCapability {
  public method: "PATCH" = "PATCH";
}

export class PostCapability {
  public method: "POST" = "POST";
}

export class DeleteCapability {
  public method: "DELETE" = "DELETE";
}

export class Permission {
  constructor(public scheme: string, public scopes: { scope: string }[]) {}
}

// https://github.com/oasis-tcs/odata-vocabularies/blob/main/vocabularies/Org.OData.Capabilities.V1.md#ScopeType
export class Scope {
  public properties: PropertyRestriction;

  constructor(public name: string, properties: PropertyRestriction | string) {
    this.properties = typeof properties === "string" ? new PropertyRestriction(properties) : properties;
  }
}

class PropertyRestriction {
  readonly properties: PropertyInclusion[];
  constructor(properties?: string) {
    this.properties = parsePropertyInclusions(properties);
  }
}

type PropertyInclusion = PropertyInclusionAll | PropertyInclusionInclude | PropertyInclusionExclude;

interface PropertyInclusionAll {
  kind: "all";
}
interface PropertyInclusionInclude {
  kind: "include";
  name: string;
}
interface PropertyInclusionExclude {
  kind: "exclude";
  name: string;
}

function parsePropertyInclusions(properties: string | undefined): PropertyInclusion[] {
  return properties === undefined || properties === "" ? [{ kind: "all" }] : [...properties.split(",").map(parsePropertyInclusion)];
}

function parsePropertyInclusion(property: string): PropertyInclusion {
  if (property == "*") {
    return { kind: "all" };
  }
  if (property.startsWith("-")) {
    return { kind: "exclude", name: property.substring(1) };
  } else {
    return { kind: "include", name: property };
  }
}
