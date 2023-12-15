import Sheet from "../models/sheet";
import Grid from "../models/grid";
import Cell from "../models/cell";
import Row from "../models/row";
import Column from "../models/column";
import { asyncHandler, CustomError } from "../utils";

const createSheet = asyncHandler(async (req, res) => {
  let sheet = await Sheet.create({
    createdBy: req.user._id,
  });

  let grid = await Grid.create({ sheetId: sheet._id, createdBy: req.user._id });

  await Sheet.findByIdAndUpdate(sheet._id, { $push: { grids: grid._id } });

  res.status(200).send({
    data: { sheetId: sheet._id },
    message: "Sheet has been created successfully",
  });
});

const getSheetById = asyncHandler(async (req, res) => {
  let { sheetId } = req.params;

  let sheet = await Sheet.findById(sheetId, {
    grids: 1,
    title: 1,
    createdBy: 1,
  }).populate({
    path: "grids",
    select: { title: 1, color: 1, sheetId: 1 },
  });

  if (!sheet) {
    throw new CustomError({ message: "Sheet not exist", status: 400 });
  }

  if (sheet.createdBy.toString() !== req.user._id) {
    throw new CustomError({
      message: "You don't have access to view and edit the sheet",
      status: 400,
    });
  }

  await Sheet.findByIdAndUpdate(sheetId, {
    $set: { lastOpenedAt: new Date().toISOString() },
  });

  res.status(200).send({
    data: {
      _id: sheet._id,
      title: sheet.title,
      grids: sheet.grids,
    },
    message: "Success",
  });
});

const updateSheetById = asyncHandler(async (req, res) => {
  let { sheetId } = req.params;

  let sheet = await Sheet.findById(sheetId);

  if (!sheet) {
    throw new CustomError({ status: 400, message: "Sheet not exist" });
  }

  await Sheet.findByIdAndUpdate(sheetId, { $set: req.body });

  res.status(200).send({ message: "Sheet has been updated successfully" });
});

const getSheetList = asyncHandler(async (req, res) => {
  let { page = 1, search = "", limit = 20 } = req.query;
  let { _id: userId } = req.user;

  const matchQuery = {
    createdBy: userId,
    title: { $regex: search, $options: "i" },
  };

  let sheets = await Sheet.find(
    matchQuery,
    { createdBy: 0 },
    {
      sort: {
        createdAt: 1,
      },
      limit: +limit,
      skip: (+page - 1) * +limit,
    }
  );

  let count = (await Sheet.find(matchQuery)).length;

  let pageMeta = {
    totalPages: Math.ceil(count / +limit),
    total: count,
    page: +page,
  };

  res.status(200).send({ data: { sheets, pageMeta }, message: "Success" });
});

const removeSheetById = asyncHandler(async (req, res) => {
  let { sheetId } = req.params;

  let sheet = await Sheet.findById(sheetId);

  if (!sheet) {
    throw new CustomError({ message: "Sheet not exist", status: 400 });
  }

  let query = { gridId: { $in: sheet.grids } };

  await Cell.deleteMany(query);

  await Row.deleteMany(query);

  await Column.deleteMany(query);

  await Grid.deleteMany({ _id: { $in: sheet.grids } });

  await Sheet.findByIdAndDelete(sheetId);

  res.status(200).send({ message: "Sheet has been deleted successfully" });
});

const SheetController = {
  createSheet,
  getSheetById,
  getSheetList,
  updateSheetById,
  removeSheetById,
};

export default SheetController;
