import React from "react"
import View from "./View"
import { Button } from '@tinacms/styles'
import { getUser } from "../utils"

const Profile = () => {
  const user = getUser();
  let displayName, email, emailVerified
  if (user) {
   displayName = user.displayName
   email = user.email
   emailVerified = user.emailVerified
  }

  return (
    <View title="Account">
        <div>
          <p className="text-gray-700 text-base">
            <h3>Profile</h3>
            <ul>
                <li> 
                  <div className="text-sm"><b>Name</b>:</div> 
                  <div className="pl-2 ">{`${displayName}`}</div>
                </li>
                <li> 
                  <div className="text-sm"><b>Email</b>:</div> 
                  <div className="pl-2 ">{`${email}`}</div>
                  </li>
            </ul>
          </p>
          <p className="text-gray-700 text-base">
            <h3>Articles monetization</h3>
            <h4 style={{fontWeight: "400"}}>Grow with WikiExplain</h4>
            <ul>
              <li> 
                <div>
                  As a WikiExplain partner, you'll be eligible to earn money from your webpages.
                  To get into the WikiExplain Partner Program, all you need is just a total of 3000 page visits. Your pages will also get reviewed to make sure it follows WikiExplain monetization policies
                </div>
              </li>
              <Button primary disabled>View Pages Progress</Button>
            </ul>
          </p>
        </div>
    </View>
  )
}

export default Profile
