import { Router } from "express";
import GridController from "../controllers/grid";

const router = Router();

router.post("/:sheetId/create", GridController.createGrid);
router.get("/:gridId/detail", GridController.getGridById);
router.get("/:gridId/search", GridController.searchGrid);

export default router;
