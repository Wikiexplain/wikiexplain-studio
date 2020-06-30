import React, { useState, useEffect, useRef } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { AccountCircle, ClickAwayListener } from '@styled-icons/material'
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
    const open = !navOpen
    const toggle = document.getElementsByClassName('nav-toggle-list')[0]
    if(open) {
      toggle.setAttribute('open', 1)
    } else {
      toggle.setAttribute('open', 0)
    }
    setNavOpen(open)
  }


  const menu = data.settingsJson
  return (
    <>
      <StyledNavbarCenter>
        <StyleLi 
          key={`search`}
          >
            <SearchNav key="search"/>
          </StyleLi>
      </StyledNavbarCenter>
      <StyledNavbarRight>
        <StyleLi>
          <CreateContentButton plugin={createPostButton}/>
        </StyleLi>
        <StyledNavbar navOpen={navOpen}
          className="account-list"
        >
            <NavItem key={`account`}>
              <NavLink
                to={`/app/profile`}
              >
                Account
              </NavLink>
            </NavItem>
            <NavItem key={`about`}>
              <NavLink
                to={`/about`}
              >
                About
              </NavLink>
            </NavItem>
            <NavItem key={`contact`}>
              <NavLink
                to={`/contact`}
              >
                Contact
              </NavLink>
            </NavItem>
            <NavItem key={`status`}>
              <NonNavLink>
                <Status />
              </NonNavLink>
            </NavItem>
        </StyledNavbar>
        <StyleLi>
        <NavToggle
          aria-label="Toggle Nav"
          onClick={toggleNavOpen}
          navOpen={navOpen}
          className="nav-toggle-list"
          open="0"
        ></NavToggle>
        </StyleLi>
      </StyledNavbarRight>
    </>
  )
}

export const StyledNavbarRight = styled.ul`
  display: flex;
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
export const StyleLi = styled.li`
  margin-bottom: 0 !important;

  display: flex;
  justify-content: center;
  flex-basis: 200px;
  transition: all 0.75s ease-out;
`
export const useOutsideAlerter = (ref) => {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
          event.stopPropagation()
          if (ref.current && !ref.current.contains(event.target)) {
            const accounToggle = document.querySelector('.nav-toggle-list')
            const accountList = document.querySelector('.account-list')
            const open = accounToggle.getAttribute('open')
            if (open === "1") {
              accountList.style.display = "none"
            } else {
              accountList.style.display = "flex"
            }
          }

        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export const StyledNavbar = styled(({children, ...styleProps}) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    <ul
      ref={wrapperRef}
      {...styleProps}
    >
      {children}
    </ul>
  )
})`
  color: inherit;
  pointer-events: none;
  background-color: white;
  @media (max-width: ${props => props.theme.breakpoints.huge}) {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translate3d(0, 100%, 0);
    width: 400px;
    flex-direction: column;
    align-items: stretch;
    opacity: 0;
    z-index: 1000;
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
export const NonNavLink = styled(({ children, ...styleProps }) => (
  <div {...styleProps}>
    <span>{children}</span>
  </div>
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

export const NavLink = styled(({ children, ...styleProps }) => (
  <Link {...styleProps}>
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

export const NavToggle = styled(({ menuOpen, ...styleProps }) => {
  return (
    <button {...styleProps}>
      <i><AccountCircle className="account-circle"/></i>
      <span>Account</span>
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
  display: flex;
  flex: 1 1;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.3rem;
  i .account-circle {
    flex: 1 1;
    padding-top: 0.8rem;
    padding-bottom: 0.2rem;
    transition: all 0.25s linear;
    width: 37px;
    line-height: 1;

  }
  @media (max-width: 600px) {
    span {
      display: none
    }
    i .account-circle {
      flex: 1 1;
      padding-top: 0.8rem;
      padding-bottom: 0.2rem;
      transition: all 0.25s linear;
      width: 32px;
      line-height: 1;
    }
  }
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
