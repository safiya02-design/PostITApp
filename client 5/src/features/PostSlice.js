import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getPosts=createAsyncThunk("posts/getPosts",async()=>{
    try{
        const response=await axios.get("http://localhost:5000/getPosts");
        return response.data.posts;
    }
    catch(error){
        console.log(error);
    }
});

export const savePost=createAsyncThunk("posts/savePost",async(pdata)=>{
    try{
        const response=await axios.post("http://localhost:5000/savePost",pdata);
        return response.data.message;
    }
    catch(error){
        console.log(error);
    }
});
export const updatePost=createAsyncThunk("posts/updatePost",async(pdata)=>{
    try{
        const response=await axios.put("http://localhost:5000/updatePost",pdata);
        return response.data;
    }
    catch(error){
        console.log(error);
    }
});

export const delPost=createAsyncThunk("posts/delPost",async(pid)=>{
    try{
        const response=await axios.delete(`http://localhost:5000/delPost/${pid}`);
        return response.data;
    }
    catch(error){
        console.log(error);
    }
});

const initVal={
    posts:[],
    message:"",
    isLoading:false,
    isSuccess:false,
    isError:false
}

export const PostSlice=createSlice({
    name:"posts",
    initialState:initVal,
    extraReducers:(builder)=>{
        builder.addCase(savePost.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(savePost.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.message=action.payload;
        })
        .addCase(savePost.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
        .addCase(getPosts.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(getPosts.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.posts=action.payload;
        })
        .addCase(getPosts.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
        .addCase(updatePost.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(updatePost.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
           
        })
        .addCase(updatePost.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
        .addCase(delPost.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(delPost.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
           
        })
        .addCase(delPost.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
    }
});
export default PostSlice.reducer;