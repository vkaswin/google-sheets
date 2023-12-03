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
import { useParams } from "react-router-dom";
import Quill from "quill";
import { debounce } from "@/utils";
import { data } from "./data";

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
  editCell: ICell | null;
  selectedCell: ICell | undefined;
  selectedRow: IRow | undefined;
  selectedColumn: IColumn | undefined;
  contextMenuRect: Pick<IRect, "x" | "y"> | null;
  isSyncNeeded: number;
  config: IConfig;
  isLoading: boolean;
  highLightCellIds: string[];
  activeSearchIndex: number;
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
  handleCopyCell: () => void;
  handleCutCell: () => void;
  handlePasteCell: () => void;
  handleEditorChange: () => void;
  handleSearchNext: () => void;
  handleSearchPrevious: () => void;
  handleFormatCell: (type: string, value: string) => void;
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

  const [isSyncNeeded, setIsSyncNeeded] = useState(0);

  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const [editCell, setEditCell] = useState<ICell | null>(null);

  const [contextMenuRect, setContextMenuRect] =
    useState<ISheetContext["contextMenuRect"]>(null);

  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  const [highLightCellIds, setHighLightCellIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const { current: rowDetails } = useRef<Map<number, IRowDetail>>(new Map());

  const { current: columnDetails } = useRef<Map<number, IColumnDetail>>(
    new Map()
  );

  const { current: cellDetails } = useRef<Map<string, ICellDetail>>(new Map());

  const { current: cellIds } = useRef<Map<string, string>>(new Map());

  const [grid, setGrid] = useState<IGrid>({
    cells: [],
    columns: [],
    rows: [],
  });

  const { sheetId } = useParams();

  const selectedCell = useMemo(() => {
    return grid.cells.find(({ cellId }) => cellId === selectedCellId);
  }, [grid.cells, selectedCellId]);

  const selectedRow = useMemo(() => {
    return grid.rows.find(({ rowId }) => rowId === selectedRowId);
  }, [grid.rows, selectedRowId]);

  const selectedColumn = useMemo(() => {
    return grid.columns.find(({ columnId }) => columnId === selectedColumnId);
  }, [grid.columns, selectedColumnId]);

  useEffect(() => {
    initQuill();
  }, []);

  useEffect(() => {
    getSheetDetails();
  }, [sheetId]);

  useEffect(() => {
    if (!quill || !editCell) return;
    let cell = getCellById(editCell.cellId);
    quill.setContents(cell?.content as any);
    focusTextEditor();
    let handler = debounce(handleEditorChange, 500);
    quill.on("text-change", handler);
    return () => {
      handleEditorChange();
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
    try {
      setIsLoading(true);

      let { rows, cells, columns } = data;

      for (let row of rows) {
        rowDetails.set(row.rowId, row);
      }

      for (let column of columns) {
        columnDetails.set(column.columnId, column);
      }

      for (let cell of cells) {
        let cellId = `${cell.columnId},${cell.rowId}`;
        cellIds.set(cellId, cell._id);
        cellDetails.set(cell._id, cell);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      forceUpdate();
    }
  };

  const handleEditorChange = () => {
    if (!quill || !editCell) return;

    let text = quill.getText();
    const content: any[] = [];
    let cell = getCellById(editCell.cellId);

    quill.getContents().eachLine(({ ops }) => {
      content.push(...ops, { insert: "\n" });
    });

    if (!cell) {
      //*TODO send the data to the server and get the cellId
      let id = crypto.randomUUID();
      cell = {
        rowId: editCell.rowId,
        columnId: editCell.columnId,
      };

      setCellById(id, editCell.cellId, cell);
    }

    cell.text = text;
    cell.content = content as any;

    forceUpdate();
  };

  const handleFormatCell: ISheetContext["handleFormatCell"] = (
    type: string,
    value: string
  ) => {
    if (!selectedCell) return;

    let cell = getCellById(selectedCell.cellId);

    if (!cell) {
      //*TODO send the data to the server and get the cellId
      let _id = crypto.randomUUID();
      cell = {
        columnId: selectedCell.columnId,
        rowId: selectedCell.rowId,
      };

      setCellById(_id, selectedCell.cellId, cell);
    }

    if (type === "background") cell.background = value;
    else if (type === "textAlign") cell.textAlign = value;

    forceUpdate();
  };

  const getCellById: ISheetContext["getCellById"] = (cellId) => {
    if (typeof cellId !== "string") return;
    let id = cellIds.get(cellId);
    if (!id) return;
    return cellDetails.get(id);
  };

  const setCellById = (id: string, cellId: string, data: ICellDetail) => {
    cellIds.set(cellId, id);
    cellDetails.set(id, data);
  };

  const removeCellById = (cellId: string) => {
    let id = cellIds.get(cellId);
    if (!id) return;
    cellIds.delete(cellId);
    cellDetails.delete(id);
  };

  const getRowById: ISheetContext["getRowById"] = (rowId) => {
    if (typeof rowId !== "number") return;
    return rowDetails.get(rowId);
  };

  const setRowById = (rowId: number, data: IRowDetail) => {
    rowDetails.set(rowId, data);
  };

  const removeRowById = (rowId: number) => {
    rowDetails.delete(rowId);
  };

  const getColumnById: ISheetContext["getColumnById"] = (columnId) => {
    if (typeof columnId !== "number") return;
    return columnDetails.get(columnId);
  };

  const setColumnById = (columnId: number, data: IColumnDetail) => {
    columnDetails.set(columnId, data);
  };

  const removeColumnById = (rowId: number) => {
    columnDetails.delete(rowId);
  };

  const forceUpdate = () => {
    setIsSyncNeeded(Math.random() + 1);
  };

  const handleResizeColumn = (columnId: number, width: number) => {
    let columnData = getColumnById(columnId);

    if (!columnData) setColumnById(columnId, { columnId, width });
    else columnData.width = width;

    forceUpdate();
  };

  const handleResizeRow = (rowId: number, height: number) => {
    let rowData = getRowById(rowId);

    if (!rowData) setRowById(rowId, { rowId, height });
    else rowData.height = height;

    forceUpdate();
  };

  const handleDeleteCell = () => {
    if (!selectedCell) return;
    let id = cellIds.get(selectedCell.cellId);
    if (!id) return;
    removeCellById(id);
    forceUpdate();
    setContextMenuRect(null);
  };

  const handleDeleteRow = () => {
    let rowId = selectedCell?.rowId || selectedRow?.rowId;

    if (!rowId) return;

    for (let [_id, cellData] of cellDetails) {
      if (cellData.rowId !== rowId) continue;
      let cellId = `${cellData.columnId},${cellData.rowId}`;
      cellIds.delete(cellId);
      removeCellById(_id);
    }

    forceUpdate();
    setContextMenuRect(null);
  };

  const handleDeleteColumn = () => {
    let columnId = selectedCell?.columnId || selectedColumn?.columnId;

    if (!columnId) return;

    for (let [_id, cellData] of cellDetails) {
      if (cellData.columnId !== columnId) continue;
      let cellId = `${cellData.columnId},${cellData.rowId}`;
      cellIds.delete(cellId);
      removeCellById(_id);
    }

    forceUpdate();
    setContextMenuRect(null);
  };

  const handleInsertColumn = (direction: IDirection) => {
    let columnId = selectedCell?.columnId || selectedColumn?.columnId;

    if (!columnId) return;

    for (let [_id, cellData] of cellDetails) {
      if (
        direction === "right"
          ? cellData.columnId <= columnId
          : cellData.columnId < columnId
      )
        continue;

      let oldCellId = `${cellData.columnId},${cellData.rowId}`;
      let newColumnId = cellData.columnId + 1;
      let newCellId = `${newColumnId},${cellData.rowId}`;

      cellIds.delete(oldCellId);
      cellIds.set(newCellId, _id);

      let columnData = getColumnById(cellData.columnId);

      if (columnData) {
        removeColumnById(cellData.columnId);
        setColumnById(newColumnId, columnData);
      }

      cellData.columnId = newColumnId;
    }

    forceUpdate();
    setContextMenuRect(null);
  };

  const handleInsertRow = (direction: IDirection) => {
    let rowId = selectedCell?.rowId || selectedRow?.rowId;

    if (!rowId) return;

    for (let [_id, cellData] of cellDetails) {
      if (
        direction === "bottom"
          ? cellData.rowId <= rowId
          : cellData.rowId < rowId
      )
        continue;

      let oldCellId = `${cellData.columnId},${cellData.rowId}`;
      let newRowId = cellData.rowId + 1;
      let newCellId = `${cellData.columnId},${newRowId}`;

      cellIds.delete(oldCellId);
      cellIds.set(newCellId, _id);

      let rowData = getRowById(cellData.rowId);

      if (rowData) {
        removeRowById(cellData.rowId);
        setRowById(newRowId, rowData);
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
    setActiveSearchIndex((activeIndex) => {
      activeIndex++;
      return activeIndex === highLightCellIds.length ? 0 : activeIndex;
    });
  };

  const handleSearchPrevious = () => {
    setActiveSearchIndex((activeIndex) => {
      activeIndex--;
      return activeIndex < 0 ? highLightCellIds.length - 1 : activeIndex;
    });
  };

  const handleSearchSheet = (q: string) => {
    setHighLightCellIds(["1,1", "2,5", "4,5", "5,1", "2,2"]);
  };

  const context: ISheetContext = {
    quill,
    grid,
    config,
    editCell,
    selectedCell,
    selectedColumn,
    selectedRow,
    contextMenuRect,
    isSyncNeeded,
    isLoading,
    activeSearchIndex,
    highLightCellIds,
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
    handleSearchNext,
    handleSearchPrevious,
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
