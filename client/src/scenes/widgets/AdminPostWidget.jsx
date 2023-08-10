import {
    Delete,
    Report,
    Cancel,
    CheckCircle,
    ChatBubbleOutlineOutlined
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, Typography, useTheme, Modal, InputBase, Button } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState, memo } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost,setDeletePost, setComments, setNewComment, setDeleteComment } from "state";
  import { useNavigate } from "react-router-dom";
  import Comment from "components/Comment";
  
  const AdminPostWidget = ({
    postId,
    description,
    postPicture,
    dateCreated,
    reports
  }) => {
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const token = useSelector((state) => state.token);
    const {_id, picturePath} = useSelector((state) => state.user);
    const posts= useSelector((state)=>state.posts);
    const comments=useSelector((state)=>state.comments);
    const commentsForPost=comments[postId] ? comments[postId] : [];
    const [isComments, setIsComments] = useState(false);
    const [keepModal,setKeepModal]=useState(false);
    const [deleteModal, setDeleteModal]= useState(false);
    const [reportModal, setReportModal] =useState(false);
    const [postContent, setPostContent] = useState(description ? description : "");
    const [image, setImage] = useState(postPicture ? postPicture: null);
    const [addComment, setAddComment]=useState("");
    const postDate= new Date(dateCreated).toLocaleDateString();
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
  
    //console.log(reports);
  
    const picture=postPicture? postPicture.replace('public\\assets\\','') : "";
  
    
    
  
    const getComment= async () => {
      // console.log(postId);
        const response= await fetch("http://localhost:3001/comments/loadComment",{
            method:"POST",
            headers:{
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ objava:postId}) 
        });
    
        const comm=await response.json();
        console.log(comm.komentari);
    
        if (comm.komentari===undefined) {
          dispatch(setComments({ postId: postId, komentari: [] }));
    
        }
         else if(comm.komentari) {
          dispatch(setComments({ postId: postId, komentari: comm.komentari }));
         
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
        console.log(deletedPost.message);
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
    const handleKeepPost= async () => {
      const response= await fetch("http://localhost:3001/posts/zadrziObjavu",{
          method:"POST",
          headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ postId:postId}) 
      });
  
      const keep=await response.json();
      if(response.status===202){
        dispatch(setDeletePost({postId: postId}));
        
      }
      
    };
  
    return (
      <WidgetWrapper m="2rem 0">
        <FlexBetween>
          
          <CheckCircle
            onClick={()=>setKeepModal(prevModal=>!prevModal)}
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },}}
          />
          <Box >
            <Delete 
              onClick={()=>setDeleteModal(prevModal=>!prevModal)}
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },}}
            /> 
            <Report
              onClick={()=>setReportModal(prevModal=>!prevModal)}
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },}}
            />
          </Box>
          
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
         <FlexBetween gap="1rem">
            
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => {
                setIsComments(!isComments);
                getComment();
              }}
              >
                <ChatBubbleOutlineOutlined />
              </IconButton>

              {comments[postId] && isComments && <Typography>{commentsForPost.length}</Typography>}
            </FlexBetween>
  
          </FlexBetween>
  
          <IconButton sx={{fontSize:"17px"}}>
            {postDate}
          </IconButton>
        </FlexBetween>
        
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
                          
                            <IconButton onClick={()=>deleteComment(id)}>
                              <Delete/>
                            </IconButton>
                            
                        
                        </FlexBetween>
                        
              
                      </Box>
                    ))}
                    <Divider />
                    
                  </Box>
                ) : (
                  <Box>
                   <Typography>
                    
                   </Typography>
                  </Box>
                )}
              </>

            
  
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
                            color: "black",
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
                            color:"black",
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
                        Razlog prijavljene objave
                    </Typography>
  
                    <Box id="modal-description"  >
                      {reports.map((report,index)=>(
                        <Box key={`box_${report}_${index}`}> 
                          <Divider/>
                          <Typography >
                             {report}
                          </Typography>
                        </Box>
                        
                      ))}
                    </Box>
                  </Box>
              </Modal>

              <Modal
                  open={keepModal}
                  onClose={()=>setKeepModal(prevModal=>!prevModal)}
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
                      <IconButton onClick={()=>setKeepModal(prevModal=>!prevModal)}>
                        <Cancel />
                      </IconButton>
                    </Box>
                    <Typography id="modal-title" variant="h6" component="h2" marginBottom="10px">
                        Da li želite da zadržite ovu objavu
                    </Typography>
  
                    <Box id="modal-description"  >
                        <Button
                          onClick={()=>{
                            handleKeepPost();
                            setKeepModal(prevModal=>!prevModal);
                          }}
                          
                          sx={{
                            color: "black",
                            backgroundColor: palette.primary.main,
                            borderRadius: "3rem",
                            marginRight:"10px"
                          }}
                          >
                          Zadrži objavu
                        </Button>
  
                        <Button
                          onClick={()=>setKeepModal(prevModal=>!prevModal)}
                          sx={{
                            color:"black",
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
      </WidgetWrapper>
  
      
    );
  };
  
  export default memo(AdminPostWidget);
  