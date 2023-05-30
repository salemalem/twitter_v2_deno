// @ts-ignore
import { Client } from "../deps.ts";
import envVars from "../envvars.ts";

const postgresClient = new Client(envVars.DATABASE_URL);
await postgresClient.connect();

export default postgresClient;