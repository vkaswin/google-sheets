import { Router } from "express";
import RowController from "../controllers/row";

const router = Router();

router.post("/:gridId/create", RowController.createRow);
router.put("/:rowId/update", RowController.updateRow);

export default router;
