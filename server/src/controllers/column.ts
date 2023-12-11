import Column from "../models/column";
import Grid from "../models/grid";
import { CustomError, asyncHandler } from "../utils";

const createColumn = asyncHandler(async (req, res) => {
  let { gridId } = req.params;

  let grid = await Grid.findById(gridId);

  if (!grid) {
    throw new CustomError({ message: "Gird not exist", status: 400 });
  }

  req.body.gridId = gridId;

  let row = await Column.create(req.body);

  res.status(200).send({
    data: {
      columnId: row._id,
    },
    message: "Column has been created successfully",
  });
});

const updateColumn = asyncHandler(async (req, res) => {
  let { columnId } = req.params;

  let row = await Column.findById(columnId);

  if (!row) {
    throw new CustomError({ message: "Column not exist", status: 400 });
  }

  await Column.findByIdAndUpdate(columnId, { $set: req.body });

  res.status(200).send({ message: "Column has been updated successfully" });
});

const ColumnController = { createColumn, updateColumn };

export default ColumnController;
