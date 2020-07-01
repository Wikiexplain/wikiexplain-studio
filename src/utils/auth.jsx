export const isBrowser = () => typeof window !== "undefined"

export const getUser = () => {
  if (typeof window !== 'undefined') {
    isBrowser() && window.localStorage.getItem("user")
    ? JSON.parse(window.localStorage.getItem("user"))
    : {}
  }
}

export const setUser = user => {
  if (typeof window !== 'undefined') {
    isBrowser() && window.localStorage.setItem("user", JSON.stringify(user))
  }
}

  export const isLoggedIn = () => {
  const user = getUser()
  if (user) return !!user.email
}

export const logout = (firebase) => {
  return new Promise(resolve => {
    firebase.auth().signOut().then(function() {
      setUser({});
      resolve();
    });
  })
}