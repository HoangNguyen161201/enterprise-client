import { NextLayout } from "../../models/layoutType"

export const EmptyLayout: NextLayout = ({children})=> {
  return (
    <div>
        {children}
    </div>
  )
}