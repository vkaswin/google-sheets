import { Router } from "express";
import ColumnController from "../controllers/column";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);
router.post("/:gridId/create", ColumnController.createColumn);
router.put("/:columnId/update", ColumnController.updateColumn);

export default router;
