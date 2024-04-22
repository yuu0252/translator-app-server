import { envsafe, str } from "envsafe";

export const serverEnv = envsafe({
  MONGODB_URL: str(),
  SECRET_KEY: str(),
  TOKEN_SECRET_KEY: str(),
  ORIGIN: str(),
} as const);
