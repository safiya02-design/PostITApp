import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getUser=createAsyncThunk("users/getUser",async(udata)=>{
    try{
        const response=await axios.post("http://localhost:5000/login",udata);
        return response.data;
    }
    catch(error){
        console.log(error);
    }
});

export const addUser=createAsyncThunk("users/addUser",async(udata)=>{
    try{
        const response=await axios.post("http://localhost:5000/register",udata);
        return response.data.message;
    }
    catch(error){
        console.log(error);
    }
});

const initVal={
    user:{},
    message:"",
    isLoading:false,
    isSuccess:false,
    isError:false
}

export const UserSlice=createSlice({
    name:"users",
    initialState:initVal,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addUser.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(addUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.message=action.payload;
        })
        .addCase(addUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
        .addCase(getUser.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(getUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.message=action.payload.message;
            state.user=action.payload.user;
        })
        .addCase(getUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
    }
});
export default UserSlice.reducer;