import { Schema, model, Types } from "mongoose";

const SheetSchema = new Schema(
  {
    title: {
      default: "Untitled Spreadsheet",
      type: String,
    },
    grids: {
      ref: "Grid",
      type: [Types.ObjectId],
    },
  },
  { timestamps: true }
);

const Sheet = model("Sheet", SheetSchema);

export default Sheet;
