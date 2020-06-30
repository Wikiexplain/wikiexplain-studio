import "firebase/auth"
import "firebase/database"
import "firebase/firestore"
import "firebase/functions"

export const onClientEntry = () => {
	showHideCMS()
}

export const onRouteUpdate = () => {
	showHideCMS()
}

function showHideCMS() {
	if (window.location.pathname && window.location.pathname.includes('/blog/')) {
		window.tinacms.sidebar.hidden = false
	} else {
		window.tinacms.sidebar.hidden = true
	}
}
