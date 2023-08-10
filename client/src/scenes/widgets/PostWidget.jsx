import {
  ChatBubbleOutlineOutlined,
  TrendingUp,
  Edit,
  Delete,
  Report,
  Cancel,
  AddCircle
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, Modal, InputBase, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost,setDeletePost, setComments, setNewComment, setDeleteComment } from "state";
import { useNavigate } from "react-router-dom";
import UserImage from "components/UserImage";
import Comment from "components/Comment";



const PostWidget = ({
  postId,
  postUserId,
  name,
  username,
  description,
  postPicture,
  profilnaSlika,
  likes,
  dateCreated
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const navigate= useNavigate();
  const token = useSelector((state) => state.token);
  const {id, profilePicture, tip} = useSelector((state) => state.user);
  const isFriend= useSelector((state) => state.isFriend);
  const idUlogovan=id;
  const comments=useSelector((state)=>state.comments);
  const posts= useSelector((state)=>state.posts);
  const commentsForPost=comments[postId] ? comments[postId] : [];
  const [postModal,setpostModal]=useState(false);
  const [deleteModal, setDeleteModal]= useState(false);
  const [reportModal, setReportModal] =useState(false);
  const [postContent, setPostContent] = useState(description ? description : "");
  const [image, setImage] = useState(postPicture ? postPicture: null);
  const [reportMsg, setReportMsg]= useState("");
  const [addComment, setAddComment]=useState("");
  const isLiked = Boolean(likes.find(el=> el===id));//Boolean(likes[loggedInUserId]);
  const isMyPost= postUserId === idUlogovan ? true : false;
  const likeCount = likes.length;
  const isAPI=postId.length>5 ? false : true;
  const postDate=  isAPI ? new Date().toLocaleDateString() : new Date(dateCreated).toLocaleDateString();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  //console.log(isFriend);
  const picture=postPicture? postPicture.replace('public\\assets\\','') : "";
  const apiProfilna= isAPI ? "public\\assets\\ApiProfilna.png" : "";


  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/likePost`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ objava:postId }),
    });
    const updatedPost = await response.json();
    //console.log(updatedPost);
    dispatch(setPost({ post: updatedPost.status }));
    //console.log(likes);
  };

  const getComment= async () => {
    const response= await fetch("http://localhost:3001/comments/loadComment",{
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ objava:postId}) 
    });

    const comments=await response.json();
    //console.log(comments.komentari);

    if (comments.komentari===undefined) {
      dispatch(setComments({ postId: postId, komentari: [] }));

    }
     else if(comments.komentari) {
      dispatch(setComments({ postId: postId, komentari: comments.komentari }));
     
    }
    
  };


  const pushComment= async () => {
    const response= await fetch("http://localhost:3001/comments/createComment",{
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ objavaId:postId, content:addComment}) 
    });

    const com=await response.json();
    //console.log(com.message)
    if(com.message==="Uspešno ste kreirali komentar"){
      dispatch(setNewComment({postId:postId,newComment:com.comment}));
      getComment();
      setAddComment("");
      setIsComments(true);
    }
    else{
      //console.log(com.message);
    }

  
  };

  const deleteComment= async (id) =>{
    const response=await fetch("http://localhost:3001/comments/deleteComment",{
        method:"POST",
          headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
            body: JSON.stringify({komentarId:id}),
          }
        );
        const msg = await response.json();
        if(msg.message==="Uspesno ste izbrisali komentar"){
            dispatch(setDeleteComment({postId:postId, commentId:id }))
        }
    
  };

  const handleUpdatePost = async () => {

    

  const response = await fetch(`http://localhost:3001/posts/changePost`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      // Promenite ovo:
      "Content-Type": "application/json"
    },
    body:  JSON.stringify({
      postId:postId,
      postContent:postContent
    })
   
  });
  
   
        
    const updatedPost = await response.json();    
    if(response.status===201){
      dispatch(setPost({ post: updatedPost.post }));
      setpostModal(prev=>!prev);
    }
    else{
      if(updatedPost.message){
        //console.log(updatedPost.message);
      }
      
    }
    

  };

  const handleDeletePost = async () =>{
    
    const response = await fetch(`http://localhost:3001/posts/deletePost`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId }) 
        });

    const deletedPost= await response.json();
    if(deletedPost.message==="Objava uspesno izbrisana"){
      dispatch(setDeletePost({postId: postId}));
      
    }
    else{
      //console.log(deletedPost.message);
    }
  };

  const handleReportPost= async () => {
    const response= await fetch("http://localhost:3001/posts/prijaviObjavu",{
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId, reportMsg }) 
    });

    const report=await response.json();
    if(report.message==="Hvala Vam sto ste prijavili objavu"){
      //console.log(report.message);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <FlexBetween>
        <Friend
          friendId={postUserId}
          name={name}
          username={username}
          profilePicture={isAPI? apiProfilna : profilnaSlika}
        />
        
        {(id===postUserId || tip==="Admin") ?(<Box >
          <Edit 
            onClick={()=>setpostModal(prevModal=>!prevModal)}
            sx={{marginRight:"10px",
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },}}
          />

          <Delete 
            onClick={()=>setDeleteModal(prevModal=>!prevModal)}
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },}}
          />
        </Box>):(
        <Box >  
          {!isAPI &&(<Report
            onClick={()=>setReportModal(prevModal=>!prevModal)}
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },}}
          />)}
        </Box>)}
        
      </FlexBetween>
      
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picture && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picture}`}
        />
      )}
      <FlexBetween mt="0.25rem">
       {!isAPI &&( <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              <TrendingUp
                sx={{color: isLiked ? palette.primary.light : undefined }}
              />
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>


          <FlexBetween gap="0.3rem">
            {(isFriend || tip==="Admin") &&(<IconButton onClick={() => {
              setIsComments(!isComments);
              getComment();
            }}
            >
              <ChatBubbleOutlineOutlined />
            </IconButton>)}
            {comments[postId] && isComments && <Typography>{commentsForPost.length}</Typography>}
          </FlexBetween>

        </FlexBetween>)}

        <IconButton sx={{fontSize:"17px"}}>
          {postDate}
        </IconButton>
      </FlexBetween>
      

      {((!isAPI && isFriend)||(tip==="Admin")) && (
            <>
              {isComments ? (
                <Box mt="1rem">
                  {commentsForPost.length>0 && commentsForPost.map(({id,content, kreator,picture,username},index)=>(
                      <Box key={`box_${id}_${index}`} marginTop={"10px"} >
                      <Divider />
                      <FlexBetween>
                        <Comment
                          commentId={id}
                          profileId={kreator}
                          username={username}
                          profilePicture={picture}
                          content={content}
                          //postId={postId}
                        />
                        {(isMyPost || idUlogovan===kreator || tip==="Admin")  && (
                          <IconButton onClick={()=>deleteComment(id)}>
                            <Delete/>
                          </IconButton>
                          
                        )}
                      </FlexBetween>
                      
            
                    </Box>
                  ))}
                  <Divider />
                  <Box
                    sx={{
                      marginTop: "30px",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <UserImage image={profilePicture} size={50} sx={{ marginRight: "10px" }} />
                    <InputBase
                      placeholder="Komentarišite objavu ..."
                      onChange={(e) => setAddComment(e.target.value)}
                      value={addComment}
                      sx={{
                        width: "70%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                        marginLeft: "20px"
                      }}
                    />
                    <IconButton sx={{ marginLeft: "10px", padding: "1rem" }} onClick={pushComment}>
                      <AddCircle sx={{ fontSize: "2rem", color: palette.primary.main }} />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    marginTop: "30px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <UserImage image={profilePicture} size={50} sx={{ marginRight: "10px" }} />
                  <InputBase
                    placeholder="Komentarišite objavu ..."
                    onChange={(e) => setAddComment(e.target.value)}
                    value={addComment}
                    sx={{
                      width: "70%",
                      backgroundColor: palette.neutral.light,
                      borderRadius: "2rem",
                      padding: "1rem 2rem",
                      marginLeft: "20px"
                    }}
                  />
                  <IconButton sx={{ marginLeft: "10px", padding: "1rem" }}  onClick={pushComment}>
                    <AddCircle sx={{ fontSize: "2rem", color: palette.primary.main }} />
                  </IconButton>
                </Box>
              )}
            </>
          )}
           <Modal
                open={postModal}
                onClose={()=>setpostModal(prevModal=>!prevModal)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                >
                <Box 
                sx={{position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: palette.background.default,
                    border: '2px solid #000',
                    boxShadow: 20,
                    p: 4,
                    textAlign:"center",
                    maxHeight:"80%",
                    overflow:"auto",
                    }}
                  >
                  <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={()=>setpostModal(prevModal=>!prevModal)}>
                      <Cancel />
                    </IconButton>
                  </Box>
                  <Typography id="modal-title" variant="h6" component="h2" marginBottom="10px">
                      Izmenite Vašu objavu
                  </Typography>
                  <Box id="modal-description"  >
                    <InputBase
                        placeholder={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        value={postContent}
                        sx={{
                          width: "100%",
                          backgroundColor: palette.neutral.light,
                          borderRadius: "2rem",
                          padding: "1rem 2rem",
                          marginBottom:"20px",
                        }}
                    />
                    

                      <Button
                        onClick={handleUpdatePost}
                        sx={{
                          color:palette.background.default,
                          backgroundColor: palette.primary.main,
                          borderRadius: "3rem",
                      }}
                      >
                        Izmeni objavu
                      </Button>
                  </Box>
                </Box>
                
            </Modal>

            <Modal
                open={deleteModal}
                onClose={()=>setDeleteModal(prevModal=>!prevModal)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                >
                <Box 
                sx={{position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: palette.background.default,
                    border: '2px solid #000',
                    boxShadow: 20,
                    p: 4,
                    textAlign:"center",
                    maxHeight:"80%",
                    overflow:"auto",
                    }}
                  >
                  <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={()=>setDeleteModal(prevModal=>!prevModal)}>
                      <Cancel />
                    </IconButton>
                  </Box>
                  <Typography id="modal-title" variant="h6" component="h2" marginBottom="10px">
                      Da li želite da izbrišete ovu objavu
                  </Typography>

                  <Box id="modal-description"  >
                      <Button
                        onClick={()=>{
                          handleDeletePost();
                          setDeleteModal(prevModal=>!prevModal);
                        }}
                        
                        sx={{
                          color: palette.primary.light,
                          backgroundColor: palette.primary.main,
                          borderRadius: "3rem",
                          marginRight:"10px"
                        }}
                        >
                        Izbriši objavu
                      </Button>

                      <Button
                        onClick={()=>setDeleteModal(prevModal=>!prevModal)}
                        sx={{
                          color:"#026135",
                          backgroundColor: palette.primary.main,
                          borderRadius: "3rem",
                          marginLeft:"10px"
                        }}
                        >
                        Odustani
                      </Button>
                  </Box>
                </Box>
            </Modal>

            <Modal
                open={reportModal}
                onClose={()=>setReportModal(prevModal=>!prevModal)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                >
                <Box 
                sx={{position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: palette.background.default,
                    border: '2px solid #000',
                    boxShadow: 20,
                    p: 4,
                    textAlign:"center",
                    maxHeight:"80%",
                    overflow:"auto",
                    }}
                  >
                  <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                    <IconButton onClick={()=>setReportModal(prevModal=>!prevModal)}>
                      <Cancel />
                    </IconButton>
                  </Box>
                  <Typography id="modal-title" variant="h6" component="h2" marginBottom="10px">
                      Napišite nam koji je razlog vaše prijave
                  </Typography>

                  <Box id="modal-description"  >
                      <InputBase
                            onChange={(e) => setReportMsg(e.target.value)}
                            value={reportMsg}
                            sx={{
                              width: "100%",
                              backgroundColor: palette.neutral.light,
                              borderRadius: "2rem",
                              padding: "1rem 2rem",
                              marginBottom:"20px",
                            }}
                        />
                      <Button
                        onClick={()=>{
                          handleReportPost();
                          setReportModal(prevModal=>!prevModal);
                        }}
                        
                        sx={{
                          color:palette.background.default,
                          backgroundColor: palette.primary.main,
                          borderRadius: "3rem",
                          marginRight:"10px"
                        }}
                        >
                        Prijavi objavu
                      </Button>
                  </Box>
                </Box>
            </Modal>
    </WidgetWrapper>

    
  );
};

export default memo(PostWidget);
