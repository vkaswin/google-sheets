import Grid from "../models/grid";
import Row from "../models/row";
import { CustomError, asyncHandler } from "../utils";

const createRow = asyncHandler(async (req, res) => {
  let { gridId } = req.params;

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Gird not exist", status: 400 });
  }

  req.body.gridId = gridId;

  let row = await Row.create(req.body);

  res.status(200).send({
    data: { rowId: row._id },
    message: "Row has been created successfully",
  });
});

const updateRow = asyncHandler(async (req, res) => {
  let { rowId } = req.params;

  let row = await Row.findById(rowId);

  if (!row) {
    throw new CustomError({ message: "Row not exist", status: 400 });
  }

  await Row.findByIdAndUpdate(rowId, { $set: req.body });

  res.status(200).send({ message: "Row has been updated successfully" });
});

const RowController = { createRow, updateRow };

export default RowController;
