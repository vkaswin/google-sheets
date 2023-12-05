import Sheet from "../models/sheet";
import Grid from "../models/grid";
import Row from "../models/row";
import Column from "../models/column";
import Cell from "../models/cell";
import { asyncHandler, CustomError } from "../utils";

const createSheet = asyncHandler(async (req, res) => {
  let grid = await Grid.create({});

  let sheet = await Sheet.create({ grids: [grid._id] });

  res
    .status(200)
    .send({ message: "Success", sheedId: sheet._id, gridId: grid._id });
});

const getSheetById = asyncHandler(async (req, res) => {
  let { sheetId } = req.params;
  let { gridId } = req.query;

  let sheet = await Sheet.findById(sheetId).populate({
    path: "grids",
    select: { title: 1, color: 1, sheetId: 1 },
  });

  if (!sheet) {
    throw new CustomError({ message: "Sheet not found", status: 400 });
  }

  if (typeof gridId !== "string") gridId = sheet.grids[0] as string;

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not found", status: 400 });
  }

  let rows = await Row.find({ gridId }, { rowId: 1, height: 1 });
  let columns = await Column.find({ gridId }, { columnId: 1, width: 1 });
  let cells = await Cell.find(
    { gridId },
    { createdAt: 0, updatedAt: 0, __v: 0 }
  );

  res.status(200).send({
    ...sheet.toJSON(),
    rows,
    columns,
    cells,
    message: "Success",
  });
});

export default { createSheet, getSheetById };
