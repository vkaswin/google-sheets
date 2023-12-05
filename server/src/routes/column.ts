import { Router } from "express";
import ColumnController from "../controllers/column";

const router = Router();

router.post("/:gridId/create", ColumnController.createColumn);
router.put("/:columnId/update", ColumnController.updateColumn);

export default router;
