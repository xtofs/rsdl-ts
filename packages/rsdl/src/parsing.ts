import { Model, Service } from "./model";
import { Result, ResultKind, Success } from "./results";

const TOKEN_KIND = ["ident", "whitespace", "number", "symbol"] as const;
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

export function parseModel(_tokens: Token[]): Result<[Model, Token[]], Error> {
  return Success([new Model(new Service("?", []), []), []]);
}
