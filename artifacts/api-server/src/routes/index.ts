import { Router, type IRouter } from "express";
import healthRouter from "./health";
import briefingRequestsRouter from "./briefing-requests";
import outcomesRouter from "./outcomes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(briefingRequestsRouter);
router.use(outcomesRouter);

export default router;
