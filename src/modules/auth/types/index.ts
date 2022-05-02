export interface JwtPayload {
  email: string;
  sub: string;
}

export interface JwtPayloadWithRt extends JwtPayload {
  refreshToken: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}
