import Cell from "../models/cell";
import Grid from "../models/grid";
import { CustomError, asyncHandler } from "../utils";

const createCell = asyncHandler(async (req, res) => {
  let { gridId } = req.params;

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not exist", status: 400 });
  }

  req.body.gridId = gridId;

  let cell = await Cell.create(req.body);

  res.status(200).send({ data: { cellId: cell._id }, message: "Success" });
});

const updateCell = asyncHandler(async (req, res) => {
  let { cellId } = req.params;

  let cell = await Cell.findById(cellId);

  if (!cell) {
    throw new CustomError({ message: "Cell not exist", status: 400 });
  }

  await Cell.findByIdAndUpdate(cellId, { $set: req.body });

  res.status(200).send({ message: "Cell has been updated successfully" });
});

const duplicateCells = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { createCells, updateCells, cellId } = req.body;

  if (
    !cellId ||
    !Array.isArray(createCells) ||
    !Array.isArray(updateCells) ||
    (!createCells.length && !updateCells.length)
  )
    return res.status(200).send({ data: { cells: [], message: "Success" } });

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not exist", status: 400 });
  }

  let cell = await Cell.findById(cellId, {
    _id: 0,
    __v: 0,
    rowId: 0,
    columnId: 0,
    updatedAt: 0,
    createdAt: 0,
  });

  if (!cell) {
    throw new CustomError({ message: "Cell not exist", status: 400 });
  }

  let cellDetail = cell.toObject();

  let body = createCells.map(({ rowId, columnId }) => {
    return { ...cellDetail, rowId, columnId };
  });

  let cells = await Cell.create(body);

  await Cell.updateMany({ _id: { $in: updateCells } }, { $set: cell });

  cells = cells.concat(
    updateCells.map((cellId) => {
      return { ...cellDetail, _id: cellId };
    }) as any
  );

  res.status(200).send({ data: { cells }, message: "Success" });
});

const removeCell = asyncHandler(async (req, res) => {
  res.end();
});

const copyPasteCell = asyncHandler(async (req, res) => {
  res.end();
});

const CellController = { createCell, updateCell, removeCell, duplicateCells };

export default CellController;
