import Sheet from "../models/sheet";
import Grid from "../models/grid";
import { asyncHandler, CustomError } from "../utils";

const createSheet = asyncHandler(async (req, res) => {
  let grid = await Grid.create({});

  let sheet = await Sheet.create({ grids: [grid._id] });

  res.status(200).send({
    data: { sheedId: sheet._id },
    message: "Success",
  });
});

const getSheetById = asyncHandler(async (req, res) => {
  let { sheetId } = req.params;

  let sheet = await Sheet.findById(sheetId, { grids: 1, title: 1 }).populate({
    path: "grids",
    select: { title: 1, color: 1, sheetId: 1 },
  });

  if (!sheet) {
    throw new CustomError({ message: "Sheet not found", status: 400 });
  }

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

const SheetController = {
  createSheet,
  getSheetById,
  getSheetList,
  updateSheetById,
};

export default SheetController;
