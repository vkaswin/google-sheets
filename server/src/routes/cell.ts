import { Router } from "express";
import CellController from "../controllers/cell";

const router = Router();

router.post("/:gridId/create", CellController.createCell);
router.put("/:cellId/update", CellController.updateCell);
router.delete("/:cellId/remove", CellController.removeCell);

export default router;
