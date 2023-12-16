import {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Quill from "quill";
import { toast } from "react-toastify";
import { config } from "@/constants";
import { debounce } from "@/utils";
import { getSheetById, updateSheetById } from "@/services/Sheet";
import {
  createGrid,
  getGridById,
  searchGrid,
  removeGridById,
  updateGridById,
  duplicateGridById,
} from "@/services/Grid";
import { createColumn, updateColumnById } from "@/services/Column";
import { createRow, updateRowById } from "@/services/Row";
import {
  copyPasteCell,
  createCell,
  duplicateCells,
  insertColumn,
  updateCellById,
  deleteCellById,
  deleteColumn,
  deleteRow,
  insertRow,
} from "@/services/Cell";

type ISheetContext = {
  quill: Quill | null;
  grid: IGrid;
  scale: number;
  sheetDetail: ISheetDetail | null;
  editCell: ICell | null;
  syncState: number;
  selectedCell: ICell | null;
  selectedRow: IRow | null;
  selectedColumn: IColumn | null;
  contextMenuRect: Pick<IRect, "x" | "y"> | null;
  isSheetLoading: boolean;
  isGridLoading: boolean;
  highLightCells: string[];
  copiedCell: ICell | null;
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
  handleDeleteGrid: (index: number, gridId: string) => void;
  handleSearchNext: () => void;
  handleSearchPrevious: () => void;
  handleFormatCell: (type: string, value: string) => void;
  handleCreateGrid: () => void;
  handleSearchSheet: (q: string) => void;
  handleAutoFillCell: (data: IAutoFillData) => void;
  handleScaleChange: (scale: number) => void;
  handleDuplicateGrid: (gridId: string) => void;
  handleUpdateGrid: (
    index: number,
    gridId: string,
    data: Partial<ISheetGrid>
  ) => void;
  setGrid: Dispatch<SetStateAction<IGrid>>;
  setScale: Dispatch<SetStateAction<number>>;
  setContextMenuRect: Dispatch<SetStateAction<Pick<IRect, "x" | "y"> | null>>;
  setEditCell: Dispatch<SetStateAction<ICell | null>>;
  setSelectedCellId: Dispatch<SetStateAction<string | null>>;
  setSelectedRowId: Dispatch<SetStateAction<number | null>>;
  setCopyCellId: Dispatch<SetStateAction<string | null>>;
  setSelectedColumnId: Dispatch<SetStateAction<number | null>>;
};

type ISheetProviderProps = {
  children: ReactNode;
};

const SheetContext = createContext({} as ISheetContext);

export const SheetProvider = ({ children }: ISheetProviderProps) => {
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

  const [isSheetLoading, setIsSheetLoading] = useState(true);

  const [isGridLoading, setIsGridLoading] = useState(true);

  const [sheetDetail, setSheetDetail] = useState<ISheetDetail | null>(null);

  const [scale, setScale] = useState(1);

  const [grid, setGrid] = useState<IGrid>({
    cells: [],
    columns: [],
    rows: [],
  });

  const [copyCellId, setCopyCellId] = useState<string | null>(null);

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

  const copiedCell = useMemo(() => {
    let cell = grid.cells.find(({ cellId }) => cellId === copyCellId);
    return cell || null;
  }, [grid.cells, copyCellId]);

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
    registerQuillFormat();
  }, []);

  useEffect(() => {
    getSheetDetails();
  }, [sheetId]);

  useEffect(() => {
    getGridDetails();
  }, [gridId]);

  useEffect(() => {
    return handleEditCellChange();
  }, [editCell]);

  useEffect(() => {
    if (!quill) return;
    focusTextEditor();
  }, [quill]);

  const handleEditCellChange = () => {
    if (!editCell) return;
    let cell = getCellById(editCell.cellId);
    const quill = new Quill("#editor");
    quill.setContents(cell?.content as any);
    let handler = debounce(handleEditorChange.bind(undefined, quill), 500);
    quill.on("text-change", handler);
    setQuill(quill);
    return () => {
      quill.off("text-change", handler);
      setQuill(null);
    };
  };

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

  const registerQuillFormat = () => {
    document.body.classList.add("overflow-hidden");
    const Font = Quill.import("formats/font");
    const Size = Quill.import("attributors/style/size");
    Size.whitelist = config.fontSizes;
    Font.whitelist = config.customFonts;
    Quill.register(Font, true);
    Quill.register(Size, true);
  };

  const getSheetDetails = async () => {
    if (!sheetId) return;

    setIsSheetLoading(true);

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

      if (!gridId) {
        navigate(
          { search: `gridId=${grids[0]._id}` },
          { replace: !sheetDetail }
        );
      }

      setIsSheetLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const getGridDetails = async () => {
    if (!gridId) return;

    resetGrid();

    try {
      let {
        data: {
          data: { cells, columns, rows },
        },
      } = await getGridById(gridId);
      setGridDetails(rows, columns, cells);
      forceUpdate();
      setIsGridLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const setCellDetails = (cells: ICellDetail[]) => {
    for (let cell of cells) {
      setCellById(cell);
    }
  };

  const setRowDetails = (rows: IRowDetail[]) => {
    for (let row of rows) {
      setRowById(row);
    }
  };

  const setColumnDetails = (columns: IColumnDetail[]) => {
    for (let column of columns) {
      setColumnById(column);
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

    setRowDetails(rows);
    setColumnDetails(columns);
    setCellDetails(cells);
  };

  const resetGrid = () => {
    setIsGridLoading(true);
    setEditCell(null);
    setContextMenuRect(null);
    setSelectedCellId(null);
    setSelectedColumnId(null);
    setSelectedRowId(null);
    setActiveHighLightIndex(null);
    setHighLightCells([]);
    setGrid({ cells: [], columns: [], rows: [] });
  };

  const handleEditorChange = async (quill: Quill) => {
    if (!editCell || !gridId) return;

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
        setCellById(body);
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

      let cellData = getCellById(selectedCell.cellId);

      let body: Partial<ICellDetail> = {};
      if (isBackground) body.background = value;

      if (cellData) {
        await updateCellById(cellData._id, body);

        if (isBackground) cellData.background = value;

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
        setCellById(body as ICellDetail);
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

  const setCellById = (cell: ICellDetail) => {
    let cellId = `${cell.columnId},${cell.rowId}`;
    cellIds.current.set(cellId, cell._id);
    cellDetails.current.set(cell._id, cell);
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

  const handleDeleteCell = async () => {
    if (!selectedCell) return;

    let cellId = selectedCell.cellId;
    let cellData = getCellById(selectedCell.cellId);

    if (!cellData || !window.confirm("Are you sure to delete the cell?"))
      return;

    try {
      await deleteCellById(cellData._id);
      removeCellById(cellId);
      forceUpdate();
      setContextMenuRect(null);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleDeleteRow = async () => {
    if (!gridId || !window.confirm("Are you sure to delete the row?")) return;

    let rowId = selectedCell?.rowId || selectedRow?.rowId;

    if (!rowId) return;

    try {
      await deleteRow(gridId, rowId);

      for (let [_, cellData] of cellDetails.current) {
        if (cellData.rowId !== rowId) continue;
        let cellId = `${cellData.columnId},${cellData.rowId}`;
        removeCellById(cellId);
      }

      forceUpdate();
      setContextMenuRect(null);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleDeleteColumn = async () => {
    if (!gridId || !window.confirm("Are you sure to delete the column?"))
      return;

    let columnId = selectedCell?.columnId || selectedColumn?.columnId;

    if (!columnId) return;

    try {
      await deleteColumn(gridId, columnId);

      for (let [_, cellData] of cellDetails.current) {
        if (cellData.columnId !== columnId) continue;
        let cellId = `${cellData.columnId},${cellData.rowId}`;
        removeCellById(cellId);
      }

      forceUpdate();
      setContextMenuRect(null);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleInsertColumn = async (direction: IDirection) => {
    if (!gridId) return;

    let columnId = selectedCell?.columnId || selectedColumn?.columnId;

    if (!columnId) return;

    let newCellIds: { _id: string; cellId: string }[] = [];
    let newColumnIds: { _id: string; columnId: number }[] = [];

    try {
      await insertColumn(gridId, { direction, columnId });

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
        newCellIds.push({ _id, cellId: newCellId });

        let columnData = getColumnById(cellData.columnId);

        if (columnData) {
          columnIds.current.delete(columnData.columnId);
          columnData.columnId = newColumnId;
          newColumnIds.push({ _id: columnData._id, columnId: newColumnId });
        }

        cellData.columnId = newColumnId;
      }

      for (let { _id, cellId } of newCellIds) {
        cellIds.current.set(cellId, _id);
      }

      for (let { _id, columnId } of newColumnIds) {
        columnIds.current.set(columnId, _id);
      }

      forceUpdate();
      setContextMenuRect(null);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleInsertRow = async (direction: IDirection) => {
    if (!gridId) return;

    let rowId = selectedCell?.rowId || selectedRow?.rowId;

    if (!rowId) return;

    let newCellIds: { _id: string; cellId: string }[] = [];
    let newRowIds: { _id: string; rowId: number }[] = [];

    try {
      await insertRow(gridId, { direction, rowId });

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
        newCellIds.push({ _id, cellId: newCellId });

        let rowData = getRowById(cellData.rowId);

        if (rowData) {
          rowIds.current.delete(rowData.rowId);
          rowData.rowId = newRowId;
          newRowIds.push({ _id: rowData._id, rowId: newRowId });
        }

        cellData.rowId = newRowId;
      }

      for (let { _id, cellId } of newCellIds) {
        cellIds.current.set(cellId, _id);
      }

      for (let { _id, rowId } of newRowIds) {
        rowIds.current.set(rowId, _id);
      }

      forceUpdate();
      setContextMenuRect(null);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleCopyCell = () => {
    if (!selectedCell) return;
    setContextMenuRect(null);
    setCopyCellId(selectedCell.cellId);
  };

  const handleCutCell = () => {
    // console.log("cut cell");
  };

  const handlePasteCell = async () => {
    if (!copyCellId || !selectedCell || copyCellId === selectedCell.cellId)
      return;

    let cellData = getCellById(copyCellId);

    if (!cellData) {
      setCopyCellId(null);
      setContextMenuRect(null);
      return;
    }

    let [columnId, rowId] = selectedCell.cellId.split(",").map((id) => +id);

    try {
      let {
        data: {
          data: { cell },
        },
      } = await copyPasteCell(cellData._id, { rowId, columnId });

      forceUpdate();
      setCellById(cell);
      setCopyCellId(null);
      setContextMenuRect(null);
    } catch (error: any) {
      toast.error(error?.message);
    }
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

  const handleTitleChange: ISheetContext["handleTitleChange"] = async (
    title
  ) => {
    if (!sheetId || !sheetDetail) return;

    try {
      await updateSheetById(sheetId, { title });
      setSheetDetail({ ...sheetDetail, title });
    } catch (error: any) {
      toast.error(error?.message);
    }
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

  const handleAutoFillCell: ISheetContext["handleAutoFillCell"] = async (
    data
  ) => {
    if (!gridId) return;

    try {
      let {
        data: {
          data: { cells },
        },
      } = await duplicateCells(gridId, data);
      setCellDetails(cells);
      forceUpdate();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleDeleteGrid: ISheetContext["handleDeleteGrid"] = async (
    index,
    gridId
  ) => {
    if (!sheetDetail || !window.confirm("Are you sure to delete the grid?"))
      return;

    try {
      await removeGridById(gridId);
      let details = { ...sheetDetail };
      details.grids.splice(index, 1);
      setSheetDetail(details);
      navigate({
        search:
          details.grids.length === 0
            ? "/sheet/list"
            : `gridId=${details.grids[0]._id}`,
      });
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleScaleChange: ISheetContext["handleScaleChange"] = (value) => {
    let val = value / scale;
    let gridDetails = { ...grid };
    let row = gridDetails.rows[0];
    let column = gridDetails.columns[0];
    row.x *= val;
    row.y *= val;
    column.x *= val;
    column.y *= val;
    setGrid(gridDetails);
    setScale(value);
  };

  const handleUpdateGrid: ISheetContext["handleUpdateGrid"] = async (
    index,
    gridId,
    data
  ) => {
    if (!sheetDetail) return;

    try {
      await updateGridById(gridId, data);
      let details = { ...sheetDetail };
      details.grids[index] = { ...details.grids[index], ...data };
      setSheetDetail(details);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleDuplicateGrid: ISheetContext["handleDuplicateGrid"] = async (
    gridId
  ) => {
    if (!sheetDetail) return;

    try {
      let {
        data: {
          data: { grid },
        },
      } = await duplicateGridById(gridId);
      let details = { ...sheetDetail };
      details.grids.push(grid);
      navigate({ search: `gridId=${grid._id}` });
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <SheetContext.Provider
      value={{
        quill,
        grid,
        scale,
        sheetDetail,
        syncState,
        editCell,
        selectedCell,
        selectedColumn,
        selectedRow,
        contextMenuRect,
        isSheetLoading,
        isGridLoading,
        copiedCell,
        activeHighLightIndex,
        highLightCells,
        setGrid,
        setScale,
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
        handleDeleteGrid,
        handleSearchNext,
        handleSearchPrevious,
        handleTitleChange,
        handleSearchSheet,
        handleDuplicateGrid,
        handleScaleChange,
        handleUpdateGrid,
        setEditCell,
        setCopyCellId,
        setSelectedCellId,
        setSelectedColumnId,
        setSelectedRowId,
        setContextMenuRect,
        handleAutoFillCell,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};

export const useSheet = () => {
  return useContext(SheetContext);
};
