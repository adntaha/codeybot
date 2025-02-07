import { readFileSync } from 'fs';

const ENV: string = process.env.NODE_ENV || 'dev';
export const vars: Record<string, string> = JSON.parse(
  readFileSync(`./config/${ENV}/vars.json`, 'utf-8'),
);
