import { ModelPath, ServicePath } from "./paths";

// ########################################################
// capabilities

export type Capability = ModelCapability | ServiceCapability;

export enum Multiplicity {
  Single,
  Multiple,
}
interface CapabilityOpts {
  multiplicity: Multiplicity;
}

export class ModelCapability {
  public kind: "model" = "model";
  public modelPath: ModelPath;

  constructor(
    modelPath: string | ModelPath,
    opts: Partial<CapabilityOpts> = {},
    capability: CapabilityBase,
  ) {
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
  constructor(
    servicePath: string | ServicePath,
    public opts: Partial<CapabilityOpts> = {},
    public capability: CapabilityBase,
  ) {
    if (typeof servicePath === "string") {
      this.servicePath = new ServicePath(servicePath);
    } else {
      this.servicePath = servicePath;
    }
  }
}

export type CapabilityBase =
  | GetCapability
  | PatchCapability
  | PostCapability
  | DeleteCapability;

export class PatchCapability {
  public method: "PATCH" = "PATCH";

  constructor(
    public updatable: boolean = true,
    public upsertable: boolean = false,
    public permissions: Permission[] = [],
  ) {}
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
    this.properties = typeof properties === "string"
      ? new PropertyRestriction(properties)
      : properties;
  }
}
class PropertyRestriction {
  readonly properties: PropertyInclusion[];
  constructor(properties?: string) {
    this.properties = parsePropertyInclusions(properties);
  }
}
type PropertyInclusion =
  | PropertyInclusionAll
  | PropertyInclusionInclude
  | PropertyInclusionExclude;
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
function parsePropertyInclusions(
  properties: string | undefined,
): PropertyInclusion[] {
  return properties === undefined || properties === ""
    ? [{ kind: "all" }]
    : [...properties.split(",").map(parsePropertyInclusion)];
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
