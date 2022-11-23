import { stringify } from "querystring";
import { Capability } from "./capabilities";
import { enumeratePaths, Path } from "./urls";

export class Model {
  constructor(
    public service: Service,
    public elements: ModelElement[],
    public capabilities: Capability[] = [],
  ) {}

  *paths(): Generator<Path> {
    yield* enumeratePaths([], this.service, this);
  }
}

/** structural elements of a model i.e. elements with properties */
export type Structural = StructuredType | Service;

export class Service {
  public kind: "service" = "service";
  constructor(public alias: string, public properties: Property[]) {}
}

export type ModelElement = StructuredType | EnumType;

export class StructuredType {
  public kind: "struct" = "struct";
  constructor(public name: string, public properties: Property[]) {}
}

// export function ref(name: string): TypeRef {
//   return name;
// }

export type TypeRef = string;
// export class TypeRef {
//   constructor(public ref: string) {}

//   public resolve(model: Model): Type | undefined {
//     const builtin = BuiltInType.find(this.ref);
//     if (builtin) return builtin;

//     const me = model.elements.find((e) => e.name == this.ref);
//     if (me != null) return me;
//   }
// }

export interface PropertyAttributes {
  key: boolean;
  collection: boolean;
}

export class Property {
  public isCollection: boolean;
  public isKey: boolean;

  constructor(
    public name: string,
    public type: TypeRef,
    opts?: Partial<PropertyAttributes>,
  ) {
    // this.attributes = {
    //   collection: opts?.collection ?? false,
    //   key: opts?.key ?? false,
    // };
    this.isCollection = opts?.collection ?? false;
    this.isKey = opts?.key ?? false;
  }
}

export type Type = StructuredType | EnumType | BuiltInType;

export class BuiltInType {
  public kind: "builtin" = "builtin";
  constructor(public name: string) {}

  public static find(typeName: string): BuiltInType {
    return BUILTINS[typeName];
  }

  public static isBuiltIn(typeName: string): boolean {
    return BUILTINS[typeName] !== undefined;
  }

  public static Integer: TypeRef = "Integer";
  public static String: TypeRef = "String";
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
