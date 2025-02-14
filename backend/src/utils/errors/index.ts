export class HistoryError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.name = "HistoryError";
    this.status = 401;
  }
}

export class MediaError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.name = "MediaError";
    this.status = 401;
  }
}

export class PictoryTokenError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.name = "PictoryTokenError";
    this.status = 401;
  }
}

export class RequestBodyError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.name = "RequestBodyError";
    this.status = 401;
  }
}

export class RequestURLError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.name = "RequestURLError";
    this.status = 401;
  }
}
