import Cell from "../models/cell";
import Grid from "../models/grid";
import Row from "../models/row";
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
  let { cellId } = req.params;

  let cell = await Cell.findById(cellId);

  if (!cell) {
    throw new CustomError({ message: "Cell not exist", status: 400 });
  }

  await Cell.findByIdAndDelete(cellId);

  res.status(200).send({ message: "Cell has been deleted successfully" });
});

const copyPasteCell = asyncHandler(async (req, res) => {
  let { cellId } = req.params;

  let columnId = +req.body.columnId;
  let rowId = +req.body.rowId;

  let copyCell = await Cell.findById(cellId, {
    background: 1,
    content: 1,
    gridId: 1,
    text: 1,
  });

  if (!copyCell) {
    throw new CustomError({ message: "Cell not exist", status: 400 });
  }

  let cellData = copyCell.toObject() as any;
  delete cellData._id;

  let pasteCell = await Cell.findOne({
    gridId: cellData.gridId,
    rowId,
    columnId,
  });

  if (pasteCell) {
    let cellId = pasteCell._id.toString();

    await Cell.findByIdAndUpdate(cellId, { $set: cellData });

    res.status(200).send({
      message: "Success",
      data: {
        cell: { ...cellData, _id: cellId, rowId, columnId },
      },
    });
  } else {
    let cell = await Cell.create({
      ...cellData,
      rowId,
      columnId,
    });

    res.status(200).send({ message: "Success", data: { cell } });
  }
});

const insertColumn = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { columnId, direction } = req.body;

  columnId = +columnId;

  if (!columnId) {
    return res.status(400).send({ message: "ColumnId is required" });
  }

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not exist", status: 400 });
  }

  if (direction !== "left" && direction !== "right")
    return res.status(400).send({ message: "Invalid direction" });

  await Cell.updateMany(
    {
      gridId,
      columnId: { [direction === "right" ? "$gt" : "$gte"]: columnId },
    },
    { $inc: { columnId: 1 } }
  );

  res
    .status(200)
    .send({ message: `Column has been inserted ${direction} successfully` });
});

const insertRow = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { rowId, direction } = req.body;

  rowId = +rowId;

  if (!rowId) {
    return res.status(400).send({ message: "RowId is required" });
  }

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not exist", status: 400 });
  }

  if (direction !== "top" && direction !== "bottom")
    return res.status(400).send({ message: "Invalid direction" });

  await Cell.updateMany(
    {
      gridId,
      rowId: { [direction === "bottom" ? "$gt" : "$gte"]: rowId },
    },
    { $inc: { rowId: 1 } }
  );

  res.status(200).send({ message: "Row has been inserted successfully" });
});

const removeRow = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { rowId } = req.body;

  rowId = +rowId;

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not exist", status: 400 });
  }

  await Cell.deleteMany({ gridId, rowId });

  res.status(200).send({ message: "Row has been deleted successfully" });
});

const removeColumn = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { columnId } = req.body;

  columnId = +columnId;

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not exist", status: 400 });
  }

  await Cell.deleteMany({ gridId, columnId });

  res.status(200).send({ message: "Column has been deleted successfully" });
});

const CellController = {
  createCell,
  updateCell,
  removeCell,
  duplicateCells,
  copyPasteCell,
  insertColumn,
  insertRow,
  removeColumn,
  removeRow,
};

export default CellController;
