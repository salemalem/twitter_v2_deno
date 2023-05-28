import { config } from "https://deno.land/std@0.163.0/dotenv/mod.ts";
const envVars = await config();

export default envVars;