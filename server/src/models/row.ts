import { Schema, model } from "mongoose";

const RowSchema = new Schema(
  {
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

export default model("Row", RowSchema);
