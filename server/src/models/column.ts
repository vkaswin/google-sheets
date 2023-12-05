import { Schema, model } from "mongoose";

const ColumnSchema = new Schema(
  {
    gridId: {
      required: true,
      index: true,
      type: Schema.Types.ObjectId,
    },
    columnId: {
      required: true,
      type: Number,
    },
    width: {
      required: true,
      type: Number,
    },
  },
  { timestamps: true }
);

const Column = model("Column", ColumnSchema);

export default Column;
