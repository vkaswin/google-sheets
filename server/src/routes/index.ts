import { Router } from "express";
import UserRoutes from "./user";
import SheetRoutes from "./sheet";
import GridRoutes from "./grid";
import RowRoutes from "./row";
import ColumnRoutes from "./column";
import CellRoutes from "./cell";

const router = Router();

router.use("/api/user", UserRoutes);
router.use("/api/sheet", SheetRoutes);
router.use("/api/grid", GridRoutes);
router.use("/api/row", RowRoutes);
router.use("/api/column", ColumnRoutes);
router.use("/api/cell", CellRoutes);

router.get("/api/health-check", (req, res) => {
  res.status(200).send({ message: "Success" });
});

export default router;
