// // console.log(JSON.stringify(model, null, 2));
// ModelWriter.writeToFile(model, "example.rsdl");
// ModelWriter.writeToStdout(model);

declare global {
  interface String {
    stripPrefix(prefix: string): String;
  }
}
// deno-lint-ignore ban-types
String.prototype.stripPrefix = function (prefix: string): String {
  return this.startsWith(prefix) ? this.slice(prefix.length) : this;
};
export class ServicePath {
  constructor(path: string) {
    // super(path);
    this.segments = path.stripPrefix("/").split("/");
  }

  public segments: string[];

  public toString = (): string => {
    return "/" + this.segments.join("/");
  };
}
export class ModelPath {
  constructor(path: string) {
    // super(path);
    this.segments = path.stripPrefix("::").split("::");
  }

  public segments: string[];

  public toString = (): string => {
    return this.segments.join("::");
  };
}
