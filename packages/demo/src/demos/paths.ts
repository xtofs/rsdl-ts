import { BuiltInType, Model, ModelElement, Structural } from "@rsdl-ts/rsdl";
import { getSalesModel } from "./sampleModels";

export function main() {
  const model = getSalesModel();

  for (const path of model.paths()) {
    console.log(path.toString());
  }
}
