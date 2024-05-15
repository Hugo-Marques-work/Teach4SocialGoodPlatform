// Constant values
export let defConsts = {    
  // processEnv typecasting
  // String | undefined typecast to String
  processEnv: {
    DB_HOST: process.env.DB_HOST as string,
    DB_USER: process.env.DB_USER as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    DB_NAME: process.env.DB_NAME as string,
    
    AUTH_SECRET: process.env.AUTH_SECRET as string
  },

  // Response status codes
  STATUS_SUCCESS: 200,
  STATUS_BAD_REQUEST: 400,
  STATUS_NO_AUTH: 401,
  STATUS_FORBIDDEN: 403,
  STATUS_NOT_FOUND: 404,
  STATUS_SERVER_ERROR: 500,
}