import { SparkWallet } from "@buildonspark/spark-sdk";
import {
  ErrorCode,
  getPubKeyResponse,
  InMemoryPublicKeyCache,
  NonceValidator,
  UmaError,
} from "@uma-sdk/core";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import ReceivingVasp from "./receiving/ReceivingVasp.js";
import SendingVasp from "./sending/SendingVasp.js";
import SendingVaspRequestCache from "./sending/SendingVaspRequestCache.js";
import UmaConfig from "./UmaConfig.js";
import UserService from "./users/UserService.js";
import { errorMessage } from "./errors.js";
import { fullUrlForRequest } from "./networking/expressAdapters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CORS configuration for public endpoints
const publicCors = cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
});

export const createUmaServer = (
  config: UmaConfig,
  pubKeyCache: InMemoryPublicKeyCache,
  sendingVaspRequestCache: SendingVaspRequestCache,
  userService: UserService,
  nonceCache: NonceValidator,
): {
  listen: (
    port: number,
    onStarted: () => void,
  ) => {
    close: (callback?: ((err?: Error | undefined) => void) | undefined) => void;
  };
} => {
  const app = express();

  app.use(bodyParser.text({ type: "*/*" })); // Middleware to parse raw body

  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../dist/client")));

  const sendingVasp = new SendingVasp(
    config,
    pubKeyCache,
    sendingVaspRequestCache,
    userService,
    nonceCache,
  );
  sendingVasp.registerRoutes(app);
  const receivingVasp = new ReceivingVasp(
    config,
    pubKeyCache,
    userService,
    nonceCache,
  );
  receivingVasp.registerRoutes(app);

  app.get("/.well-known/lnurlpubkey", (_req, res) => {
    res.send(
      getPubKeyResponse({
        signingCertChainPem: config.umaSigningCertChain,
        encryptionCertChainPem: config.umaEncryptionCertChain,
      }).toJsonString(),
    );
  });

  app.get("/.well-known/uma-configuration", publicCors, (req, res) => {
    const reqUrl = fullUrlForRequest(req);
    const reqBaseUrl = reqUrl.origin;
    // TODO: Add UMA Auth implementation.
    res.send({
      uma_major_versions: [0, 1],
      uma_request_endpoint: reqBaseUrl + "/api/uma/request_invoice_payment",
    });
  });

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/client/index.html"));
  });

  // Default 404 handler.
  app.use(function (_req, res) {
    res.status(404);
    res.send(errorMessage("Not found."));
  });

  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    if (res.headersSent) {
      return next(err);
    }

    if (err instanceof UmaError) {
      res.status(err.httpStatusCode).json(JSON.parse(err.toJSON()));
      return;
    }

    const error = new UmaError(
      `Something broke! ${err.message}`,
      ErrorCode.INTERNAL_ERROR,
    );
    res.status(error.httpStatusCode).json(JSON.parse(error.toJSON()));
  });

  return app;
};
