import { Schema, model } from "mongoose";

const GridSchema = new Schema(
  {
    sheetId: {
      required: true,
      index: true,
      type: Schema.Types.ObjectId,
    },
    title: {
      default: "Sheet 1",
      type: String,
    },
    color: {
      default: "transparent",
      type: String,
    },
  },
  { timestamps: true }
);

const Grid = model("Grid", GridSchema);

export default Grid;
