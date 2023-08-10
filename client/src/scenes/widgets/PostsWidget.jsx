import { useEffect,memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import AdminPostWidget from "./AdminPostWidget";
import { Box, Typography } from "@mui/material";
const PostsWidget = ({ userId, isProfile=false}) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const {tip }=useSelector((state)=>state.user);
  const [admin, setAdmin]=useState(false);


  const profilePosts = async () => {
    //console.log("Zdravo iz profilePosts");
    dispatch(setPosts({ posts: [] }));
    const response = await fetch("http://localhost:3001/posts/profilePosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId }) 
    });

    const data = await response.json();
    dispatch(setPosts({ posts: data.rezultati }));
    //console.log(data.rezultati);
  };

  const seePosts = async () => {
    //console.log("Zdravo iz SeePosts");
    dispatch(setPosts({ posts: [] }));
    const response = await fetch(`http://localhost:3001/posts/seePosts`,
      {
        method: "GET",
        headers: {
           Authorization: `Bearer ${token}` ,
           'Content-Type': 'application/json'
          }, 
      }
    );
    const data = await response.json();
    if(response.status===200){
      //console.log(data.statusi);
      dispatch(setPosts({ posts: data.statusi }));

    }
    
  };

  useEffect(() => {
    if(isProfile){
      profilePosts();
    }
    else  {
      seePosts();
    }
    
  }, []); 

  return (
    <>
      {posts && posts.map((post) => {
        const { id, user, objava, picture, dateCreated, reports } = post;
        
  
        if (tip==="Admin") {
          return (
            <AdminPostWidget
              key={id}
              postId={id}
              description={objava}
              postPicture={picture}
              dateCreated={dateCreated}
              reports={reports}
            />
          );
        } else {
          const { ime, username, profilePicture, likes } = post;
  
          return (
            <PostWidget
              key={id}
              postId={id}
              postUserId={user}
              name={ime}
              username={username}
              description={objava}
              postPicture={picture}
              profilnaSlika={profilePicture}
              likes={likes}
              dateCreated={dateCreated}
            />
          );
        }
      })}
    </>
  );
  

  // return (
    

  //   <>
  //     { posts && tip==="Admin" && posts.map(
  //       ({
  //         id,
  //         objava,
  //         picture,
  //         dateCreated
  //       }) => (
  //         <AdminPostWidget
  //           key={id}
  //           postId={id}
  //           description={objava}
  //           postPicture={picture}
  //           dateCreated={dateCreated}
  //         />
  //       )
  //     )}

  //     { posts && tip!=="Admin" && posts.map(
  //       ({
  //         user,
  //         id,
  //         ime,
  //         objava,
  //         username,
  //         picture,
  //         profilePicture,
  //         likes,
  //         dateCreated
  //         //comments,
  //       }) => (
  //         <PostWidget
  //           key={id}
  //           postId={id}
  //           postUserId={user}
  //           name={ime}
  //           username={username}
  //           description={objava}
  //           postPicture={picture}
  //           profilePicture={profilePicture}
  //           likes={likes}
  //           dateCreated={dateCreated}
  //           //comments={comments}
  //         />
  //       )
  //     )}
  //   </>
      
      
    
  // );
};

export default memo(PostsWidget);

