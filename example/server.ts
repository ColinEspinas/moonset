import { serve } from "https://deno.land/std@0.82.0/http/server.ts";
import moonset, { startServer } from '../mod.ts';

// Creates a server from config file and starts it.
const server = moonset(JSON.parse(await Deno.readTextFile('./config.json')));
startServer(server);
