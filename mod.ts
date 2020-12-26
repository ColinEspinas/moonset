/**
 * webserver.ts
 */
import { serve, Server } from 'std/http/server.ts';
import { serveFile} from 'std/http/file_server.ts';

export interface serverConfig {
  hostname: string;
  port: number;
  environment: "dev" | "prod";
  appDirectory: string;
  logFile: string | null;
}

export interface moonsetServer {
  config: serverConfig;
  paths: { 
    'app': string,
    'components': string,
    'modules': string,
    'public': string,
    'assets': string,
    'routes': string,
  };
  isStarted: boolean;
}

export const createServer = (config : serverConfig) : moonsetServer => ({
  config,
  paths: {
    'app': config.appDirectory,
    'components': `${config.appDirectory}/components`,
    'modules': `${config.appDirectory}/modules`,
    'public': `${config.appDirectory}/public`,
    'assets': `${config.appDirectory}/public/assets`,
    'routes': `${config.appDirectory}/routes`,
  },
  isStarted: false
});
export default createServer;

export const startServer = async (server : moonsetServer) => {
  
  const httpServer = serve({ hostname: server.config.hostname, port: server.config.port });
  console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

  for await (const request of httpServer) {
    // let bodyContent = "Your user-agent is:\n\n";
    // bodyContent += request.headers.get("user-agent") || "Unknown";
    if (server.config.environment === 'dev') {
      console.log(request.method + ': ' + request.url);
      console.log(request);
    }

    let url = "example/app/public/index.html";

    if (
      request.url.startsWith('/components') || 
      request.url.startsWith('/modules') || 
      request.url.startsWith('/routes')
    ) {
      url = Deno.cwd() + server.paths.app + request.url;
    }
    else {
      url = Deno.cwd() + server.paths.public + request.url;
    }

    try {
      await Deno.readTextFile(url);
    }
    catch (error) {
      url = Deno.cwd() + server.paths.public + "/index.html";
    }

    console.log(url);

    try {
      request.respond(await serveFile(request, url));
    }
    catch (error) {
      if (error && error instanceof Deno.errors.NotFound) {
        request.respond({ status: 404, body: "Error 404" });
      }
    }
  }
}
