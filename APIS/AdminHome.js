const exp = require("express");

const AddAudiApp = exp.Router();

require("dotenv").config()

//import express-async-handler
const expressAsyncHandler=require('express-async-handler')

//import multerObj
const multerObj=require("./middlewares/cloudinaryConfig")

const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")
const verifyToken=require("./middlewares/verifyToken")

//body parser
AddAudiApp.use(exp.json())


//CREATE  USER API


//register user
//PUBLIC ROUTE
AddAudiApp.post("/register-audi",multerObj.single('photo'),expressAsyncHandler(async(request,response)=>{

  //get user collection
  const AddAudiObj=request.app.get("AddAudi")

  //get user from client
  const newAudi=JSON.parse(request.body.Audi);

  //verify user is already existed
 const AudiOfDB= await AddAudiObj.findOne({Name1:newAudi.Name1})

  //if user already existed
  if(AudiOfDB!==null){
    response.status(200).send({message:"Audi already existed"})
  }
  //if user not existed
  else{

    //add CDN link of cloudinary image to user obj
    newAudi.image=request.file.path;
 
    //insert user
    await AddAudiObj.insertOne(newAudi)
    //send response
    response.status(201).send({message:"Audi created"})
  }
}))

AddAudiApp.get("/get-Audi",verifyToken,expressAsyncHandler(async(request,response)=>{


     //get user collection
    const AddAudiObj=request.app.get("AddAudi")

    //get username from url

    //find user by iusername
    let Audi=await AddAudiObj.find().toArray();
  

    //send res
    response.status(200).send({payload:Audi})

}))
AddAudiApp.put("/edit-audi/:id",expressAsyncHandler(async(request,response)=>{
  const AddAudiObj1=request.app.get("AddAudi")
 const id=+request.params.id;
 let modifiedAudi=request.body;
 let dbRes=await AddAudiObj1.updateOne({image:modifiedAudi.image},{$set:{...modifiedAudi}}).then(dbRes=>{
   response.status(201).send({message:"Audi updated"})
   console.log(dbRes);
 })

}))
AddAudiApp.delete("/remove/:name",expressAsyncHandler(async(request,response)=>{
  const AddAudiObj1=request.app.get("AddAudi")
 const name=request.params.name;
 let dbRes=await AddAudiObj1.deleteOne({Name1:name}).then(dbRes=>{
   response.status(201).send({message:"Audi removed"})
 })

}))
module.exports = AddAudiApp;


