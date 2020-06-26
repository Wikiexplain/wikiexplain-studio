import React from "react"  
import { graphql, StaticQuery } from "gatsby"  
import Search from "./SearchBox"  
import { isLoggedIn } from "../utils/auth"

export default () => {
  if (!isLoggedIn()) {
    return null
  }
  return (  
    <StaticQuery  
      query={graphql`  
          query SearchIndexQuery {  
            siteSearchIndex {  
              index  
            }  
          }  
        `}  
      render={data => (  
        <Search searchIndex={data.siteSearchIndex.index}/>  
      )}  
    />  
  )  
}