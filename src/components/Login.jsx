import React from "react"
import { navigate } from '@reach/router';
import View from "./View"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { setUser, isLoggedIn } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"
import * as queryString from 'query-string'

const Login = (props) => {
  const [data, setData] = React.useState(null)
  let urlParams = queryString.parse(props.location.search)
  if (Object.keys(urlParams).length === 0) urlParams = { "originSlug": '/blog' }
  debugger
  React.useEffect(() => {
    firebase
      .database()
      .ref("/data")
      .once("value")
      .then(snapshot => {
        setData(snapshot.val())
      })
  }, [])

  if (isLoggedIn()) {
    if (typeof window !== 'undefined') {
     navigate(urlParams.originSlug)
    }
  }

  function getUiConfig(auth) {
    return {
      signInFlow: 'popup',
      signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID
      ],
      // signInSuccessUrl: 'caller path',
      callbacks: {
        signInSuccessWithAuthResult: (result) => {
          setUser(result.user);
          if (typeof window !== 'undefined') {
             navigate(urlParams.originSlug);
          }
        }
      }
    };
  }
  return (
    <View title="Log In">
      <p>Please sign-in to access to the private route:</p>
      {firebase && <StyledFirebaseAuth uiConfig={getUiConfig(firebase.auth)} firebaseAuth={firebase.auth()}/>}
    </View>
  );

}

export default Login
