import { ColumnPinningPosition } from '@tanstack/react-table'
import React from 'react'

import { PushPinOutlined as PushPinOutlinedIcon } from "@mui/icons-material";
import { MenuItem } from "@mui/material";
type Props = {
  isPinned: ColumnPinningPosition
  pin: (position: ColumnPinningPosition) => void
}

export const TablePins: React.FC<Props> = ({ isPinned, pin }) => {
  const pinLeft = () => pin('left')
  const unPin = () => pin(false)
  const pinRight = () => pin('right')

  return (
    < >
      <MenuItem>
        {isPinned !== 'left' ? (
          <>
            <PushPinOutlinedIcon />
            <button onClick={pinLeft}>
              Pin to left
            </button>
          </>
        ) : ''}
      </MenuItem>

      <MenuItem>

        {isPinned ? (
          <>
            <PushPinOutlinedIcon />
            <button onClick={unPin}>
              Un-pin
            </button>
          </>
        ) : ''}
      </MenuItem>
      <MenuItem>
        {isPinned !== 'right' ? (
          <>
            <PushPinOutlinedIcon />
            <button onClick={pinRight}>
              Pin to right
            </button>
          </>
        ) : ''}
      </MenuItem>



    </>
  )
}

export default TablePins
