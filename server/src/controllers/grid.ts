import Cell from "../models/cell";
import Column from "../models/column";
import Grid from "../models/grid";
import Row from "../models/row";
import Sheet from "../models/sheet";
import { CustomError, asyncHandler } from "../utils";

const createGrid = asyncHandler(async (req, res) => {
  let { sheetId } = req.params;
  let sheet = await Sheet.findById(sheetId);

  if (!sheet) {
    throw new CustomError({ message: "Sheet not found", status: 400 });
  }

  let grid = await Grid.create({ title: `Sheet ${sheet.grids.length + 1}` });

  await Sheet.findByIdAndUpdate(sheetId, { $push: { grids: grid._id } });

  res.status(200).send({ message: "Success", gridId: grid._id });
});

const getGridById = asyncHandler(async (req, res) => {
  let { gridId } = req.params;

  let grid = await Grid.findById(gridId, { title: 1, sheetId: 1, color: 1 });

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
    ...grid.toJSON(),
    rows,
    columns,
    cells,
  });
});

export default { createGrid, getGridById };
