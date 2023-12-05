import { Router } from "express";
import SheetController from "../controllers/sheet";

const router = Router();

router.post("/create", SheetController.createSheet);
router.get("/:sheetId/detail", SheetController.getSheetById);

export default router;
