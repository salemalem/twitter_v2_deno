// @ts-ignore
import { Client } from "../deps.ts";
import {
  load,
} from "../deps.ts"; 

await load({
  envPath: "./.env",
  export: true,
});

const postgresClient = new Client(Deno.env.get("DATABASE_URL"));
await postgresClient.connect();

export default postgresClient;