import {
  ColumnDef,
  FilterFn,
  SortingFn,
  sortingFns,
} from '@tanstack/react-table'

import React, { useState, Dispatch, useEffect, SetStateAction } from 'react'

import {
  rankItem,
  compareItems,
  RankingInfo,
} from '@tanstack/match-sorter-utils'

import IndeterminateCheckbox from './components/InderterminateCheckbox'

export interface IPerson {
  firstName: string
  lastName: string
  age: number
  status: 'relationship' | 'complicated' | 'single'
}
export const fuzzyFilter: FilterFn<IPerson> = (
  row,
  columnId,
  value,
  addMeta
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the ranking info
  addMeta(itemRank)

  // Return if the item should be filtered in/out
  return itemRank.passed
}

export const fuzzySort: SortingFn<IPerson> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]! as RankingInfo,
      rowB.columnFiltersMeta[columnId]! as RankingInfo
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export type TableMeta = {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
}

// Give our default column cell renderer editing superpowers!
export const defaultColumn: Partial<ColumnDef<IPerson>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      ; (table.options.meta as TableMeta).updateData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return (
      <input
        value={value as string}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
      />
    )
  },
}

export const columns: ColumnDef<IPerson>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <IndeterminateCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <div >
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </div>
    ),
  },
  {
    accessorKey: 'firstName',
    header: "First Name",
    cell: info => info.getValue(),
    footer: props => props.column.id,
  },
  {
    accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: props => props.column.id,
  },
  {
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Full Name',
    cell: info => info.getValue(),
    footer: props => props.column.id,
    filterFn: fuzzyFilter,
    sortingFn: fuzzySort,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: props => props.column.id,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    footer: props => props.column.id,
  }

]

export const getTableMeta = (
  setData: Dispatch<SetStateAction<IPerson[]>>,
  skipAutoResetPageIndex: () => void
) =>
({
  updateData: (rowIndex, columnId, value) => {
    // Skip age index reset until after next rerender
    skipAutoResetPageIndex()
    setData(old =>
      old.map((row, index) => {
        if (index !== rowIndex) return row

        return {
          ...old[rowIndex]!,
          [columnId]: value,
        }
      })
    )
  },
} as TableMeta)
