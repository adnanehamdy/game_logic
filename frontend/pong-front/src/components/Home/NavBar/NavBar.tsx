// import React from "react";
import { Burger } from "./Burger/burger";
import { Notification } from "./Notification/Notification";
import { Avatar } from "./Avatar";
import { Notif } from "./Notification/notif";
import { Brb } from "./Burger/Brb";
import { MBburger } from "./Burger/MBburger";
import React, { useContext, useEffect, useState } from "react";
import { useProfilecontext } from "../../../ProfileContext";
import { ChatSocketContext } from "../../Chat/contexts/chatContext";
import { StateProvider } from "../../Profile/States/stateContext";
import { useDataContext } from "../../Profile/States/stateContext";
import axios from 'axios'
interface Props {
	avatar: string,
	username: string,
	// update: () => void;
}

export function NavBar( ) {
  const [showNotif, setShowNotif] = React.useState(false);
  const [showBurger, setShowBurger] = React.useState(false);
  // const profile = useProfilecontext()
	const chatContext = useContext(ChatSocketContext);
  // const state = useDataContext();
  const profile = useProfilecontext();

  const [data, setData] = useState<any>(null);
  // const chatContext = useContext(ChatSocketContext);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        // Replace the URL with your API endpoint
        const response = await axios.get(`http://${import.meta.env.VITE_API_URL}/profile/me`, { withCredentials: true });

        // const result = await response.json();
        console.log('data = ', response.data.friends);
        let Mydata : friendsList;
        Mydata = {id: response.data.user_data.id, username: response.data.user_data.username, avatar: response.data.user_data.avatar, state : response.data.user_data.state}
        response.data.friends = [...response.data.friends, Mydata];
        setData(response.data.friends);
        console.log('initial data', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
// 
    };
    // chatContext?.emit('join-room', {roomId});
    fetchData();
  }, []);

  useEffect(() => {
  chatContext?.on('State', (friendState : friendsList)=>
      {
      console.log('on state -------', friendState);


      // start
          ///end 
          console.log("DATA MN 9BL", data)
          console.log('value', friendState)
          console.log('id', friendState);
          if (data)
      setData((old) => (old.map((item : friendsList) => (item.id === friendState.id ? { ...item, ...friendState } : item))))
      // }})
      // return null;
    });
    return (() =>
    {
        (chatContext?.off('State'))
      })
      }, [])


  return (
    <>
      <div className="nav-container zz">
        <nav>
          <div className="border h-24 sm:h-20">
            <div className="flex justify-between items-center h-full px-7">
              <div>
                <Burger clicked={() => setShowBurger(!showBurger)}/>
                <div className="fixed left-0 top-0 bg-white zz sm:hidden lg:block mobile-nav-bar">
                  <MBburger state={data}/>
                </div>
              </div>
              <div className="flex items-center">
                <div className="pr-20">
                  <Notification
                    clicked={() => setShowNotif(!showNotif)}
                    msgnum="5"
                  />
                </div>
                <div className="lg:pr-16">
                  <Avatar avatar={profile?.data?.user_data.avatar} name={profile?.data?.user_data.username} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {showNotif && <Notif />}
      {showBurger && <Brb />}
    </>
  );
}
