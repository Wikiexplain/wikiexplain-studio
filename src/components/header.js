import React from "react"
import { Wrapper } from "./style"
import { Coffee } from "styled-icons/boxicons-regular"
import styled, { css } from "styled-components"
import { transparentize } from "polished"
import { Nav } from "./nav"
import { ThemeContext } from "./theme"
import { Link } from "gatsby"

export const Header = styled(({ siteTitle, createPostButton, ...styleProps }) => {
  return (
    <ThemeContext.Consumer>
      {({ toggleDarkMode, isDarkMode, theme }) => (
        <header {...styleProps}>
          <HeaderWrapper>
            <SiteTitle>
              <SiteLink to="/">
                <Coffee />
                {siteTitle}
              </SiteLink>
            </SiteTitle>
            <Nav toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} createPostButton={createPostButton}/>
          </HeaderWrapper>
        </header>
      )}
    </ThemeContext.Consumer>
  )
})`
  position: absolute;
  z-index: 100;
  width: 100%;
  top: 0;
`

export const SiteLink = styled(Link)`
  position: relative;
  line-height: 3rem;
  display: flex;
  align-items: center;
  align-self: stretch;
  color: #555 !important;
  text-decoration: none;
  margin: 0;
  transition: all 150ms ${p => p.theme.easing};
  z-index: 1;
  svg {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
    fill: currentColor;
  }
  &:after {
    content: "";
    position: absolute;
    display: block;
    top: 0;
    left: -1rem;
    width: calc(100% + 2rem);
    height: 100%;
    background-color: ${props => props.theme.color.primary};
    opacity: 0;
    transition: all 150ms ${p => p.theme.easing};
    z-index: -1;
  }

  &:focus-visible {
    &:after {
      opacity: 0.5;
    }
  }
`

export const SiteTitle = styled.h1`
  margin: 0;
  flex: 0 0 auto;
  font-size: 1rem;
  align-self: stretch;
  display: flex;
`

export const HeaderWrapper = styled(Wrapper)`
  display: flex;
  align-self: stretch;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: none;
  background: linear-gradient(90deg,#61c1ff,#ef8181);
  margin-bottom: 0;
  box-shadow: 0 .25rem 1.25rem var(--text-color);
  z-index: 10;
  --bg1: #fff;
  --bg2: #fafafa;
  --bg3: #fcfcfc;
  --bg4: #f8f8f8;
  --invert1: #282c35;
  --invert2: #f9ffee;
  --text-color: #555;
  --link: var(--text-color);
  --post-content-link: #d32f2f;
  --subtle-top1: #61c1ff;
  --subtle-top2: #ef8181;
  --subtle-h1-1: #ef9a9a;
  --subtle-h1-2: #e53935;
  --subtle-h1-3: #b71c1c;
  --header-h2: #008f83;
  --hover-top: #61c1ff;
  --hover-top-icon: #df1c31;
  --post-card-hover: var(--black);
  --category-border: #757575;
  --tag-border: #212121;
  --warning: #e75b7e;
  --info: #6200ee;
`
