import "./rightbar.css";
import {Users} from "../dummyData"
import Online from "../online/Online";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import {Remove, Add} from "@material-ui/icons";

export default function Rightbar({user}) {
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const [friends, setFriends] = useState([]);
const {user:currentUser, dispatch} = useContext(AuthContext);
const[followed, setFollowed] = useState(currentUser.followings.includes(user?.id));


useEffect(() => {
   const getFriends = async() => {
     try{
       const friendList = await axios.get("/users/friends/"+user._id); //fetch friends
       setFriends(friendList.data); 
        }catch(err){
     }
   };
    getFriends();
}, [user]);

const followHandle = async() => {
   try{
    if(followed){
      await axios.put(`/users/${user._id}/unfollow`, {userId:currentUser._id});
      dispatch({type:"UNFOLLOW", payload:user._id})
    }else{
      await axios.put(`/users/${user._id}/follow`, {userId:currentUser._id});
      dispatch({type:"FOLLOW", payload:user._id})      
    }
      setFollowed(!followed);
   }catch(err){

   }
};

    const HomeRightbar = () => {
        return(
            <>
                <div className="birthdayContainer">
                    <img src="assets/gift.png" alt="" className="birthdayImg" />
                    <span className="birthdayText">
                        <b>Aman Sinha</b> and <b>3 other friends</b> have a birhday today.
                    </span>
                </div>
                <img className="rightbarAd" src="/assets/1481.jpg" alt="" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="righbarFriendList">
                   {Users.map((u) => ( 
                       <Online key={u.id} user={u}/>
                   ))}
                </ul>
            </>
        );
    };
    
 const ProfileRightbar = () => {
    return (
      <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={followHandle}>
        {followed ? "Unfollow" : "Follow"}
        {followed ? <Remove /> : <Add />}
        </button>
      )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship ===1 ? "Single" : user.relationship ===2? "Stuck" : "Very Single"}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
        {friends.map((friend) =>(
          <Link to={"/profile/"+friend.username} style={{textDecoration:"none"}}>
          <div className="rightbarFollowing">
            <img
              src={friends.profilePicture ? PF+friend.profilePicture : PF+"person/noAvatar.png"}
              alt=""
              className="rightbarFollowingImg"
            />
            <span className="rightbarFollowingName">{friend.username}</span>
          </div>
          </Link>
        ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
 