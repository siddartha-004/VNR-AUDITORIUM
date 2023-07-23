const exp = require("express");

const userApp = exp.Router();

require("dotenv").config()

//import express-async-handler
const expressAsyncHandler=require('express-async-handler')

//import multerObj
const multerObj=require("./middlewares/cloudinaryConfig")

const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")
const verifyToken=require("./middlewares/verifyToken")

//body parser
userApp.use(exp.json())
userApp.post('/login-user',expressAsyncHandler(async(request,response)=>{

  //get user collection
  const userCollectionObj=request.app.get("userCollection")

  //get user from client
  const userCredentialsObj=request.body;

  //verify username of userCredentialsObj
  let userOfDB=await userCollectionObj.findOne({username:userCredentialsObj.username})

  //if username is invalid
  if(userOfDB===null){
    response.status(200).send({message:"Invalid username"})
  }
  //if username is valid
  else{
    //compare passwords
    let isEqual=await bcryptjs.compare(userCredentialsObj.password,userOfDB.password)
    //if passwords not matched
    if(isEqual===false){
      response.status(200).send({message:"Invalid password"})
    }
    //passwords are matched
    else{
      //create JWT token
      let signedJWTToken=jwt.sign({username:userOfDB.username},process.env.SECRET_KEY,{expiresIn:"1d"})
      //send token in response
      
      response.status(200).send({message:"success",token:signedJWTToken,user:userOfDB})
    }

  }

}))
userApp.post("/register-user",multerObj.single('photo'),expressAsyncHandler(async(request,response)=>{

    //get user collection
    const userCollectionObj=request.app.get("userCollection")
  
    //get user from client
    const newUser=JSON.parse(request.body.user);
  
    //verify user is already existed
   const userOfDB= await userCollectionObj.findOne({username:newUser.username})
  
    //if user already existed
    if(userOfDB!==null){
      response.status(200).send({message:"User already existed"})
    }
    //if user not existed
    else{
  
      //add CDN link of cloudinary image to user obj
      newUser.image=request.file.path;
      //hash the password of newUser
      let hashedPassword=await bcryptjs.hash(newUser.password,6)
      //replace palin password with hased password
      newUser.password=hashedPassword;
      //insert user
      await userCollectionObj.insertOne(newUser)
      //send response
      response.status(201).send({message:"User created"})
    }
  }))
userApp.get("/get-admin",expressAsyncHandler(async(request,response)=>{


    //get user collection
   const userObj=request.app.get("userCollection")

   //get username from url

   //find user by iusername
 
   let User=await userObj.find({typeofuser:"Admin"}).toArray();
  
 

   //send res
   response.status(200).send({payload:User})

}))
userApp.put("/edit-user/:id",expressAsyncHandler(async(request,response)=>{
  const userObj1=request.app.get("userCollection")
  console.log("hello")
 const id=+request.params.id;
 let modifiedUser=request.body;
 let hashedPassword=await bcryptjs.hash(modifiedUser.password,6)
 //replace palin password with hased password
 modifiedUser.password=hashedPassword;
 let dbRes=await userObj1.updateOne({image:modifiedUser.image},{$set:{...modifiedUser}}).then(dbRes=>{
   response.status(201).send({message:"User updated"})
   console.log("updtaed")
   console.log(dbRes);
 })

}))
userApp.put("/edit-admin/:id",expressAsyncHandler(async(request,response)=>{
  const userObj1=request.app.get("userCollection")
  console.log("hello")
 const id=+request.params.id;
 let modifiedAdmin=request.body;
 let hashedPassword=await bcryptjs.hash(modifiedAdmin.password,6)
 //replace palin password with hased password
 modifiedAdmin.password=hashedPassword;
 let dbRes=await userObj1.updateOne({image:modifiedAdmin.image},{$set:{...modifiedAdmin}}).then(dbRes=>{
   response.status(201).send({message:"User updated"})
   console.log("updtaed")
   console.log(dbRes);
 })

}))
userApp.get("/get-user",expressAsyncHandler(async(request,response)=>{


  //get user collection
 const userObj=request.app.get("userCollection")

 //get username from url

 //find user by iusername

 let User=await userObj.find({typeofuser:"User"}).toArray();



 //send res
 response.status(200).send({payload:User})

}))
userApp.delete("/remove/:name",expressAsyncHandler(async(request,response)=>{
  const userObj1=request.app.get("userCollection")
 const name=request.params.name;
 let dbRes=await userObj1.deleteOne({clubname:name}).then(dbRes=>{
   response.status(201).send({message:"User removed"})
 })

}))
  module.exports = userApp;