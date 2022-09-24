import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"

const  Weibo = () => {
  /*
  * This how you use canisters throughout your app.
  */
  const [weibo] = useCanister("weibo")
  const [id, setId] = useState<string>()

  const refreshCounter = async () => {
    let freshCount:string = await weibo.getId() as string
    setId(freshCount)
  }

  const increment = async () => {
    await weibo.getId()
    await refreshCounter()
  }

  useEffect(() => {
    if (!id) {
      return
    }
    refreshCounter()
  }, [id])

  return (
    <div className="example">
      <p style={{ fontSize: "2.5em" }}>{id}</p>
      <button className="connect-button" onClick={increment}>+</button>
    </div>
  )
}

export { Weibo }