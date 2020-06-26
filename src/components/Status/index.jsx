import React from "react"
import { Link, navigate } from "@reach/router"
import { getUser, isLoggedIn, logout } from "../../utils/auth"
import firebase from "gatsby-plugin-firebase"
import styled, { css } from "styled-components"
import { mix, transparentize } from "polished"

export default () => {
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    firebase
      .database()
      .ref("/data")
      .once("value")
      .then(snapshot => {
        setData(snapshot.val())
      })
  }, [])

  let details;
  if (!isLoggedIn()) {
    details = (
      <NavLink to="/app/login">Log in</NavLink>
    )
  } else {
    const { displayName, email } = getUser()
    details = (
      <p>
        <NavA
          href="/" 
          onClick={event => { event.preventDefault(); logout(firebase).then(() => navigate(`/app/login`)) }}
          >
          log out
        </NavA>
      </p>
    )
  }

  return <div>{details}</div>
}

export const NavLink = styled(({ children, ...styleProps }) => (
  <Link activeClassName="active" {...styleProps} isCurrent>
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
  opacity: 0.5;
  overflow: visible;
  transition: all 150ms ${p => p.theme.easing};
  z-index: 1;

  &:focus-visible {
    opacity: 1;
  }

  &:hover:not(.active) {
  }

  &:hover,
  &:active,
  &.active {
    opacity: 1;
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
        opacity: 1;
        &:before {
          opacity: 0.15;
        }
      }

      &:hover:not(.active) {
        &:before {
          opacity: 0.15;
        }
      }

      &:hover,
      &:active,
      &.active {
        opacity: 1;

        &:before {
          opacity: 1;
        }
      }

      &.active {
        color: ${props =>
          props.theme.isDarkMode
            ? props.theme.color.foreground
            : props.theme.color.primary} !important;
        &:before {
          opacity: 1;
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

      &:focus-visible {
        opacity: 1;
        &:before {
          transform: translate3d(0, 0, 0);
          opacity: 0.5;
        }
      }

      &:hover:not(.active) {
        &:before {
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
        &:after {
          background-color: ${props =>
            transparentize(0.8, props.theme.color.black)};
        }
      }

      &:hover,
      &:active,
      &.active {
        opacity: 1;

        &:before {
          transform: translate3d(0, 0, 0);
          opacity: 1;
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
export const NavA = styled(({ children, ...styleProps }) => (
  <a activeClassName="active" {...styleProps} isCurrent>
    <span>{children}</span>
  </a>
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
  opacity: 0.5;
  overflow: visible;
  transition: all 150ms ${p => p.theme.easing};
  z-index: 1;

  &:focus-visible {
    opacity: 1;
  }

  &:hover:not(.active) {
  }

  &:hover,
  &:active,
  &.active {
    opacity: 1;
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
        opacity: 1;
        &:before {
          opacity: 0.15;
        }
      }

      &:hover:not(.active) {
        &:before {
          opacity: 0.15;
        }
      }

      &:hover,
      &:active,
      &.active {
        opacity: 1;

        &:before {
          opacity: 1;
        }
      }

      &.active {
        color: ${props =>
          props.theme.isDarkMode
            ? props.theme.color.foreground
            : props.theme.color.primary} !important;
        &:before {
          opacity: 1;
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

      &:focus-visible {
        opacity: 1;
        &:before {
          transform: translate3d(0, 0, 0);
          opacity: 0.5;
        }
      }

      &:hover:not(.active) {
        &:before {
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
        &:after {
          background-color: ${props =>
            transparentize(0.8, props.theme.color.black)};
        }
      }

      &:hover,
      &:active,
      &.active {
        opacity: 1;

        &:before {
          transform: translate3d(0, 0, 0);
          opacity: 1;
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