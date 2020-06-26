import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { AccountCircle } from '@styled-icons/material'
import styled, { css } from "styled-components"
import { mix, transparentize } from "polished"
import { Link } from "gatsby"
import SearchNav from './searchNav'
import { useCMS } from 'tinacms'
import { CreateContentButton } from './CreateContent'
import Status from "./Status"

export const Nav = ({ toggleDarkMode, isDarkMode, createPostButton }) => {
  const data = useStaticQuery(graphql`
    query navQuery {
      settingsJson(fileRelativePath: { eq: "/content/settings/menu.json" }) {
        ...nav
      }
    }
  `)
  const cms = useCMS()
  const [navOpen, setNavOpen] = useState(false)
  const toggleNavOpen = () => {
    setNavOpen(!navOpen)
  }


  const menu = data.settingsJson
  return (
    <>
      <StyledNavbarCenter>
        <NavItem 
          key={`search`}
          >
            <NavLink
            >
              <SearchNav key="search"/>
            </NavLink>
          </NavItem>
      </StyledNavbarCenter>
      <StyledNavbarRight>
        <NavItem 
          className="create"
          key={`create`}
          >
            <NavLink
            >
              <CreateContentButton plugin={createPostButton}/>
            </NavLink>
          </NavItem>
      <StyledNavbar navOpen={navOpen} isDarkMode={isDarkMode}>
          <NavItem key={`account`}>
            <NavLink
              to={`/app/profile`}
            >
              Account
            </NavLink>
          </NavItem>
          <NavItem key={`profile`}>
            <NavLink
            >
              <Status />
            </NavLink>
          </NavItem>
      </StyledNavbar>
      <NavToggle
        aria-label="Toggle Nav"
        onClick={toggleNavOpen}
        navOpen={navOpen}
      ></NavToggle>
      </StyledNavbarRight>
    </>
  )
}
export const StyledNavbarRight = styled.div`
  display: flex;
  align-self: stretch;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: none;
  position: relative;
  @media (max-width: ${props => props.theme.breakpoints.small}) {
    position: absolute;
    right: 0;
    .create {
      margin: 0 !important;
      padding: 0 !important;
      width: 90px;
    }
  }
`
export const StyledNavbarCenter = styled.div`
  display: flex;
  align-self: stretch;
  justify-content: space-between;
  align-items: center;
  max-width: none;
  z-index: 10;
  position: relative;
  @media (max-width: ${props => props.theme.breakpoints.small}) {
    position: absolute;
    right: 90px;
  }
`
export const StyledNavbar = styled.ul`
  color: inherit;
  @media (max-width: ${props => props.theme.breakpoints.huge}) {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate3d(0, 100%, 0);
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    opacity: 0;
    z-index: 1000;
    background-color: white;
    box-shadow: 0 1rem 2rem -0.5rem ${props => transparentize(0.5, props.theme.color.black)};
    transition: all 150ms ${p => p.theme.easing};
    pointer-events: none;
    ${props =>
      props.navOpen &&
      css`
        opacity: 1;
        pointer-events: all;
      `};
  }

  @media (min-width: ${props => props.theme.breakpoints.huge}) {
    display: flex;
    flex-direction: row;
    align-self: stretch;
    align-items: stretch;
    justify-content: flex-end;
    flex: 1 0 auto;
    margin: 0;
    opacity: 1;
    pointer-events: all;
  }

  @media (max-width: ${props => props.theme.breakpoints.small}) {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translate3d(0, 100%, 0);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    opacity: 0;
    z-index: 1000;
    background-color: ${props => 
      props.isDarkMode || props.theme.header.transparent
        ? mix(0.95, props.theme.color.black, props.theme.color.white)
        : mix(0.95, props.theme.color.white, props.theme.color.black)};
    box-shadow: 0 1rem 2rem -0.5rem ${props => transparentize(0.5, props.theme.color.black)};
    transition: all 150ms ${p => p.theme.easing};
    pointer-events: none;
    ${props =>
      props.navOpen &&
      css`
        opacity: 1;
        pointer-events: all;
      `};
  }

`

export const MenuItem = {
  name: "menuItem",
  key: "label",
  label: "Menu Item",
  component: "group",
  fields: [
    { name: "label", label: "Label", component: "text" },
    { name: "link", label: "Path", component: "text" },
  ],
}

export const MenuForm = {
  label: "Menu",
  fields: [
    {
      label: "Menu Items",
      name: "rawJson.menuItems",
      component: "blocks",
      templates: {
        MenuItem,
      },
    },
  ],
}

