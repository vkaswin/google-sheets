import { useState, MouseEvent, Fragment } from "react";
import ToolBar from "./ToolBar";
import Canvas from "./Canvas";
import HighlightCell from "./HighLightCell";
import EditCell from "./EditCell";
import ColumnResizer from "./ColumnResizer";
import RowResizer from "./RowResizer";
import SeachBox from "./SearchBox";
import HighLightSearch from "./HighLightSearch";
import HighLightColumn from "./HighLightColumn";
import HighLightRow from "./HighLightRow";
import ColumnOverLay from "./ColumnOverLay";
import RowOverLay from "./RowOverLay";
import ContextMenu from "./ContextMenu";
import SheetProvider from "@/context/SheetContext";
import useSheet from "@/hooks/useSheet";
import Loader from "./Loader";

const Grid = () => {
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  const [highLightCellIds, setHighLightCellIds] = useState<string[]>([]);

  const [showSearch, setShowSearch] = useState(false);

  const {
    quill,
    grid,
    config,
    editCell,
    selectedCell,
    selectedRow,
    selectedColumn,
    contextMenuRect,
    isLoading,
    handleResizeColumn,
    handleResizeRow,
    handleDeleteCell,
    handleDeleteColumn,
    handleDeleteRow,
    handleInsertColumn,
    handleInsertRow,
    handleCopyCell,
    handleCutCell,
    handlePasteCell,
    setEditCell,
    setSelectedCellId,
    setSelectedColumnId,
    setSelectedRowId,
    setContextMenuRect,
  } = useSheet();

  const [gridRef, setGridRef] = useState<HTMLDivElement | null>(null);

  const handleClickGrid = (event: MouseEvent<HTMLDivElement>) => {
    if (!gridRef) return;

    let x = event.pageX;
    let y = event.pageY - gridRef.getBoundingClientRect().top;

    let cellId = getCellIdByCoordiantes(x, y);

    if (!cellId) return;

    setSelectedCellId(cellId);
    setEditCell(null);
    setSelectedColumnId(Infinity);
    setSelectedRowId(Infinity);
    setContextMenuRect(null);
  };

  const getCellIdByCoordiantes = (x: number, y: number) => {
    let left = 0;
    let right = grid.rows.length - 1;
    let rowId = null;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);

      if (grid.rows[mid].y <= y) {
        left = mid + 1;
        rowId = grid.rows[mid].rowId;
      } else {
        right = mid - 1;
      }
    }

    if (!rowId) return null;

    left = 0;
    right = grid.columns.length - 1;
    let columnId = null;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);

      if (grid.columns[mid].x <= x) {
        left = mid + 1;
        columnId = grid.columns[mid].columnId;
      } else {
        right = mid - 1;
      }
    }

    if (!columnId) return null;

    return `${columnId},${rowId}`;
  };

  const handleDoubleClickCell = () => {
    if (!gridRef || !selectedCell || !quill) return;

    let { columnId, cellId, width, height, rowId, x, y } = selectedCell;

    let { top } = gridRef.getBoundingClientRect();

    setEditCell({
      cellId,
      columnId,
      width,
      height,
      rowId,
      x: Math.max(config.colWidth, x),
      y: Math.max(config.rowHeight + top, y + top),
    });
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleClickGrid(event);
    setContextMenuRect({ x: event.pageX, y: event.pageY });
  };

  const handleClickColumn = (columnId: number) => {
    setSelectedColumnId(columnId);
    setSelectedRowId(Infinity);
    setSelectedCellId("");
    setEditCell(null);
    setContextMenuRect(null);
  };

  const handleClickRow = (rowId: number) => {
    setSelectedRowId(rowId);
    setSelectedColumnId(Infinity);
    setSelectedCellId("");
    setEditCell(null);
    setContextMenuRect(null);
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

  const handleSearchSheet = (text: string) => {
    setHighLightCellIds(["1,1", "2,5", "4,5", "5,1", "2,2"]);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setHighLightCellIds([]);
  };

  return (
    <Fragment>
      <ToolBar />
      <div
        ref={setGridRef}
        className="relative w-[var(--grid-width)] h-[var(--grid-height)] select-none overflow-hidden"
        onClick={handleClickGrid}
        onContextMenu={handleContextMenu}
      >
        {isLoading ? <Loader /> : <Canvas gridRef={gridRef} />}
        {selectedColumn && <HighLightColumn selectedColumn={selectedColumn} />}
        {selectedRow && <HighLightRow selectedRow={selectedRow} />}
        <div className="absolute left-[var(--col-width)] top-[var(--row-height)] w-[calc(100%-var(--col-width))] h-[calc(100%-var(--row-height))] overflow-hidden">
          {!editCell && selectedCell && (
            <HighlightCell
              selectedCell={selectedCell}
              onDoubleClick={handleDoubleClickCell}
            />
          )}
          {selectedColumn && <ColumnOverLay selectedColumn={selectedColumn} />}
          {selectedRow && <RowOverLay selectedRow={selectedRow} />}
          {!!highLightCellIds.length && (
            <HighLightSearch
              activeIndex={activeSearchIndex}
              visibleCells={grid.cells}
              cellIds={highLightCellIds}
            />
          )}
        </div>
        <ColumnResizer
          columns={grid.columns}
          onClick={handleClickColumn}
          onResize={handleResizeColumn}
        />
        <RowResizer
          rows={grid.rows}
          onClick={handleClickRow}
          onResize={handleResizeRow}
        />
      </div>
      <EditCell />
      {showSearch && (
        <SeachBox
          count={highLightCellIds.length}
          activeIndex={activeSearchIndex}
          onNext={handleSearchNext}
          onPrevious={handleSearchPrevious}
          onSearch={handleSearchSheet}
          onClose={handleCloseSearch}
        />
      )}
      {contextMenuRect && (
        <ContextMenu
          rect={contextMenuRect}
          onCopy={handleCopyCell}
          onCut={handleCutCell}
          onPaste={handlePasteCell}
          onDeleteCell={handleDeleteCell}
          onDeleteColumn={handleDeleteColumn}
          onDeleteRow={handleDeleteRow}
          onInsertColumn={handleInsertColumn}
          onInsertRow={handleInsertRow}
        />
      )}
    </Fragment>
  );
};

const GridWrapper = () => {
  return (
    <SheetProvider>
      <Grid />
    </SheetProvider>
  );
};

export default GridWrapper;
