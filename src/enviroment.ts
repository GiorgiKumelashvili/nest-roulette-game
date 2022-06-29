import { config } from 'dotenv';

config();

export const environment = {
  port: parseInt(process.env.PORT || '3000'),
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiration: Number(process.env.ACCESS_TOKEN_EXPIRATION || 60),
};
