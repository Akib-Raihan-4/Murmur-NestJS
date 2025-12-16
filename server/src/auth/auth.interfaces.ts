export interface IJwtPayload {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}

export interface ISignupResponseData {
  access_token: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}