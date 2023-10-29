import { Schema, model } from "mongoose";

const ColumnSchema = new Schema(
  {
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

export default model("Column", ColumnSchema);
