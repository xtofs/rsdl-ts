import {
  BuiltInType,
  Model,
  ModelElement,
  paths,
  Structural,
} from "@rsdl-ts/rsdl";
import { getSalesModel } from "./sampleModels";

export function main() {
  const model = getSalesModel();

  for (const path of paths(model)) {
    console.log(path.toString());
  }
}
