import React, { useContext } from "react"
import { NotifMsg } from "./NotifMsg"
// import { NotifRoom } from "./NotifRoom"
import { MyContext } from "../../../../pages/Profile"


export function DkNotif () {

	const data = useContext(MyContext);
	return (
		<>
			<div className="fixed bg-white right-56 top-10 zz border shadow-xl rounded-custom w-[550px] h-[450px] Dk-display">
			<div className="text-[#11142D] text-md font-medium pt-10 pl-10 ">Recent Notification</div>
			<div className="h-[380px] overflow-y-auto">
				{data?.MyuserData?.pending_requests.map((notif: {id: number, avatar: string; username: string} , index: number) => (
						<div key={index}>
							<NotifMsg profile={notif.avatar} name={notif.username} requestType="Request a friend invitation"/>
						</div>
					))
					}
			</div>
			</div>
		</>
	)
}
// <NotifRoom profile="/src/assets/hhamdy.jpg" name="Adnan" time="12h" RoomName="LeetPong"/>