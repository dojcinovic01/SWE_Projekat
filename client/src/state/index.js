import { createSlice } from "@reduxjs/toolkit";

const initialState={
    mode:"light",
    user:null,
    token:null,
    posts:[],
    notifications:[],
    comments:{},
    isFriend:false
}

export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setMode:(state)=>{
            state.mode= state.mode ==="light" ? "dark" : "light";
        },
        setLogin:(state, action) =>{
            state.user=action.payload.user;
            state.token=action.payload.token;
        },
        setUser:(state,action)=>{
          state.user=action.payload.user;
        },
        setLogout:(state,action) =>{
            state.user=null;
            state.token=null;
            state.posts=[];
            state.notifications=[];
            state.comments={};
            state.friends=[];
        },
        setFriend:(state,action)=>{
            const {isFriend}=action.payload;
           // console.log(isFriend);
            if(isFriend==="true" || isFriend===true){
              state.isFriend=true;
            }
            else if(isFriend==="false" || isFriend===false){
              state.isFriend=false;
            }

        },
          setPosts: (state, action) => {
            state.posts = action.payload.posts;
          },
          setNewPost: (state, action) => {
            return {
              ...state,
              posts: [action.payload.newPost, ...state.posts],
            };
          },
          setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                //return post._id=== action.payload.post._id ? action.payload.post : post;
              if (post.id === action.payload.post.id) return action.payload.post;
              return post;
            });
            state.posts = updatedPosts;
          },
          setDeletePost: (state, action) => {
            const updatedPosts = state.posts.filter((post) => post.id !== action.payload.postId);
            state.posts = updatedPosts;
          },
          setNotifications:(state, action)=>{
            state.notifications=action.payload.notifikacije;
          },
          setComments: (state, action) => {
            const { postId, komentari } = action.payload;
            state.comments[postId] = komentari;
          },
          
          setNewComment: (state, action) => {
            const { postId, newComment } = action.payload;
            if(!state.comments[postId]){
              state.comments[postId]=[];
            }
            state.comments[postId].push(newComment);
          },
          setDeleteComment: (state, action) => {
            const { postId, commentId } = action.payload;
            const commentsForPost = state.comments[postId];
            if (commentsForPost) {
              const updatedComments = commentsForPost.filter((comment) => comment.id !== commentId);
              state.comments[postId] = updatedComments;
            }
          }
          
          
    },
});

export const { setMode, setLogin,setFriend,setUser, setLogout, setFriends, setPosts, setPost,setNewPost, setDeletePost, setNotifications, setComments, setNewComment, setDeleteComment } = authSlice.actions;
export default authSlice.reducer;