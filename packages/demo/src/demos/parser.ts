import * as rsdl from "@rsdl-ts/rsdl";
import { any, escapeControlChars, expect, many, ModelWriter, parseModel, Permission, Token } from "@rsdl-ts/rsdl";

// ################### parsing tests

export function testParse(tokens: Token[]): rsdl.ParseResult<Token[]> {
  const parse = many(expect("ident"));
  return parse(tokens);
}

function show<T>(items: T[], f: (t: T) => string) {
  return "[" + items.map(f).join(", ") + "]";
}

export function main() {
  const text = "hello world 1234.";
  const tokens = [...rsdl.scan(text, true)];
  console.log(
    "tokens    =",
    show(tokens, (t) => t.value)
  );
  const res = testParse(tokens);
  if (res.kind == rsdl.ResultKind.Success) {
    console.log(
      "result    =",
      show(res.value.result, (t) => t.value)
    );

    console.log(
      "remainder =",
      show(res.value.remainder, (t) => t.value)
    );
  }
}
