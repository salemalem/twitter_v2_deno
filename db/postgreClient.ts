import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import envVars from "../envvars.ts";

const postgresClient = new Client(envVars.DATABASE_URL);
await postgresClient.connect();

export default postgresClient;