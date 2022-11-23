import { ModelWriter } from "@rsdl-ts/rsdl";
import { getModel01 } from "./samples";

// ################### writer
export function main() {
  const model = getModel01();

  ModelWriter.writeToStdout(model);
  ModelWriter.writeToFile(model, "example.rsdl");
}
