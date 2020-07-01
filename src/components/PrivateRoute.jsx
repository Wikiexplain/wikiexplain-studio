import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { isLoggedIn } from "../utils/auth"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  if (!isLoggedIn() && location.pathname !== `/app/login`) {
    // If we’re not logged in, redirect to the home page.

     const url = `/app/login?originSlug=${location.pathname}`
    // If we’re not logged in, redirect to the home page.
    if (window) navigate(url, { replace: true })
    return null
  }
  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
}

export default PrivateRoute
