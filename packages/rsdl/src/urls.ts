import {
  BuiltInType,
  Model,
  ModelElement,
  Property,
  Structural,
} from "./model";

export class Segment {
  constructor(
    public name: string,
    public type: string,
    public isMulti: boolean = false,
  ) {}

  toString(): string {
    return this.name;
  }

  typeAsString(): string {
    return this.isMulti ? `[${this.type}]` : this.type;
  }
}

export class Path {
  constructor(public segments: Segment[]) {}

  toString(): string {
    const last = this.last();
    return this.segments.map((s) => s.toString()).join("/") + ": " +
      last.typeAsString();
  }

  last(): Segment {
    return this.segments[this.segments.length - 1];
  }
}


export function* enumeratePaths(
  prefix: Segment[],
  structural: Structural,
  model: Model,
): Generator<Path> {
  for (const prop of structural.properties) {
    if (BuiltInType.isBuiltIn(prop.type)) {
      continue;
    }
    const type = model.elements.find((e: ModelElement) => e.name === prop.type);
    if (type == undefined) {
      console.error(`unable to resolve type ${prop.type}`);
    } else {
      if (type.kind == "struct") {
        const seg = new Segment(prop.name, prop.type, prop.isCollection);
        const path = [...prefix, seg];
        yield new Path(path);
        if (prop.isCollection) {
          const keys = [...type.properties.filter((p: Property) => p.isKey)];
          if (keys.length == 1) {
            const key = keys[0];
            const keySeg = new Segment(`{${key.name}}`, prop.type, false);
            const keyPath = [...path, keySeg];
            yield new Path(keyPath);
          } else {
            console.error(
              `composite keys are unsupported type=${type.name}: keys=${keys}`,
            );
          }
        }
        yield* enumeratePaths(path, type, model);
      }
    }
  }
}

// class Segment {
//   constructor(
//     public name: string,
//     public type: string,
//     public isMulti: boolean = false,
//   ) {}

//   toString(): string {
//     return this.name;
//   }

//   typeAsString(): string {
//     return this.isMulti ? `[${this.type}]` : this.type;
//   }
// }

// class Path {
//   constructor(public segments: Segment[]) {}

//   toString(): string {
//     const last = this.last();
//     return this.segments.map((s) => s.toString()).join("/") + ": " +
//       last.typeAsString();
//   }

//   last(): Segment {
//     return this.segments[this.segments.length - 1];
//   }
// }

// export function* paths(model: Model): Generator<Path> {
//   yield* enumeratePaths([], model.service, model);
// }

// function* enumeratePaths(
//   prefix: Segment[],
//   structural: Structural,
//   model: Model,
// ): Generator<Path> {
//   for (const prop of structural.properties) {
//     if (BuiltInType.isBuiltIn(prop.type)) {
//       continue;
//     }
//     const type = model.elements.find((e: ModelElement) => e.name === prop.type);
//     if (type == undefined) {
//       console.error(`unable to resolve type ${prop.type}`);
//     } else {
//       if (type.kind == "struct") {
//         const seg = new Segment(prop.name, prop.type, prop.isCollection);
//         const path = [...prefix, seg];
//         yield new Path(path);
//         yield* enumeratePaths(path, type, model);
//       }
//     }
//   }
// }
