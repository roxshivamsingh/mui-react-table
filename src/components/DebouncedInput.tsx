
import React from 'react'

import {

  InputAdornment,
  IconButton,
  Input,
  InputBase,
  TextField,
  Box,
  Paper
} from "@mui/material"
import { Search as SearchIcon } from '@mui/icons-material';

type Props = {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

export const DebouncedInput: React.FC<Props> = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = React.useState<number | string>(initialValue)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])


  return (<>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: "center",
      flexDirection: "row",
      textAlign: "center",
      border: "solid 1px #c0c0c0",
      width: "10rem",
      borderRadius: "1rem"
    }}>
      <IconButton
        disableRipple
      >
        <SearchIcon />
      </IconButton>
      <TextField id="input-with-sx" placeholder="Search"
        variant="standard"
        InputProps={{ disableUnderline: true }}
        // value={value}
        onChange={handleInputChange}
      />
    </Box>
  </>
  )
}

export default DebouncedInput
