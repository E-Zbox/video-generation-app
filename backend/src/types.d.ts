declare namespace Express {
  export interface Request {
    pictory: {
      accessToken: string;
    };
  }

  export interface Response {
    pictory: {
      accessToken: string;
    };
  }
}
