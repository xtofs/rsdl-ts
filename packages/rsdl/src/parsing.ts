import { Model, Service } from "./model";
import { Failure, Result, ResultKind, Success } from "./results";

const TOKEN_KIND = ["whitespace", "ident", "number", "symbol"] as const;
const regex = /(\s+)|([a-zA-Z][\w]*)|([0-9]+)|([,.:{}()\[\]/])/y;

export type TokenKind = typeof TOKEN_KIND[number];

export type Token = { kind: TokenKind; value: string; position: number };

export function* scan(
  input: string,
  skipWhitespace = false,
): Generator<Token, string> {
  if (!regex.sticky) throw new Error("not sticky");

  let match: RegExpExecArray | null;
  let position = 0;
  while ((match = regex.exec(input)) !== null) {
    const value = match[0];
    const ix = match.indexOf(value, 1) - 1;
    const kind = TOKEN_KIND[ix];
    if (kind == "whitespace" && skipWhitespace) {
      /* skip */
    } else {
      yield { kind, value, position };
    }
    position = regex.lastIndex;
  }
  return input.slice(position);
}

export function escapeControlChars(str: string): string {
  // https://unicode-table.com/en/blocks/control-pictures/
  let res = "";
  for (let index = 0; index < str.length; index++) {
    const code = str.charCodeAt(index);
    res += String.fromCharCode(code <= 33 ? code + 0x2400 : code);
  }
  return res;
}

export function parse(text: string): Model {
  const tokens = [...scan(text)];

  const res = parseModel(tokens);
  switch (res.kind) {
    case ResultKind.Failure:
      throw new Error(res.error.toString());
    case ResultKind.Success:
      // TODO ensure remainder is empty
      return res.value.result;
  }
}

export type ParseResult<T> = Result<{ result: T; remainder: Token[] }, Error>;
export type Parser<T> = (tokens: Token[]) => ParseResult<T>;

export function ok<T>(result: T, remainder: Token[]): ParseResult<T> {
  return Success({ result, remainder });
}

export function err(error: string) {
  return Failure(new Error(error));
}

export function expect(kind: TokenKind): Parser<Token> {
  return (tokens: Token[]) => {
    if (tokens.length > 0 && tokens[0].kind == kind) {
      return ok(tokens[0], tokens.slice(1));
    } else {
      return err(`expected ${kind}`);
    }
  };
}

export function any(): Parser<Token> {
  return (tokens: Token[]) => {
    if (tokens.length > 0) {
      return ok(tokens[0], tokens.slice(1));
    } else {
      return err(`expected any, found end of input`);
    }
  };
}

export function many<T>(parser: Parser<T>): Parser<T[]> {
  return (tokens) => {
    let res: T[] = [];
    while (true) {
      var item = parser(tokens);
      if (item.kind == ResultKind.Failure) break;
      res.push(item.value.result);
      tokens = item.value.remainder;
    }
    return ok(res, tokens);
  };
}

export function parseModel(tokens: Token[]): ParseResult<Model> {
  return ok(new Model(new Service("?", []), []), tokens);
}
