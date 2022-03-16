import "./profile.css"
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext"

export default function Profile() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const username = useParams().username;
    const [file, setFile] = useState(null);


  const {user, dispatch} = useContext(AuthContext);

  const handleClick = async(e) => {
    e.preventDefault();
    dispatch({type:"UPDATE_START"})
    const updatedUser = {userId : user._id};

    if(file){
      const data =new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePic = filename; 
      try{
         await axios.post("upload", data);
      }catch(err){
        console.log("upload failed");
      } 
      }
      try{
           const res = await axios.put("/users/"+user._id, updatedUser);
           dispatch({type:"UPDATE_SUCCESS", payload:res.data}) 
      }catch(err){
                 dispatch({type:"UPDATE_FAILURE"});
                 console.log("failed to upload");
      }
    };
        return (
        <>
       <Topbar/>
       <div className="profile"> 
           <Sidebar/> 
           <div className="profileRight">
               <div className="profileRightTop">
               <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
              />
          <form onSubmit={handleClick}>
            <label htmlFor="fileInput">
              <img
                className="profileUserImg"
                src={file ? URL.createObjectURL(file) : PF+user.profilePic}
                alt=""
              />
            </label>
            <input style={{display: "none"}} type="file" id="fileInput" accept=".png, .jpeg, .jpg" onChange={(e)=>setFile(e.target.files[0])} /> 

          </form>
               </div>
               <div className="profileInfo">
                   <h4 className="ProfileInfoName">{user.username}</h4>
                   <span className="ProfileInfoDesc">{user.desc}</span>
               </div>
               </div>
               <div className="profileRightBottom">
               <Feed username={username}/>
               <Rightbar user={user}/>
               </div>
           </div>
       </div>
       </>
    )
}
