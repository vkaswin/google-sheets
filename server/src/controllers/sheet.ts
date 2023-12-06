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

  let sheet = await Sheet.findById(sheetId).populate({
    path: "grids",
    select: { title: 1, color: 1, sheetId: 1 },
  });

  if (!sheet) {
    throw new CustomError({ message: "Sheet not found", status: 400 });
  }

  res.status(200).send({
    data: sheet.toJSON(),
    message: "Success",
  });
});

export default { createSheet, getSheetById };
