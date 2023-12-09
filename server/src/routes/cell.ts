import { Router } from "express";
import CellController from "../controllers/cell";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);
router.post("/:gridId/create", CellController.createCell);
router.put("/:cellId/update", CellController.updateCell);
router.delete("/:cellId/remove", CellController.removeCell);
router.post("/:gridId/duplicate", CellController.duplicateCells);

export default router;
