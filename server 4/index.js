import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import UserModel from './models/UserModel.js';
import bcrypt from 'bcrypt';
import PostModel from './models/Posts.js';

const app=express();
app.use(cors());
app.use(express.json());

try{
    const conStr="mongodb+srv://admin:1234@cluster0.kbo8y4l.mongodb.net/PostITApp-S1-2526-FS2?retryWrites=true&w=majority&appName=Cluster0";
    mongoose.connect(conStr);
    console.log("Database Connected..")
}
catch(error){
    console.log("Database connection error.."+error);
}

app.listen(5000,()=>{
    console.log("Server connected at port number 5000..")
})

app.post("/login",async(req,res)=>{
    try{
        const user=await UserModel.findOne({email:req.body.email});
        if(user){
            const pwd_match=await bcrypt.compare(req.body.password,user.password);
            if(pwd_match)
                res.status(200).json({user:user,message:"Success"});
            else
                res.status(200).json({message:"Invalid Credentials.."});
        }
        else{
            
            res.status(500).json({message:"User not found..."});
        }
    }
    catch(error){
        res.send(error);
    }
});

app.post("/register",async(req,res)=>{
    try{
        const {uname,email,password,profilepic}=req.body;
        const hash_password=await bcrypt.hash(password,10);
        const user=await UserModel.findOne({email:email});
        if(!user){
            const new_user=new UserModel({
                uname:uname,
                email:email,
                password:hash_password,
                profilepic:profilepic
            });
            await new_user.save();
            res.status(200).json({message:"Success"});
        }
        else{
            res.status(500).json({message:"User already exists..."});
        }
    }
    catch(error){
        res.send(error);
    }
});

app.post("/savePost",async(req,res)=>{
    try{
        const {postMsg,email,lat,lng}=req.body;
        const new_post=new PostModel({
            postMsg:postMsg,
            email:email,
            lat:lat,
            lng:lng
        });
        await new_post.save();
        res.status(200).json({message:"Success"});

    }
    catch(error){
        res.send(error);
    }
});

app.get("/getPosts",async(req,res)=>{
    try{
        const postsWithUser=await PostModel.aggregate([
            {
                $lookup:{
                    from:"Users",
                    localField:"email",
                    foreignField:"email",
                    as:"user"
                }
            },
            {
              $sort:{createdAt:-1}  
            },
            {
                "$project":{
                    "user._id":0,
                    "user.email":0,
                    "user.password":0,
                    "user.__v":0,
                }
            }

        ]);
        res.json({posts:postsWithUser});
    }
    catch(error){
        res.send(error);
    }
});
app.delete("/delPost",async(req,res)=>{
    try{
        const postsdel=await PostModel.deleteMany({})
        res.json({postsdel});
    }
    catch(error){
        res.send(error);
    }
});

app.put("/updatePost",async(req,res)=>{
    try{
        const post=await PostModel.findOne({_id:req.body._id});
        post.postMsg=req.body.postMsg;
        await post.save();
        res.status(200).json({post:post,message:"Success"});
    }
    catch(error){
        res.send(error);
    }
});

app.delete("/delPost/:pid",async(req,res)=>{
    try{
       const dpost=await PostModel.findOneAndDelete({_id:req.params.pid});
       res.send({deleted_post:dpost,message:"Post Deleted.."});
    }
    catch(error){
        res.send(error);
    }
});

