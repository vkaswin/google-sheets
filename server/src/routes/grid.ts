import { Router } from "express";
import GridController from "../controllers/grid";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/:gridId/detail", GridController.getGridById);
router.get("/:gridId/search", GridController.searchGrid);

router.post("/:sheetId/create", GridController.createGrid);
router.post("/:gridId/duplicate", GridController.duplicateGridById);

router.put("/:gridId/update", GridController.updateGridById);

router.delete("/:gridId/remove", GridController.removeGridById);

export default router;
