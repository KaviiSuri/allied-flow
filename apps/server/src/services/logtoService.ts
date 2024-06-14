import { LogtoExpressConfig } from '@logto/express';

export const logtoServiceConfig: LogtoExpressConfig = {
  appId: '<your-application-id>',
  appSecret: '<your-application-secret>',
  endpoint: '<your-logto-endpoint>', // E.g. http://localhost:3001
  baseUrl: '<your-express-app-base-url>', // E.g. http://localhost:3000
};


