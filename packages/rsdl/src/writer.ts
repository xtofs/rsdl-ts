import process from "process";
import fs from "fs";
import { Capability, EnumType, Model, ModelCapability, Property, Service, ServiceCapability, StructuredType } from "./model";

export const red = "\x1b[31m";
export const cls = "\x1b[0m";

export class ModelWriter {
  static writeToFile(model: Model, path: string) {
    // https://nodejs.org/api/fs.html#fscreatewritestreampath-options
    const f: fs.WriteStream = fs.createWriteStream(path, {
      flags: "w",
    });
    const w = new ModelWriter(new TextWriter(f), false);
    w.writeModel(model);
  }

  static writeToStdout(model: Model, color = true) {
    const f = process.stdout;
    const w = new ModelWriter(new TextWriter(f), color);
    w.writeModel(model);
  }

  constructor(public writer: TextWriter, public color: boolean = false) {}

  private kw(str: string): string {
    return this.color ? `${red}${str}${cls}` : str;
  }

  public writeModel(model: Model) {
    for (const element of model.elements) {
      if (element.kind == "enum") {
        this.writeEnum(element);
      } else if (element.kind == "struct") {
        this.writeStruct(element);
      } else {
        // never
        // this.writer.write(`element = ${element.name}\n`);
      }
    }
    this.writeService(model.service);
    this.writeCapabilities(model.capabilities);
  }
  writeCapabilities(capabilities: Capability[]) {
    this.writer.write(`${this.kw("capabilities")} {\n`);
    for (const capability of capabilities) {
      if (capability.kind == "model") {
        this.writeModelCapability(capability);
      } else if (capability.kind == "service") {
        this.writeServiceCapability(capability);
      } else {
        const _: never = capability;
      }
    }
    this.writer.write(`}\n`);
  }
  writeModelCapability(capability: ModelCapability) {
    this.writer.write(`   ${capability.modelPath} { GET }\n`);
  }
  writeServiceCapability(capability: ServiceCapability) {
    this.writer.write(`   ${capability.servicePath} { ${capability.capability.method} }\n`);
  }

  private writeEnum(enumType: EnumType) {
    this.writer.write(`${this.kw("enum")} ${enumType.name} {\n`);
    for (const element of enumType.members) {
      this.writer.write(`    ${element.name}\n`);
    }
    this.writer.write(`}\n\n`);
  }

  private writeStruct(struct: StructuredType) {
    this.writer.write(`${this.kw("type")} ${struct.name} {\n`);
    for (const property of struct.properties) {
      this.writeProperty(property);
      //   this.writer.write(`    ${element.name}: ${element.type.ref}: \n`);
    }
    this.writer.write(`}\n\n`);
  }

  private writeProperty(property: Property) {
    const isKey = property.attributes.key ? `${this.kw("key")} ` : "";
    const typeName = property.attributes.collection ? `[${property.type.ref}]` : property.type.ref;
    this.writer.write(`    ${isKey}${property.name}: ${typeName}\n`);
  }

  private writeService(service: Service) {
    this.writer.write(`${this.kw("service")} ${service.alias} {\n`);
    for (const property of service.properties) {
      this.writeProperty(property);
    }
    this.writer.write(`}\n\n`);
  }
}

// #####################################

import stream from "stream";

class TextWriter {
  constructor(public writer: stream.Writable, public encoder: TextEncoder = new TextEncoder()) {}

  public write(string: string) {
    this.writer.write(this.encoder.encode(string));
  }
}
