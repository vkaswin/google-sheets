import Cell from "../models/cell";
import Grid from "../models/grid";
import { CustomError, asyncHandler } from "../utils";

const createCell = asyncHandler(async (req, res) => {
  let { gridId } = req.params;

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not found", status: 400 });
  }

  req.body.gridId = gridId;

  let cell = await Cell.create(req.body);

  res.status(200).send({ data: { cellId: cell._id }, message: "Success" });
});

const updateCell = asyncHandler(async (req, res) => {
  let { cellId } = req.params;

  let cell = await Cell.findById(cellId);

  if (!cell) {
    throw new CustomError({ message: "Cell not found", status: 400 });
  }

  await Cell.findByIdAndUpdate(cellId, { $set: req.body });

  res.status(200).send({ message: "Cell has been updated successfully" });
});

const removeCell = asyncHandler(async (req, res) => {
  res.end();
});

export default { createCell, updateCell, removeCell };
