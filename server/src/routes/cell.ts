import { Router } from "express";
import CellController from "../controllers/cell";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.post("/:gridId/create", CellController.createCell);
router.post("/:gridId/duplicate", CellController.duplicateCells);
router.post("/:cellId/copypaste", CellController.copyPasteCell);

router.put("/:gridId/insert/column", CellController.insertColumn);
router.put("/:gridId/insert/row", CellController.insertRow);
router.put("/:cellId/update", CellController.updateCell);

router.delete("/:cellId/cell", CellController.removeCell);
router.delete("/:gridId/row", CellController.removeRow);
router.delete("/:gridId/column", CellController.removeColumn);

export default router;
