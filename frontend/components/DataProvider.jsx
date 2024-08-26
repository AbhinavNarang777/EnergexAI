import React, { createContext, useContext, useMemo, useState } from "react"

const defaultContext = {
  actualData: "",
  setActualData: () => {},
}

const ActiveAuthContext = createContext(defaultContext)

export const ActiveAuthProvider = ({ children }) => {
  const [actualData, setActualData] = useState(defaultContext.actualData)

  const value = useMemo(
    () => ({
      actualData,
      setActualData,
    }),
    [actualData,setActualData]
  )

  return (
    <ActiveAuthContext.Provider value={value}>
      {children}
    </ActiveAuthContext.Provider>
  )
}

export const useActiveAuthContext = () => useContext(ActiveAuthContext)
