export enum ResultKind {
  Success = "Success",
  Failure = "Failure",
}

export interface Success<T> {
  kind: typeof ResultKind.Success;
  value: T;
}

export interface Failure<E> {
  kind: typeof ResultKind.Failure;
  error: E;
}

export type Result<T, E> =
  | Success<T>
  | Failure<E>;

// export const Failure = <E>(value: E): Failure<E> => ({
//   type: ResultKind.Failure,
//   value,
// });

export function Failure<E>(error: E): Failure<E> {
  return {
    kind: ResultKind.Failure,
    error,
  };
}

export const Success = <T>(value: T): Success<T> => ({
  kind: ResultKind.Success,
  value,
});
