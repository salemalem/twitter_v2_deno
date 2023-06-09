// @ts-ignore
import {
  logger,
  Client
} from "/deps.ts"; 


const postgresClient = new Client(Deno.env.get("DATABASE_URL"));
await postgresClient.connect();

export default postgresClient;