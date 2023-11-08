import { ISheetDetail } from "@/types/Sheets";

export const data: ISheetDetail = {
  rows: [
    {
      height: 200,
      rowId: 1,
    },
    {
      height: 35,
      rowId: 2,
    },
    {
      height: 39,
      rowId: 3,
    },
    {
      height: 50,
      rowId: 4,
    },
    {
      height: 128,
      rowId: 5,
    },
    {
      height: 77,
      rowId: 6,
    },
    {
      height: 99,
      rowId: 7,
    },
    {
      height: 100,
      rowId: 13,
    },
    {
      height: 35,
      rowId: 15,
    },
    {
      height: 39,
      rowId: 33,
    },
    {
      height: 50,
      rowId: 24,
    },
    {
      height: 128,
      rowId: 45,
    },
    {
      height: 150,
      rowId: 50,
    },
    {
      height: 77,
      rowId: 66,
    },
    {
      height: 99,
      rowId: 37,
    },
  ],
  columns: [
    {
      width: 350,
      columnId: 1,
    },
    {
      width: 175,
      columnId: 2,
    },
    {
      width: 220,
      columnId: 3,
    },
    {
      width: 270,
      columnId: 5,
    },
    {
      width: 125,
      columnId: 9,
    },
  ],
  cells: [
    {
      rowId: 1,
      columnId: 5,
      html: "<span>Loreum Ispum</span><br/><span>Loreum Ispum</span>",
    },
    { rowId: 2, columnId: 2, html: "<span>Loreum Ispum</span>" },
    {
      backgroundColor: "#EA9999",
      color: "white",
      rowId: 1,
      columnId: 1,
      html: `<span>Loreum Ispum</span><span style=font-style:italic;>Loreum Isp</span><span style=font-style:italic;font-weight:bold;>um Lore</span><span style=font-style:italic;>um Ispum Loreum Ispum</span><br/><span>Loreum Ispum </span><br/>`,
    },
    {
      backgroundColor: "#B7E1CD",
      html: "<b>Loreum Ispum</b>",
      rowId: 4,
      columnId: 2,
    },
    {
      backgroundColor: "#CADAF8",
      html: `<span>sfsf </span><br/><span style=font-weight:bold;>Asff  </span><br/><span style=font-weight:bold;>sf sf</span><br/><span style=font-weight:bold;>sfs fsfs sfs s</span><span style=font-style:italic;>f  s</span><span>fs sfsf </span><br/><span> sfs fa sfs sf s sf s fsf </span><span style=font-weight:bold;>s s  s</span><span>sfsfs </span><br/>`,
      columnId: 3,
      rowId: 1,
    },
    {
      html: "<span>Lorem Ipsum Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing</span>",
      backgroundColor: "#B3A7D6",
      rowId: 2,
      columnId: 8,
    },
    {
      backgroundColor: "#FFF2CC",
      html: "<b>Loreum Ispum</b>",
      rowId: 12,
      columnId: 6,
    },
    {
      html: "<span>Loreum Ispum</span>",
      rowId: 9,
      columnId: 3,
    },
  ],
};
