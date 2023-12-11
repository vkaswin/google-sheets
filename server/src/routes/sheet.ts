import { Router } from "express";
import SheetController from "../controllers/sheet";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);
router.post("/create", SheetController.createSheet);
router.get("/:sheetId/detail", SheetController.getSheetById);
router.get("/list", SheetController.getSheetList);
router.put("/:sheetId/update", SheetController.updateSheetById);
router.delete("/:sheetId/remove", SheetController.removeSheetById);

export default router;
