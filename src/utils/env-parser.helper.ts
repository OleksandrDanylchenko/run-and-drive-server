export const isProduction = process.env.STAGE == 'prod';
export const rootCodeFolder =
  process.env.NODE_ENV === 'migration' ? 'src' : 'dist';
