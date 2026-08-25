import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";
import legalResearchRouter from "./routes/legal-research";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Legal research does not need Postgres - serve it first
app.use("/api", legalResearchRouter);

// Lazy-load postgres-dependent routes so a missing DATABASE_URL does not crash startup
let pgRouterLoaded = false;
let pgRouter: express.Router | null = null;

async function loadPgRouter(): Promise<express.Router | null> {
  if (pgRouterLoaded) return pgRouter;
  pgRouterLoaded = true;
  try {
    const { default: router } = await import("./routes");
    pgRouter = router as express.Router;
    return pgRouter;
  } catch (err) {
    logger.warn({ err }, "Postgres routes unavailable — skipping");
    return null;
  }
}

app.use("/api", async (req: Request, res: Response, next: NextFunction) => {
  const router = await loadPgRouter();
  if (router) {
    router(req, res, next);
  } else {
    next();
  }
});

export default app;
