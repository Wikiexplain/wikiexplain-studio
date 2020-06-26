import React, { Component } from "react"  
import { Index } from "elasticlunr"  
import { Link } from "gatsby"  
import styled from "@emotion/styled"
import { Search, ArrowBack } from '@styled-icons/material'

export default class SearchBox extends Component {  
  state = {  
    query: ``,  
    results: []  
 }  
  render() {
    return (
      <>
      <SearchBar className="search-bar">
        <SearchIcon className="search-bar-search-icon"/>
        <SearchStyledButton className="search-bar-arrow-back" onClick={this.clickArrowBack}>
          <ArrowBack />
        </SearchStyledButton>
        <input className="omnisearch" type="text" value={this.state.query} onChange={this.search} />
        <ul className="searchResults">  
          {this.state.results.map(page => (
            <li key={page.id}>  
              <Link to={page.path}>{page.title}</Link>
            </li>  
          ))}  
        </ul>
      </SearchBar>
      <SearchStyledButton className="search-bar-search-button" onClick={this.clickSeachButton}>
        <Search />
      </SearchStyledButton>
      </>  
    )  
  }  
  
  getOrCreateIndex = () => {  
    return this.index  
      ? this.index  
      : // Create an elastic lunr index and hydrate with graphql query results  
      Index.load(this.props.searchIndex)  
  }  
  
  clickSeachButton = evt => {
    const omnisearch = document.querySelector('.search-bar')
    const arrowBack = document.querySelector('.search-bar-arrow-back')
    const searchButton = document.querySelector('.search-bar-search-button')
    omnisearch.style.width = "100%"
    omnisearch.style.display = "inline-block"
    arrowBack.style.display = "inline"
    searchButton.style.display = "none"
  }

  clickArrowBack = evt => {
    const omnisearch = document.querySelector('.search-bar')
    const arrowBack = document.querySelector('.search-bar-arrow-back')
    const searchButton = document.querySelector('.search-bar-search-button')
    omnisearch.style.display = "none"
    arrowBack.style.display = "none"
    searchButton.style.display = "inline-block"
  }

  search = evt => this.searchIndex(evt.target.value)

  searchIndex = query => {
    this.index = this.getOrCreateIndex()  
    this.setState({  
      query,  
      // Query the index with search string to get an \[\] of IDs  
      results: this.index  
        .search(query, { expand: true })  
        // Map over each ID and return the full document  
        .map(({ ref }) => {  
          return this.index.documentStore.getDoc(ref)  
        }),  
    })  
  }  
}
export const SearchStyledButton = styled(({ children, ...styleProps }) => {
  return (
    <button {...styleProps}>
      <span>{children}</span>
    </button>
  )
})`
  position: relative;
  padding: 0;
  border: 0;
  background: transparent;
  align-self: stretch;
  text-transform: uppercase;
  color: inherit;
  opacity: 0.5;
  overflow: visible;
  z-index: 5;

  cursor: pointer;
  line-height: 1;
  align-self: stretch;
  text-transform: uppercase;
  opacity: 0.5;
  overflow: visible;
  transition: all 150ms ${p => p.theme.easing};
  display: none;
  @media (max-width: 600px) {
    &.search-bar-search-button {
      display: inline-block;
    }
    &.search-bar-arrow-back {
      display: none;
      position: absolute;
      color: grey;
      left: 1rem;
      top: 0.8rem;
    }
  }
  span {
    color: red;
    width: 2rem;
  }
`
export const SearchIcon = styled(({ ...styleProps }) => {
  return (
    <i {...styleProps}>
      <Search />
    </i>
  )
})`
  position: absolute;
  width: 1.2rem;
  color: grey;
  left: 1rem;
  bottom: -0.6rem;
  display: initial;
  @media (max-width: 600px) {
    display: none;
  }
`

export const SearchBar = styled.div`
  width: 50%;
  min-width: 400px;
  max-width: 768px;
  padding-top: 2px;
  padding-bottom: 2px;
  left: 0;
  right: 0;
  margin: auto 9.5%;
  z-index: 1;
  display: flex;
  position: relative;

  @media (max-width: 600px) {
    display: none;
    height: 52px;
    position: fixed;
    margin: 0;
    top: -6px;
  }
  input {
    overflow: visible;
    text-overflow: var(--ytcp-font-yt-title1_-_text-overflow);
    font-family: 'YT Sans', 'Roboto', 'Arial', sans-serif;
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;
    width: 100%;
    height: 2rem;
    line-height: 18px;
    outline: none;
    box-sizing: border-box;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-right: none;
    border-radius: 2px 0 0 2px;
    color: #111111;
    padding: 2px 2px 2px 3rem;
    @media (max-width: 600px) {
      height: 100%;
    }
}
ul{
    position: absolute;
    background: white;
    top: 42px;
    width: 100%;
    text-align: left;
    padding-left: 1.4rem;
    padding-right: 1rem;
}
`