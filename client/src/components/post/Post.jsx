import "./post.css"
import {MoreVert} from "@material-ui/icons"
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useState, useEffect, useContext } from "react"
import axios  from "axios"
import {format} from "timeago.js";
import {Link} from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({post}) {   /* post from feed will give us all posts as obj's.. prop dril */
    
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(like);
    const [user, setUser] = useState({});
    const [colors, setColors] = useState({color: isLiked ? "red" : "lightgray"});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:cUser} = useContext(AuthContext)

    useEffect(() => {
      setIsLiked(post.likes.includes(cUser._id))
    },[cUser._id, post.likes])
 
    useEffect (() => {
     const fetchUser = async() => {
        const res = await axios.get(`/users?userId=${post.userId}`)  /*get user id from post data.. users.js(api/routes) users/post.uId*/
        setUser(res.data);
        console.log(setUser);
     };
     fetchUser();
   },[post.userId]);

    const likeHandler = () => {

        try{
          axios.put("/posts/"+post._id+"/like", {userId : cUser._id })
        }catch(err){
            console.log(err);
        }
       setLike(isLiked ? like-1 : like+1)
       setIsLiked(!isLiked)
       setColors(isLiked ? {color: "lightgray"} : {color: "red"})
    }
    
    return (
        <div className="post">
            <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                <Link to= {`profile/${user.username}`}>
                    <img className="postProfileImage" 
                    src={user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.png"} alt="" />
                </Link>
                    <span className="postUsername">{user.username}</span>
                    <span className="postDate">{format(post.createdAt)}</span>
                </div>
                <div className="postTopRight">
                  <MoreVert/>
                </div>
            </div>
              <div className="postCentre">
                  <span className="postText">{post?.desc}</span>
                  <img className="postImg" src={PF+post.img} alt="" onDoubleClick={likeHandler} />
              </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                       <FavoriteIcon className="likeIcon" style={colors} onClick={likeHandler} />
                       <span className="postLikeCounter">{like}</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
