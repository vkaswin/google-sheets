import { Types } from "mongoose";
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

  let grid = await Grid.create({
    sheetId,
    title: `Sheet ${sheet.grids.length + 1}`,
  });

  await Sheet.findByIdAndUpdate(sheetId, { $push: { grids: grid._id } });

  res.status(200).send({
    data: {
      _id: grid._id,
      title: grid.title,
      sheetId: grid.sheetId,
      color: grid.color,
    },
    message: "Grid has been created successfully",
  });
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
    data: {
      grid: {
        _id: grid._id,
        color: grid.color,
        title: grid.title,
        sheetId: grid.sheetId,
      },
      rows,
      columns,
      cells,
    },
    message: "Success",
  });
});

const searchGrid = asyncHandler(async (req, res) => {
  let { gridId } = req.params;
  let { q } = req.query;

  q = q?.toString().trim();

  if (!q || !q.length) {
    res.status(200).send({ data: { cells: [] }, message: "Success" });
    return;
  }

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not found", status: 400 });
  }

  let cells = await Cell.aggregate([
    {
      $match: {
        gridId: new Types.ObjectId(gridId),
        text: { $regex: q, $options: "i" },
      },
    },
    {
      $sort: {
        rowId: 1,
        columnId: 1,
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ]);

  let cellIds = cells.map((cell) => cell._id);

  res.status(200).send({
    data: { cells: cellIds },
    message: "Success",
  });
});

const removeGridById = asyncHandler(async (req, res) => {
  let { gridId } = req.params;

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Grid not exist", status: 400 });
  }

  let sheet = await Sheet.findById(grid.sheetId);

  if (!sheet) {
    throw new CustomError({ message: "Sheet not exist", status: 400 });
  }

  await Sheet.findByIdAndUpdate(grid.sheetId, { $pull: { grids: gridId } });

  await Grid.findByIdAndDelete(gridId);

  await Cell.deleteMany({ gridId });

  await Row.deleteMany({ gridId });

  await Column.deleteMany({ gridId });

  res.status(200).send({ message: "Grid has been deleted successfully" });
});

const GridController = { createGrid, getGridById, searchGrid, removeGridById };

export default GridController;
