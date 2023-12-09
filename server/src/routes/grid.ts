import { Router } from "express";
import GridController from "../controllers/grid";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);
router.post("/:sheetId/create", GridController.createGrid);
router.get("/:gridId/detail", GridController.getGridById);
router.get("/:gridId/search", GridController.searchGrid);
router.delete("/:gridId/remove", GridController.removeGridById);

export default router;
