import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  GroupingState,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'


import {
  Checkbox,
  Button,
  MenuItem,
  Menu,
  IconButton,
  Toolbar,
  Box,
  Tooltip
} from '@mui/material';


import {
  ViewWeekOutlined as ViewWeekOutlinedIcon,
  ShuffleOutlined as ShuffleOutlinedIcon

} from "@mui/icons-material"
import { useSkipper } from './hooks'

import {
  columns,
  defaultColumn,
  fuzzyFilter,
  getTableMeta,
} from './tableModels'
import DebouncedInput from './components/DebouncedInput'
import ActionButtons from './components/ActionButtons'
import { faker } from '@faker-js/faker'
import CustomTable from './components/CustomTable'
import { Records } from "./constants";
export interface IPerson {
  firstName: string
  lastName: string
  age: number
  status: 'relationship' | 'complicated' | 'single'
}




export const App = () => {
  const rerender = React.useReducer(() => ({}), {})[1]
  const [data, setData] = React.useState(Records as IPerson[])
  const refreshData = () => setData(Records as IPerson[])

  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnPinning, setColumnPinning] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    autoResetPageIndex,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    // Provide our updateData function to our table meta
    meta: getTableMeta(setData, skipAutoResetPageIndex),
    state: {
      grouping,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnPinning,
      rowSelection,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map(d => d.id))
    )
  }

  const toMenu = () => {
    return (<>
      <Tooltip title="Column visibility">
        <IconButton onClick={handleClick}>
          <ViewWeekOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        elevation={2}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem className="menu">
          <Checkbox
            size='small'
            checked={table.getIsAllColumnsVisible()}
            onChange={table.getToggleAllColumnsVisibilityHandler()}
          // indeterminate={false}
          />
          Toggle All
        </MenuItem>

        {table.getAllLeafColumns().map(column => {
          return (
            <MenuItem className="menu">
              <Checkbox
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                size='small'
              />
              {column.id}
            </MenuItem>
          )
        })}
      </Menu>
    </>);
  }

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
        <DebouncedInput value={globalFilter ?? ''} onChange={value => setGlobalFilter(String(value))} />
        {toMenu()}
        <Tooltip title="Shuffle all columns">
          <IconButton onClick={randomizeColumns} >
            <ShuffleOutlinedIcon />
          </IconButton>
        </Tooltip>

      </Box>
      <CustomTable
        table={table}
        tableGroup={undefined}
      />
      <div className="p-2" />
      <ActionButtons
        getSelectedRowModel={table.getSelectedRowModel}
        hasNextPage={table.getCanNextPage()}
        hasPreviousPage={table.getCanPreviousPage()}
        nextPage={table.nextPage}
        pageCount={table.getPageCount()}
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        previousPage={table.previousPage}
        refreshData={refreshData}
        rerender={rerender}
        rowSelection={rowSelection}
        setPageIndex={table.setPageIndex}
        setPageSize={table.setPageSize}
        totalRows={table.getPrePaginationRowModel().rows.length}
      />
      {/* <pre>{JSON.stringify(table.getState(), null, 2)}</pre> */}
    </div>
  )
}

export default App
