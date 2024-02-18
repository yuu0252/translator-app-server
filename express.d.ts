declare module 'express' {
  interface Request {
    user?: any; // 任意の型に変更するか、必要に応じて
  }
}
