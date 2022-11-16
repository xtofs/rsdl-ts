import { Model, Service } from "./model";
import { Result, ResultKind, Success } from "./results";

const TOKEN_KIND = ["whitespace", "ident", "number", "symbol"] as const;
const regex = /(\s+)|([a-zA-Z][\w]*)|([0-9]+)|([,.:{}()\[\]/])/y;

type TokenKind = typeof TOKEN_KIND[number];

type Token = { kind: TokenKind; value: string; position: number };

export function* scan(input: string): Generator<Token, string> {
  if (!regex.sticky) throw new Error("not sticky");

  let match: RegExpExecArray | null;
  let position = 0;
  while ((match = regex.exec(input)) !== null) {
    const value = match[0];
    const ix = match.indexOf(value, 1) - 1;
    const kind = TOKEN_KIND[ix];
    yield { kind, value, position };
    position = regex.lastIndex;
  }
  return input.slice(position);
}

export function parse(text: string): Model {
  const tokens = [...scan(text)];

  const res = parseModel(tokens);
  switch (res.kind) {
    case ResultKind.Failure:
      throw new Error(res.error.toString());
    case ResultKind.Success:
      // TODO ensure remainder is empty
      return res.value[0];
  }
}

export function escapeControl(str: string): string {
  // https://unicode-table.com/en/blocks/control-pictures/
  let res = "";
  for (let index = 0; index < str.length; index++) {
    const code = str.charCodeAt(index);
    res += String.fromCharCode(code <= 33 ? code + 0x2400 : code);
  }
  return res;
}

export function parseModel(_tokens: Token[]): Result<[Model, Token[]], Error> {
  return Success([new Model(new Service("?", []), []), []]);
}
