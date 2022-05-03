export interface JwtPayload {
  email: string;
  sub: string;
}

export interface JwtPayloadWithRt extends JwtPayload {
  refreshToken: string;
}

export interface AtToken {
  accessToken: string;
}

export interface RtToken {
  refreshToken: string;
}

export type Tokens = AtToken & RtToken;