export const NavItem = styled.li`
  flex: 0 0 auto;
  display: flex;
  align-items: stretch;
  color: inherit;
  &.create {
    color: #555;
    button {
      font-weight: 500;
    }
  }
  @media (max-width: ${props => props.theme.breakpoints.huge}) {
    &:not(:last-child) {
      border-bottom: 1px solid
        ${props => transparentize(0.85, props.theme.color.white)};
    }
  }
`

export const NavLink = styled(({ children, ...styleProps }) => (
  <Link activeClassName="active" {...styleProps}>
    <span>{children}</span>
  </Link>
))`
  flex: 1 0 auto;
  line-height: ${props => props.theme.header.height};
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  text-decoration: none;
  color: inherit !important;
  overflow: visible;
  transition: all 150ms ${p => p.theme.easing};
  z-index: 1;
  opacity: 2;

  button {
    opacity: 2;
  }
  &:active,
  &.active {
    opacity: 0;
  }

  &.active {
  }

  span {
    display: block;
    width: 100%;
  }

  @media (min-width: ${props => props.theme.breakpoints.huge}) {
    line-height: 1;
  }

  ${props =>
    props.theme.menu.style === "pill" &&
    css`
      padding: 0 1rem;

      &:before {
        content: "";
        position: absolute;
        display: block;
        top: 0rem;
        left: 0rem;
        right: 0rem;
        bottom: 0rem;
        opacity: 0;
        z-index: -1;
        background-color: ${props =>
          props.theme.header.transparent
            ? props.theme.color.background
            : transparentize(0.95, props.theme.color.foreground)};
        border: 1px solid
          ${props => transparentize(0.95, props.theme.color.foreground)};
        transition: all 150ms ${props => props.theme.easing};
      }

      &.active {
        color: ${props =>
          props.theme.isDarkMode
            ? props.theme.color.foreground
            : props.theme.color.primary} !important;
        &:before {
          opacity: 0;
        }
      }

      @media (min-width: ${props => props.theme.breakpoints.huge}) {
        &:before {
          top: 0.625rem;
          left: 0.25rem;
          right: 0.25rem;
          bottom: 0.625rem;
          border-radius: 3rem;
        }
      }
    `}

  ${props =>
    props.theme.menu.style === "glow" &&
    css`
      &:after {
        content: "";
        display: none;
        position: absolute;
        top: -6px;
        left: 0;
        width: 100%;
        height: 6px;
        background-color: ${props =>
          transparentize(0.85, props.theme.color.white)};
        transform: translate3d(0, -100%, 0);
        transition: all 150ms ${props => props.theme.easing};
      }

      &:before {
        content: "";
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to bottom,
          ${props =>
            transparentize(
              0.75,
              mix(0.25, props.theme.color.white, props.theme.color.black)
            )},
          transparent 1.5rem
        );
        opacity: 0;
        z-index: -1;
        transform: translate3d(0, -100%, 0);
        transition: all 150ms ${props => props.theme.easing};
      }

      &:active,
      &.active {
        opacity: 0;

        &:before {
          transform: translate3d(0, 0, 0);
          opacity: 0;
        }
        &:after {
          transform: translate3d(0, 0, 0);
        }
      }

      &.active {
        &:before {
          background: linear-gradient(
            to bottom,
            ${props =>
              transparentize(
                0.75,
                mix(0.5, props.theme.color.white, props.theme.color.black)
              )},
            transparent 1.5rem
          );
        }
      }

      @media (min-width: ${props => props.theme.breakpoints.huge}) {
        &:after,
        &:before {
          display: block;
        }
      }
    `}
`
export const NavHTML = styled(({ children, ...styleProps }) => (
  <span activeClassName="active" {...styleProps}>{children}</span>
))`
  flex: 1 0 auto;
  line-height: ${props => props.theme.header.height};
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  text-decoration: none;
  color: #555 !important;
  opacity: 0;
  overflow: visible;
  transition: all 150ms ${p => p.theme.easing};
  z-index: 1;

  &:focus-visible {
    opacity: 0;
  }

  &:active,
  &.active {
    opacity: 0;
  }

  &.active {
  }

  span {
    display: block;
    width: 100%;
  }

  @media (min-width: ${props => props.theme.breakpoints.huge}) {
    line-height: 1;
  }

  ${props =>
    props.theme.menu.style === "pill" &&
    css`
      padding: 0 1rem;

      &:before {
        content: "";
        position: absolute;
        display: block;
        top: 0rem;
        left: 0rem;
        right: 0rem;
        bottom: 0rem;
        opacity: 0;
        z-index: -1;
        background-color: ${props =>
          props.theme.header.transparent
            ? props.theme.color.background
            : transparentize(0.95, props.theme.color.foreground)};
        border: 1px solid
          ${props => transparentize(0.95, props.theme.color.foreground)};
        transition: all 150ms ${props => props.theme.easing};
      }

      &:focus-visible {
        opacity: 0;
        &:before {
          opacity: 0;
        }
      }

      &:active,
      &.active {
        opacity: 0;

        &:before {
          opacity: 0;
        }
      }

      &.active {
        color: ${props =>
          props.theme.isDarkMode
            ? props.theme.color.foreground
            : props.theme.color.primary} !important;
        &:before {
          opacity: 0;
        }
      }

      @media (min-width: ${props => props.theme.breakpoints.huge}) {
        &:before {
          top: 0.625rem;
          left: 0.25rem;
          right: 0.25rem;
          bottom: 0.625rem;
          border-radius: 3rem;
        }
      }
    `}

  ${props =>
    props.theme.menu.style === "glow" &&
    css`
      &:after {
        content: "";
        display: none;
        position: absolute;
        top: -6px;
        left: 0;
        width: 100%;
        height: 6px;
        background-color: ${props =>
          transparentize(0.85, props.theme.color.white)};
        transform: translate3d(0, -100%, 0);
        transition: all 150ms ${props => props.theme.easing};
      }

      &:before {
        content: "";
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to bottom,
          ${props =>
            transparentize(
              0.75,
              mix(0.25, props.theme.color.white, props.theme.color.black)
            )},
          transparent 1.5rem
        );
        opacity: 0;
        z-index: -1;
        transform: translate3d(0, -100%, 0);
        transition: all 150ms ${props => props.theme.easing};
      }


      @media (min-width: ${props => props.theme.breakpoints.huge}) {
        &:after,
        &:before {
          display: block;
        }
      }
    `}
`
export const CreateToggle = styled(({ ...styleProps }) => {
  return (
    <button {...styleProps}>
      Create
    </button>
  )
})`
  position: relative;
  padding: 0;
  border: 0;
  background: transparent;
  color: #555;
  cursor: pointer;
  margin-left: 1rem;
  font-size: 0.8rem;
  line-height: 1;
  align-self: stretch;
  text-transform: uppercase;
  opacity: 2;
  overflow: visible;
  transition: all 150ms ${p => p.theme.easing};
`

