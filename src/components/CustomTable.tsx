import {
  flexRender,
  HeaderGroup,
  Row,
  RowData,
  Table,
} from '@tanstack/react-table'
import React from 'react'
import Filter from './Filter'
import TablePins from './TablePins'

import {
  Table as MuiBaseTable,
  TableRow,
  TableBody,
  TableHead,
  TableContainer,
  Paper,
  TableCell,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";


import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  PushPinOutlined as PushPinOutlinedIcon,
  SortOutlined as SortOutlinedIcon,
  TrendingFlat as TrendingFlatIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  ArrowRightAlt as ArrowRightAltIcon
} from "@mui/icons-material";

type TableGroup = 'center' | 'left' | 'right'

function getTableHeaderGroups<T extends RowData>(
  table: Table<T>,
  tg?: TableGroup
): [HeaderGroup<T>[], HeaderGroup<T>[]] {
  if (tg === 'left') {
    return [table.getLeftHeaderGroups(), table.getLeftFooterGroups()]
  }

  if (tg === 'right') {
    return [table.getRightHeaderGroups(), table.getRightFooterGroups()]
  }

  if (tg === 'center') {
    return [table.getCenterHeaderGroups(), table.getCenterFooterGroups()]
  }

  return [table.getHeaderGroups(), table.getFooterGroups()]
}

function getRowGroup<T extends RowData>(row: Row<T>, tg?: TableGroup) {
  if (tg === 'left') return row.getLeftVisibleCells()
  if (tg === 'right') return row.getRightVisibleCells()
  if (tg === 'center') return row.getCenterVisibleCells()
  return row.getVisibleCells()
}

type Props<T extends RowData> = {
  table: Table<T>
  tableGroup?: TableGroup
}

export function CustomTable<T extends RowData>({
  table,
  tableGroup,
}: Props<T>) {
  const [headerGroups, footerGroup] = getTableHeaderGroups(table, tableGroup)
  const [columnAnchorEl, setColumnAnchorEl] = React.useState({});
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, i: number) => {
    setColumnAnchorEl({ ...columnAnchorEl, [i]: event.currentTarget })
  };
  const handleClose = (i: number) => {
    setColumnAnchorEl([]);
  };

  console.log((columnAnchorEl))
  return (
    <TableContainer component={Paper}>
      <MuiBaseTable>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => (
                <TableCell
                  // className="relative"
                  key={header.id}
                // style={{ width: header.getSize() }}
                // colSpan={header.colSpan}
                >
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClick(event, i)}>
                        {Boolean(columnAnchorEl[i]) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      <Menu
                        elevation={2}
                        id="basic-menu"
                        anchorEl={columnAnchorEl[i]}
                        open={Boolean(columnAnchorEl[i])}
                        onClose={() => { handleClose(i) }}
                        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                      >
                        <MenuItem onClick={() => { }}>
                          {header.column.getCanGroup() ? (
                            <button
                              onClick={header.column.getToggleGroupingHandler()}
                              style={{ cursor: 'pointer' }}>

                              <PushPinOutlinedIcon />
                              {header.column.getIsGrouped()
                                ? `Unpin(${header.column.getGroupedIndex()})`
                                : `Pin`}
                            </button>
                          ) : null}
                        </MenuItem>
                        <MenuItem onClick={() => { }}>

                          <SortOutlinedIcon />
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                          // className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                          >
                            {{
                              asc: 'Sort By DESC',
                              desc: 'Sort By DEFAULT',
                            }[header.column.getIsSorted() as string] ?? 'Sort By ASC'}
                          </button>
                        </MenuItem>
                        <MenuItem onClick={() => { }}>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </MenuItem>
                        {/* <MenuItem onClick={() => { }}> */}
                        <div onMouseDown={header.getResizeHandler()} onTouchStart={header.getResizeHandler()} />
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <TablePins isPinned={header.column.getIsPinned()} pin={header.column.pin} />
                        )}
                        {/* </MenuItem> */}
                      </Menu>
                    </>
                  )}

                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {getRowGroup(row, tableGroup).map(cell => (
                <TableCell
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

      </MuiBaseTable>

    </TableContainer>

  )
}

export default CustomTable
