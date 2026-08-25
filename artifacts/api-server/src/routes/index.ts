import { Router, type IRouter } from "express";
import healthRouter from "./health";
import briefingRequestsRouter from "./briefing-requests";
import outcomesRouter from "./outcomes";
import partnerProofsRouter from "./partner-proofs";
import partnerResourcesRouter from "./partner-resources";
import legalResearchRouter from "./legal-research";

const router: IRouter = Router();

router.use(healthRouter);
router.use(briefingRequestsRouter);
router.use(outcomesRouter);
router.use(partnerProofsRouter);
router.use(partnerResourcesRouter);
router.use(legalResearchRouter);

export default router;