export const NavToggle = styled(({ menuOpen, ...styleProps }) => {
  return (
    <button {...styleProps}>
      <i><AccountCircle classname="open" /></i>
    </button>
  )
})`
  position: relative;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  margin-left: 1rem;
  align-self: stretch;
  text-transform: uppercase;
  color: #555;
  opacity: 2;
  overflow: visible;
  width: 2rem;
  transition: all 150ms ${p => p.theme.easing};
  span {
    display: inline-block;
  }
  .open {
    display: none;
  }
  .closed {
    display: block;
  }

  &:focus {
    opacity: 1;
  }

  @media (min-width: ${props => props.theme.breakpoints.huge}) {
    display: none;
  }

  ${props =>
    props.navOpen &&
    css`
      .open {
        display: block;
      }
      .closed {
        display: none;
      }
    `};
`

export const navFragment = graphql`
  fragment nav on SettingsJson {
    menuItems {
      link
      label
    }
  }
`

export const NavForm = {
  label: "Menu",
  fields: [
    {
      label: "Main Menu",
      name: "rawJson.menuItems",
      component: "group-list",
      itemProps: item => ({
        label: item.label,
      }),
      fields: [
        {
          label: "Label",
          name: "label",
          component: "text",
          parse(value) {
            return value || ""
          },
        },
        {
          label: "Link",
          name: "link",
          component: "text",
          parse(value) {
            return value || ""
          },
        },
        {
          label: "Sub Menu",
          name: "subMenu",
          component: "group-list",
          itemProps: item => ({
            key: item.link,
            label: item.label,
          }),
          fields: [
            {
              label: "Label",
              name: "label",
              component: "text",
            },
            {
              label: "Link",
              name: "link",
              component: "text",
            },
            {
              label: "Sub Menu",
              name: "subMenu",
              component: "group-list",
              itemProps: item => ({
                key: item.link,
                label: item.label,
              }),
              fields: [
                {
                  label: "Label",
                  name: "label",
                  component: "text",
                },
                {
                  label: "Link",
                  name: "link",
                  component: "text",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
