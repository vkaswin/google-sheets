import {
  createContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Quill from "quill";
import { debounce } from "@/utils";
import { toast } from "react-toastify";
import { getSheetById } from "@/services/Sheet";
import { createGrid, getGridById, searchGrid } from "@/services/Grid";
import { createColumn, updateColumnById } from "@/services/Column";
import { createRow, updateRowById } from "@/services/Row";
import { createCell, updateCellById } from "@/services/Cell";

const config: IConfig = {
  lineWidth: 2,
  strokeStyle: "#C4C7C5",
  cellHeight: 25,
  cellWidth: 100,
  colWidth: 46,
  rowHeight: 25,
  customFonts: [
    "open-sans",
    "barlow-condensed",
    "caveat",
    "crimson-text",
    "dancing-script",
    "inter",
    "lato",
    "lobster",
    "montserrat",
    "nunito-sans",
    "oswald",
    "pacifico",
    "poppins",
    "quicksand",
    "roboto",
    "roboto-mono",
    "rubik",
    "ubuntu",
  ],
  fonts: {
    "open-sans": "Open Sans",
    "barlow-condensed": "Barlow Condensed",
    caveat: "Caveat",
    "crimson-text": "Crimson Text",
    "dancing-script": "Dancing Script",
    inter: "Inter",
    lato: "Lato",
    lobster: "Lobster",
    montserrat: "Montserrat",
    "nunito-sans": "Nunito Sans",
    oswald: "Oswald",
    pacifico: "Pacifico",
    poppins: "Poppins",
    quicksand: "Quicksand",
    roboto: "Roboto",
    "roboto-mono": "Roboto Mono",
    rubik: "Rubik",
    ubuntu: "Ubuntu",
  },
};

type ISheetContext = {
  quill: Quill | null;
  grid: IGrid;
  sheetDetail: ISheetDetail | null;
  editCell: ICell | null;
  syncState: number;
  selectedCell: ICell | null;
  selectedRow: IRow | null;
  selectedColumn: IColumn | null;
  contextMenuRect: Pick<IRect, "x" | "y"> | null;
  config: IConfig;
  isLoading: boolean;
  highLightCells: string[];
  activeHighLightIndex: number | null;
  getCellById: (cellId?: string) => ICellDetail | undefined;
  getRowById: (rowId?: number) => IRowDetail | undefined;
  getColumnById: (columnId?: number) => IColumnDetail | undefined;
  handleResizeColumn: (columnId: number, width: number) => void;
  handleResizeRow: (rowId: number, height: number) => void;
  handleDeleteCell: () => void;
  handleDeleteColumn: () => void;
  handleDeleteRow: () => void;
  handleInsertRow: (direction: IDirection) => void;
  handleInsertColumn: (direction: IDirection) => void;
  handleTitleChange: (title: string) => void;
  handleCopyCell: () => void;
  handleCutCell: () => void;
  handlePasteCell: () => void;
  handleEditorChange: () => void;
  handleSearchNext: () => void;
  handleSearchPrevious: () => void;
  handleFormatCell: (type: string, value: string) => void;
  handleCreateGrid: () => void;
  handleSearchSheet: (q: string) => void;
  setGrid: Dispatch<SetStateAction<IGrid>>;
  setContextMenuRect: Dispatch<SetStateAction<Pick<IRect, "x" | "y"> | null>>;
  setEditCell: Dispatch<SetStateAction<ICell | null>>;
  setSelectedCellId: Dispatch<SetStateAction<string | null>>;
  setSelectedRowId: Dispatch<SetStateAction<number | null>>;
  setSelectedColumnId: Dispatch<SetStateAction<number | null>>;
};

type ISheetProviderProps = {
  children: ReactNode;
};

export const SheetContext = createContext({} as ISheetContext);

const SheetProvider = ({ children }: ISheetProviderProps) => {
  const [quill, setQuill] = useState<Quill | null>(null);

  const [syncState, setSyncState] = useState(0);

  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const [editCell, setEditCell] = useState<ICell | null>(null);

  const [contextMenuRect, setContextMenuRect] =
    useState<ISheetContext["contextMenuRect"]>(null);

  const [activeHighLightIndex, setActiveHighLightIndex] = useState<
    number | null
  >(null);

  const [highLightCells, setHighLightCells] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [sheetDetail, setSheetDetail] = useState<ISheetDetail | null>(null);

  const [grid, setGrid] = useState<IGrid>({
    cells: [],
    columns: [],
    rows: [],
  });

  const rowDetails = useRef<Map<string, IRowDetail>>(new Map());

  const columnDetails = useRef<Map<string, IColumnDetail>>(new Map());

  const cellDetails = useRef<Map<string, ICellDetail>>(new Map());

  const cellIds = useRef<Map<string, string>>(new Map());

  const rowIds = useRef<Map<number, string>>(new Map());

  const columnIds = useRef<Map<number, string>>(new Map());

  const { sheetId } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const gridId = searchParams.get("gridId");

  const selectedCell = useMemo(() => {
    let cell = grid.cells.find(({ cellId }) => cellId === selectedCellId);
    return cell || null;
  }, [grid.cells, selectedCellId]);

  const selectedRow = useMemo(() => {
    let row = grid.rows.find(({ rowId }) => rowId === selectedRowId);
    return row || null;
  }, [grid.rows, selectedRowId]);

  const selectedColumn = useMemo(() => {
    let column = grid.columns.find(
      ({ columnId }) => columnId === selectedColumnId
    );
    return column || null;
  }, [grid.columns, selectedColumnId]);

  useEffect(() => {
    initQuill();
  }, []);

  useEffect(() => {
    getSheetDetails();
  }, [sheetId]);

  useEffect(() => {
    getGridDetails();
  }, [gridId]);

  useEffect(() => {
    if (!quill || !editCell) return;
    let cell = getCellById(editCell.cellId);
    quill.setContents(cell?.content as any);
    focusTextEditor();
    let handler = debounce(handleEditorChange, 500);
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [editCell]);

  const focusTextEditor = () => {
    const selection = getSelection();
    if (!quill || !selection) return;
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(quill.root);
    range.collapse(false);
    selection.addRange(range);
    quill.root.focus();
  };

  const initQuill = () => {
    const fontFormat = Quill.import("formats/font");
    fontFormat.whitelist = config.customFonts;
    Quill.register(fontFormat, true);
    const quill = new Quill("#editor");
    setQuill(quill);
  };

  const getSheetDetails = async () => {
    if (!sheetId) return;

    try {
      let {
        data: {
          data: { _id, grids, title },
        },
      } = await getSheetById(sheetId);

      setSheetDetail({
        _id,
        grids,
        title,
      });
      if (!gridId) navigate({ search: `gridId=${grids[0]._id}` });
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getGridDetails = async () => {
    if (!gridId) return;

    resetGrid();

    try {
      let {
        data: {
          data: { cells, columns, rows, grid },
        },
      } = await getGridById(gridId);
      setGridDetails(rows, columns, cells);
      forceUpdate();
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setGridDetails = (
    rows: IRowDetail[],
    columns: IColumnDetail[],
    cells: ICellDetail[]
  ) => {
    rowDetails.current = new Map();
    columnDetails.current = new Map();
    cellDetails.current = new Map();
    cellIds.current = new Map();
    rowIds.current = new Map();
    columnIds.current = new Map();

    for (let row of rows) {
      rowDetails.current.set(row._id, row);
      rowIds.current.set(row.rowId, row._id);
    }

    for (let column of columns) {
      columnDetails.current.set(column._id, column);
      columnIds.current.set(column.columnId, column._id);
    }

    for (let cell of cells) {
      let cellId = `${cell.columnId},${cell.rowId}`;
      cellIds.current.set(cellId, cell._id);
      cellDetails.current.set(cell._id, cell);
    }
  };

  const resetGrid = () => {
    setIsLoading(true);
    setEditCell(null);
    setContextMenuRect(null);
    setSelectedCellId(null);
    setSelectedColumnId(null);
    setSelectedRowId(null);
    setActiveHighLightIndex(null);
    setHighLightCells([]);
    setGrid({ cells: [], columns: [], rows: [] });
  };

  const handleEditorChange = async () => {
    if (!quill || !editCell || !gridId) return;

    try {
      let text = quill.getText();
      const content: any[] = [];
      let cellData = getCellById(editCell.cellId);

      quill.getContents().eachLine(({ ops }) => {
        content.push(...ops, { insert: "\n" });
      });

      if (cellData) {
        await updateCellById(cellData._id, { text, content });
        cellData.text = text;
        cellData.content = content;
        forceUpdate();
      } else {
        let body: any = {
          rowId: editCell.rowId,
          columnId: editCell.columnId,
          text,
          content,
        };

        let {
          data: {
            data: { cellId },
          },
        } = await createCell(gridId, body);

        body._id = cellId;
        setCellById(editCell.cellId, body);
        forceUpdate();
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleFormatCell: ISheetContext["handleFormatCell"] = async (
    type: string,
    value: string
  ) => {
    if (!selectedCell || !gridId) return;

    try {
      let isBackground = type === "background";
      let isTextAlign = type === "textAlign";

      let cellData = getCellById(selectedCell.cellId);

      let body: Partial<ICellDetail> = {};
      if (isBackground) body.background = value;
      else if (isTextAlign) body.textAlign = value;

      if (cellData) {
        await updateCellById(cellData._id, body);

        if (isBackground) cellData.background = value;
        else if (isTextAlign) cellData.textAlign = value;

        forceUpdate();
      } else {
        body.columnId = selectedCell.columnId;
        body.rowId = selectedCell.rowId;

        let {
          data: {
            data: { cellId },
          },
        } = await createCell(gridId, body);

        body._id = cellId;
        setCellById(selectedCell.cellId, body as ICellDetail);
        forceUpdate();
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const getCellById: ISheetContext["getCellById"] = (cellId) => {
    // cellId - `columnId,rowId` (or) _id generated in db
    if (typeof cellId !== "string") return;
    if (cellDetails.current.has(cellId)) return cellDetails.current.get(cellId);
    let id = cellIds.current.get(cellId);
    if (!id) return;
    return cellDetails.current.get(id);
  };

  const setCellById = (cellId: string, data: ICellDetail) => {
    cellIds.current.set(cellId, data._id);
    cellDetails.current.set(data._id, data);
  };

  const removeCellById = (cellId: string) => {
    let id = cellIds.current.get(cellId);
    if (!id) return;
    cellIds.current.delete(cellId);
    cellDetails.current.delete(id);
  };

  const getRowById: ISheetContext["getRowById"] = (rowId) => {
    if (typeof rowId !== "number") return;
    let id = rowIds.current.get(rowId);
    if (!id) return;
    return rowDetails.current.get(id);
  };

  const setRowById = (row: IRowDetail) => {
    rowIds.current.set(row.rowId, row._id);
    rowDetails.current.set(row._id, row);
  };

  const removeRowById = (rowId: number) => {
    let id = rowIds.current.get(rowId);
    if (!id) return;
    rowIds.current.delete(rowId);
    rowDetails.current.delete(id);
  };

  const getColumnById: ISheetContext["getColumnById"] = (columnId) => {
    if (typeof columnId !== "number") return;
    let id = columnIds.current.get(columnId);
    if (!id) return;
    return columnDetails.current.get(id);
  };

  const setColumnById = (column: IColumnDetail) => {
    columnIds.current.set(column.columnId, column._id);
    columnDetails.current.set(column._id, column);
  };

  const removeColumnById = (columnId: number) => {
    let id = columnIds.current.get(columnId);
    if (!id) return;
    columnIds.current.delete(columnId);
    columnDetails.current.delete(id);
  };

  const forceUpdate = () => {
    setSyncState(Math.random() + 1);
  };

  const handleResizeColumn = async (columnId: number, width: number) => {
    if (!gridId) return;

    try {
      let columnData = getColumnById(columnId);

      if (columnData) {
        await updateColumnById(columnData._id, { width });
        columnData.width = width;
        forceUpdate();
      } else {
        let {
          data: {
            data: { columnId: _id },
          },
        } = await createColumn(gridId, { columnId, width });
        setColumnById({ columnId, width, _id });
        forceUpdate();
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleResizeRow = async (rowId: number, height: number) => {
    if (!gridId) return;

    try {
      let rowData = getRowById(rowId);

      if (rowData) {
        await updateRowById(rowData._id, { height });
        rowData.height = height;
        forceUpdate();
      } else {
        let {
          data: {
            data: { rowId: _id },
          },
        } = await createRow(gridId, { rowId, height });
        setRowById({ _id, rowId, height });
        forceUpdate();
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleDeleteCell = () => {
    if (!selectedCell) return;
    let id = cellIds.current.get(selectedCell.cellId);
    if (!id) return;
    removeCellById(id);
    forceUpdate();
    setContextMenuRect(null);
  };

  const handleDeleteRow = () => {
    let rowId = selectedCell?.rowId || selectedRow?.rowId;

    if (!rowId) return;

    for (let [_id, cellData] of cellDetails.current) {
      if (cellData.rowId !== rowId) continue;
      let cellId = `${cellData.columnId},${cellData.rowId}`;
      cellIds.current.delete(cellId);
      removeCellById(_id);
    }

    forceUpdate();
    setContextMenuRect(null);
  };

  const handleDeleteColumn = () => {
    let columnId = selectedCell?.columnId || selectedColumn?.columnId;

    if (!columnId) return;

    for (let [_id, cellData] of cellDetails.current) {
      if (cellData.columnId !== columnId) continue;
      let cellId = `${cellData.columnId},${cellData.rowId}`;
      cellIds.current.delete(cellId);
      removeCellById(_id);
    }

    forceUpdate();
    setContextMenuRect(null);
  };

  const handleInsertColumn = (direction: IDirection) => {
    let columnId = selectedCell?.columnId || selectedColumn?.columnId;

    if (!columnId) return;

    for (let [_id, cellData] of cellDetails.current) {
      if (
        direction === "right"
          ? cellData.columnId <= columnId
          : cellData.columnId < columnId
      )
        continue;

      let oldCellId = `${cellData.columnId},${cellData.rowId}`;
      let newColumnId = cellData.columnId + 1;
      let newCellId = `${newColumnId},${cellData.rowId}`;

      cellIds.current.delete(oldCellId);
      cellIds.current.set(newCellId, _id);

      let columnData = getColumnById(cellData.columnId);

      if (columnData) {
        removeColumnById(cellData.columnId);
        columnData.columnId = newColumnId;
        setColumnById(columnData);
      }

      cellData.columnId = newColumnId;
    }

    forceUpdate();
    setContextMenuRect(null);
  };

  const handleInsertRow = (direction: IDirection) => {
    let rowId = selectedCell?.rowId || selectedRow?.rowId;

    if (!rowId) return;

    for (let [_id, cellData] of cellDetails.current) {
      if (
        direction === "bottom"
          ? cellData.rowId <= rowId
          : cellData.rowId < rowId
      )
        continue;

      let oldCellId = `${cellData.columnId},${cellData.rowId}`;
      let newRowId = cellData.rowId + 1;
      let newCellId = `${cellData.columnId},${newRowId}`;

      cellIds.current.delete(oldCellId);
      cellIds.current.set(newCellId, _id);

      let rowData = getRowById(cellData.rowId);

      if (rowData) {
        removeRowById(cellData.rowId);
        rowData.rowId = newRowId;
        setRowById(rowData);
      }

      cellData.rowId = newRowId;
    }

    forceUpdate();
    setContextMenuRect(null);
  };

  const handleCopyCell = () => {
    console.log("copy");
  };

  const handleCutCell = () => {
    console.log("cut");
  };

  const handlePasteCell = () => {
    console.log("paste");
  };

  const handleSearchNext = () => {
    setActiveHighLightIndex((activeIndex) => {
      activeIndex!++;
      return activeIndex === highLightCells.length ? 0 : activeIndex;
    });
  };

  const handleSearchPrevious = () => {
    setActiveHighLightIndex((activeIndex) => {
      activeIndex!--;
      return activeIndex! < 0 ? highLightCells.length - 1 : activeIndex;
    });
  };

  const handleSearchSheet: ISheetContext["handleSearchSheet"] = async (q) => {
    if (!gridId) return;

    q = q.trim();

    try {
      let {
        data: {
          data: { cells },
        },
      } = await searchGrid(gridId, q);
      setHighLightCells(cells);
      setActiveHighLightIndex(cells.length ? 0 : null);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleTitleChange: ISheetContext["handleTitleChange"] = (title) => {
    console.log(title);
  };

  const handleCreateGrid = async () => {
    if (!sheetDetail) return;

    try {
      let {
        data: { data },
      } = await createGrid(sheetDetail._id);
      let sheetData = { ...sheetDetail };
      sheetData.grids.push(data);
      setSheetDetail(sheetData);
      navigate({ search: `gridId=${data._id}` });
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const context: ISheetContext = {
    quill,
    grid,
    sheetDetail,
    config,
    syncState,
    editCell,
    selectedCell,
    selectedColumn,
    selectedRow,
    contextMenuRect,
    isLoading,
    activeHighLightIndex,
    highLightCells,
    setGrid,
    getCellById,
    getRowById,
    getColumnById,
    handleResizeColumn,
    handleResizeRow,
    handleInsertColumn,
    handleDeleteCell,
    handleDeleteColumn,
    handleDeleteRow,
    handleInsertRow,
    handleFormatCell,
    handleCopyCell,
    handleCutCell,
    handlePasteCell,
    handleCreateGrid,
    handleSearchNext,
    handleSearchPrevious,
    handleTitleChange,
    handleEditorChange,
    handleSearchSheet,
    setEditCell,
    setSelectedCellId,
    setSelectedColumnId,
    setSelectedRowId,
    setContextMenuRect,
  };

  return (
    <SheetContext.Provider value={context}>{children}</SheetContext.Provider>
  );
};

export default SheetProvider;
