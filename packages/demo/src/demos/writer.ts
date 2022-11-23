import { ModelWriter } from "@rsdl-ts/rsdl";
import { getSalesModel } from "./samples";

// ################### writer
export function main() {
  const model = getSalesModel();

  ModelWriter.writeToStdout(model);
  ModelWriter.writeToFile(model, "example.rsdl");
}
