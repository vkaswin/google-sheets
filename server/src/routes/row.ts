import { Router } from "express";
import RowController from "../controllers/row";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);
router.post("/:gridId/create", RowController.createRow);
router.put("/:rowId/update", RowController.updateRow);

export default router;
