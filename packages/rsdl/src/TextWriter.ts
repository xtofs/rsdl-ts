import stream from "stream";

export class TextWriter {
  constructor(
    public writer: stream.Writable,
    public encoder: TextEncoder = new TextEncoder(),
  ) {}

  public write(string: string) {
    this.writer.write(this.encoder.encode(string));
  }
}
