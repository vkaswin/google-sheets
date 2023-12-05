import { Schema, model } from "mongoose";

const RowSchema = new Schema(
  {
    gridId: {
      required: true,
      index: true,
      type: Schema.Types.ObjectId,
    },
    rowId: {
      required: true,
      type: Number,
    },
    height: {
      required: true,
      type: Number,
    },
  },
  { timestamps: true }
);

const Row = model("Row", RowSchema);

export default Row;
