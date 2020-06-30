import React, { Component, useState, useRef, useEffect } from "react"  
import { Index } from "elasticlunr"  
import { Link } from "gatsby"  
import styled from "@emotion/styled"
import { Search, ArrowBack } from '@styled-icons/material'
import { getUser } from "../../utils/auth"

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
        <Search className="search-icon" />
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
    arrowBack.style.display = "flex"
    searchButton.style.display = "none"
  }

  clickArrowBack = evt => {
    const omnisearch = document.querySelector('.search-bar')
    const arrowBack = document.querySelector('.search-bar-arrow-back')
    const searchButton = document.querySelector('.search-bar-search-button')
    omnisearch.style.display = "none"
    arrowBack.style.display = "none"
    searchButton.style.display = "flex"
  }

  search = evt => this.searchIndex(evt.target.value)

  searchIndex = query => {
    const user = getUser();
    const { email } = user;
    const approvedEmails = ['example-article@wikiexplain.com', email]
    this.index = this.getOrCreateIndex()  
    this.setState({  
      query,  
      // Query the index with search string to get an \[\] of IDs  
      results: this.index  
        .search(query, { expand: true })  
        // Map over each ID and return the full document  
        .map(({ ref }) => {  
          return this.index.documentStore.getDoc(ref)
        })
        .filter(doc => {
          return approvedEmails.includes(doc.email)
        }),  
    })  
  }  
}

export const SearchStyledButton = styled(({ children, ...styleProps }) => {
  return (
    <button {...styleProps}>
      <i>{children}</i>
    </button>
  )
})`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-transform: uppercase;
  color: #555;
  transition: all 150ms cubic-bezier(0.215,0.610,0.355,1.000);
  flex: 1 1;
  flex-direction: column;
  align-items: center;
  margin-right: 14px;
  margin-bottom: 0.3rem;
  display: none;
  i {
    flex: 1 1;
    padding-top: 0.8rem;
    padding-bottom: 0.2rem;
    transition: all 0.25s linear;
    width: 32px;
    line-height: 1;

  }
  &.search-bar-arrow-back {
    display: none;
  }
  @media (min-width: 1200px) {
    display: none;
  }
  @media (max-width: 600px) {
    &.search-bar-search-button {
      display: flex;
    }
    &.search-bar-arrow-back {
      display: none;
      position: absolute;
      color: #555;
      left: 1rem;
      top: 0.7rem;
      i {
        width: 1.2rem;
      }
    }
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
  bottom: 0.4rem;
  display: initial;
  @media (max-width: 600px) {
    display: none;
  }
`

const getWidth = () => window.innerWidth 
|| document.documentElement.clientWidth 
|| document.body.clientWidth;
export const useOnWindowResize = (ref) => {
    useEffect(() => {
      const resizeSearchBar = width => {
        const searchBar = document.getElementsByClassName('search-bar')[0]
        const searchBarArrowBack = document.getElementsByClassName('search-bar-arrow-back')[0]
        const searchBarButton = document.getElementsByClassName('search-bar-search-button')[0]
        if (width >= 1200) {
          //Reset mobile css
          searchBar.style.display = "flex"
          searchBarArrowBack.style.display = "none"
          searchBarButton.style.display = "none"
        } else if (width <= 600) {
          searchBar.style.display = "none"
          searchBarArrowBack.style.display = "none"
          searchBarButton.style.display = "flex"
        }
      }
      // timeoutId for debounce mechanism
      let timeoutId = null;
      const resizeListener = () => {
        // prevent execution of previous setTimeout
        clearTimeout(timeoutId);
        // change width from the state object after 150 milliseconds
        timeoutId = setTimeout(() => resizeSearchBar(getWidth()), 150);

      };
      // set resize listener
      window.addEventListener('resize', resizeListener);

      // clean up function
      return () => {
        // remove resize listener
        window.removeEventListener('resize', resizeListener);
      }
    }, [ref]);
}
export const SearchBar = styled(({ children, ...styleProps }) => {
  const wrapperRef = useRef(null);
  useOnWindowResize(wrapperRef);
  return(
    <div { ...styleProps } ref={wrapperRef}>{children}</div>
  )
})`
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
  height: initial;
  @media (min-width: 1200px) {
    display: flex;
  }
  @media (max-width: 600px) {
    display: none;
    height: 70px;
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