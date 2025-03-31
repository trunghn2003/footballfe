import { GridProps } from '@mui/material'

declare module '@mui/material/Grid' {
  interface GridProps {
    item?: boolean
  }
}
