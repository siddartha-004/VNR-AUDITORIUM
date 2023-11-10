const exp = require("express");

const userApp = exp.Router();

require("dotenv").config()
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
userApp.use(bodyParser.json({ limit: '50mb' }));
userApp.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
userApp.use(bodyParser.json());
userApp.use(cors());
//import express-async-handler
const expressAsyncHandler=require('express-async-handler')

//import multerObj
const multerObj=require("./middlewares/cloudinaryConfig")

const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")
const verifyToken=require("./middlewares/verifyToken");
const { message } = require("antd");

//body parser
userApp.use(exp.json())
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vnrvjietaudis@gmail.com',
    pass: 'rjnh mspx eexs kosi',
  },
});
userApp.post('/send-email', async (req, res) => {
  console.log("req",req.body.recipient)
//   const { recipient, subject, message } = req.body;

const mailOptions = {
  from: 'vnrvjietaudis@gmail.com',
  to: req.body.recipient,
  subject: req.body.subject,
  text: req.body.message,
  
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error,"dsafsfdas");
    res.status(500).json({ error: 'Error sending email' });
  } else {
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  }
});
res.send("Supree");
});
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

userApp.get("/nonvacant-events",expressAsyncHandler(async(request,response)=>{
  const collection=request.app.get("audiavailability")
  //console.log(collection,"hello");
  const AudiObj = request.app.get("AddAudi")
   let Audi=await AudiObj.find().toArray();

   // calculate the dates
   //console.log(currentDate)
   // Format the start date and end date strings
   
   //console.log(date,"date")
   const roomNames = Audi
   const notavailableRoomsNextDays = [];
   for (let i = 0; i <= 14; i++) {
     
     const currentDateFormatted = new Date();
    currentDateFormatted.setDate(currentDateFormatted.getDate() + i);

    const nextDate2 =currentDateFormatted.toISOString().split('T')[0];
    
    
    for (const roomName of roomNames) {
      const c=({$and:[{date:nextDate2},{[`data.${roomName.Name1}.availableM`]:false}]});
      const d=({$and:[{date:nextDate2},{[`data.${roomName.Name1}.availableA`]:false}]});
  const result1 = await collection.findOne(c);
  const result2 = await collection.findOne(d);
  if(result1!=null&&result2!=null)
  {
    const y=roomName.Name1;
    const z=result1.data[y];
  
  
    result1.bookeddetails=z;
    result1.bookedaudi=y;
  notavailableRoomsNextDays.push(result1);
  }
  else if(result1!==null)
  {
    let x=roomName.Name1;

    let y=result1.data[x];
  
    result1.bookeddetails=y;
    result1.bookedaudi=x;
    
    notavailableRoomsNextDays.push(result1);
  
  }
  else if(result2!==null)
  {
    let x=roomName.Name1;

    let y=result2.data[x];
  
    result2.bookeddetails=y;
    result2.bookedaudi=x;
    
    notavailableRoomsNextDays.push(result2);
  
  }
    
    }
  }
  if (notavailableRoomsNextDays.length > 0) {
    response.status(200).send({payload:notavailableRoomsNextDays,message:"booked"})
  } else {
    response.status(200).send({message:"No booked events"})
    }


  // Print the available rooms for the next three days
  

}))
userApp.get("/vacant-events",expressAsyncHandler(async(request,response)=>{
  const collection=request.app.get("audiavailability")
  //console.log(collection,"hello");
  const AudiObj = request.app.get("AddAudi")
   let Audi=await AudiObj.find().toArray();

   // calculate the dates
   //console.log(currentDate)
   // Format the start date and end date strings
   
   //console.log(date,"date")
   const roomNames = Audi
   const availableRoomsNextDays = [];
   for (let i = 0; i <= 14; i++) {
     
     const currentDateFormatted = new Date();
    currentDateFormatted.setDate(currentDateFormatted.getDate() + i);

    const nextDate2 =currentDateFormatted.toISOString().split('T')[0];

    
    for (const roomName of roomNames) {
      const c=({$and:[{date:nextDate2},{[`data.${roomName.Name1}.availableM`]:true}]});
      const d=({$and:[{date:nextDate2},{[`data.${roomName.Name1}.availableA`]:true}]});
  const result1 = await collection.findOne(c);
  const result2 = await collection.findOne(d);
  if(result1!==null)
  {
    result1.vacantdate=nextDate2;
    result1.availableaudi=roomName.Name1;
    result1.capacity=roomName.Capacity
    result1.time="Morning"
    availableRoomsNextDays.push(result1);
  
  }
   if(result2!==null)
  {
    result2.vacantdate=nextDate2;
    result2.availableaudi=roomName.Name1;
    result2.capacity=roomName.Capacity
    result2.time="Afternoon"
    availableRoomsNextDays.push(result2);
  
  }
   //console.log(result1,"res")
    
    }
  }
  if (availableRoomsNextDays.length > 0) {
    response.status(200).send({payload:availableRoomsNextDays,message:"available"})
  } else {
    response.status(200).send({message:"No available slots"})
    }


  // Print the available rooms for the next three days
  

}))
userApp.get("/current-event",expressAsyncHandler(async(request,response)=>{
 
  const collection=request.app.get("audiavailability")
   const AudiObj = request.app.get("AddAudi")
    const currentDate = new Date();
    const currentDateFormatted = currentDate.toISOString().split('T')[0];
  
    let Audi=await AudiObj.find().toArray();
    const roomNames = Audi;
    const Todaysevents = [];
  for (const roomName of roomNames) {
      const c=({$and:[{date:currentDateFormatted},{[`data.${roomName.Name1}.availableM`]:false}]});
      const d=({$and:[{date:currentDateFormatted},{[`data.${roomName.Name1}.availableA`]:false}]});
  const result1 = await collection.findOne(c);
  const result2 = await collection.findOne(d);
  if(result1!=null&&result2!=null)
  {
    const y=roomName.Name1;
    const z=result1.data[y];
  
  
    result1.bookeddetails=z;
    result1.bookedaudi=y;
  Todaysevents.push(result1);
  }else if(result1!=null)
  {
    const y=roomName.Name1;
    const z=result1.data[y];
  
  
    result1.bookeddetails=z;
    result1.bookedaudi=y;
  Todaysevents.push(result1);
  }else if(result2!=null)
  {
    
    const y=roomName.Name1;
    const z=result2.data[y];
  
  
    result2.bookeddetails=z;
    result2.bookedaudi=y;
  Todaysevents.push(result2);
  }

    }
    if (Todaysevents.length > 0) {
     
      response.status(200).send({payload:Todaysevents,message:"having"})
    } else {
      response.status(200).send({message:"No events Today!"})
    }
}))
userApp.get("/upcoming-event",expressAsyncHandler(async(request,response)=>{
 
  const collection=request.app.get("audiavailability")
   const AudiObj = request.app.get("AddAudi")
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const currentDateFormatted = currentDate.toISOString().split('T')[0];
    let Audi=await AudiObj.find().toArray();
    const roomNames = Audi;
    const Tomorrowsevents = [];
  for (const roomName of roomNames) {
      const c=({$and:[{date:currentDateFormatted},{[`data.${roomName.Name1}.availableM`]:false}]});
      const d=({$and:[{date:currentDateFormatted},{[`data.${roomName.Name1}.availableA`]:false}]});
  const result1 = await collection.findOne(c);
  const result2 = await collection.findOne(d);
  if(result1!=null)
  {
    const y=roomName.Name1;
    const z=result1.data[y];
    
    result1.bookeddetails=z;
    result1.bookedaudi=y;
  Tomorrowsevents.push(result1);
  }
  if(result2!=null)
  {
    const y=roomName.Name1;
    const z=result2.data[y];
    
    result2.bookeddetails=z;
    result2.bookedaudi=y;
  Tomorrowsevents.push(result2);
  }
    }
    if (Tomorrowsevents.length > 0) {
      response.status(200).send({payload:Tomorrowsevents,message:"having"})
    } else {
      response.status(200).send({message:"No events Upcoming"})
    }
}))
userApp.post("/book-priority",multerObj.single('photo'),expressAsyncHandler(async(request,response)=>{
  const newSearch=JSON.parse(request.body.search);
  //console.log(newSearch.date);
  newSearch.image=request.file.path;
  const collection=request.app.get("audiavailability")
  //console.log(collection,"hello");
  const AudiObj = request.app.get("AddAudi")

   let Audi=await AudiObj.find({}, { sort: { Capacity: 1 } }).toArray();



   // calculate the dates
   const currentDate = new Date();
   //console.log(currentDate)
   // Format the start date and end date strings
   const currentDateFormatted = currentDate.toISOString().split('T')[0];
   //console.log(currentDateFormatted)
   const deleteResult = await collection.deleteMany({ date: {$lt: currentDateFormatted } });
   //console.log(deleteResult)
   const numDeleted = deleteResult.deletedCount;
   //console.log(numDeleted)
   const maxDate = await collection.findOne({}, { sort: { date: -1 } });
   
   //console.log(maxDate)
   // add corresponding date's
   for(let i=1;i<=numDeleted;i++){
     const nextDate = new Date(maxDate.date);
     //console.log(nextDate)
    nextDate.setDate(nextDate.getDate() + i);
    const nextDateFormatted = nextDate.toISOString().split('T')[0];

     const newDocuments = {};
     Audi.forEach(roomName => {
       newDocuments[roomName.Name1] = { availableM: true, who_bookedM: null,availableA: true, who_bookedA: null, capacity: Number(roomName.Capacity) };
    });
     await collection.insertOne({ date: nextDateFormatted, data: newDocuments });
   }


  // now do the booking logic
   // get the collection
   let roomFound = false;
   const desiredCapacity = newSearch.Capacity;
   //console.log(newSearch)
   const date = newSearch.date;
   const description=newSearch
   //console.log(date,"date")
   const roomNames = Audi

   if(newSearch.timing==="FN")
   {
    
    for (const roomName of roomNames) 
    {
    console.log("hello")
    const a=({$and:[{date:newSearch.date},{[`data.${roomName.Name1}.capacity`]:{$gte:Number(desiredCapacity)}}]});
    const b=({$set:{[`data.${roomName.Name1}.availableM`]:false}})
    const c=({$set:{[`data.${roomName.Name1}.who_bookedM`]:newSearch}})
    const result1=await collection.updateOne(a,c);
     
    const result = await collection.updateOne(a,b);
    console.log(result);
    if (result1.modifiedCount > 0) {
      console.log("print")
      response.status(201).send({pay:1,message:`${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} is now marked as unavailable in Morning.`});
     break;
    }
    
    
   }
   }else{
    
   for (const roomName of roomNames) 
   {
    const d=({$and:[{date:newSearch.date},{[`data.${roomName.Name1}.capacity`]:{$gte:Number(desiredCapacity)}}]});
    const e=({$set:{[`data.${roomName.Name1}.availableA`]:false}})
    const f=({$set:{[`data.${roomName.Name1}.who_bookedA`]:newSearch}})
    const result2=await collection.updateOne(d,f);
    console.log(result2);
    const result3 = await collection.updateOne(d,e);
    if(result2.modifiedCount>0&&result3.modifiedCount===0)
    {
      
    }
    if (result2.modifiedCount > 0) {
      response.status(201).send({pay:1,message:`${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} is now marked as unavailable in Afternoon.`});
     break;
    }
     
   }
   }

   
    
  
}))
userApp.post("/book-audi",multerObj.single('photo'),expressAsyncHandler(async(request,response)=>{
  const newSearch=JSON.parse(request.body.search);
  //console.log(newSearch.date);
  newSearch.image=request.file.path;
  const collection=request.app.get("audiavailability")
  //console.log(collection,"hello");
  const AudiObj = request.app.get("AddAudi")

   let Audi=await AudiObj.find({}, { sort: { Capacity: 1 } }).toArray();



   // calculate the dates
   const currentDate = new Date();
   //console.log(currentDate)
   // Format the start date and end date strings
   const currentDateFormatted = currentDate.toISOString().split('T')[0];
   //console.log(currentDateFormatted)
   const deleteResult = await collection.deleteMany({ date: {$lt: currentDateFormatted } });
   //console.log(deleteResult)
   const numDeleted = deleteResult.deletedCount;
   //console.log(numDeleted)
   const maxDate = await collection.findOne({}, { sort: { date: -1 } });
   
   //console.log(maxDate)
   // add corresponding date's
   for(let i=1;i<=numDeleted;i++){
     const nextDate = new Date(maxDate.date);
     //console.log(nextDate)
    nextDate.setDate(nextDate.getDate() + i);
    const nextDateFormatted = nextDate.toISOString().split('T')[0];

     const newDocuments = {};
     Audi.forEach(roomName => {
       newDocuments[roomName.Name1] = { availableM: true, who_bookedM: null,availableA: true, who_bookedA: null, capacity: Number(roomName.Capacity) };
    });
     await collection.insertOne({ date: nextDateFormatted, data: newDocuments });
   }


  // now do the booking logic
   // get the collection
   let roomFound = false;
   const desiredCapacity = newSearch.Capacity;
   //console.log(newSearch)
   const date = newSearch.date;
   const description=newSearch
   //console.log(date,"date")
   const roomNames = Audi

   for (const roomName of roomNames) 
   {
    //console.log(roomName)
  
     
       const a=({$and:[{date:date},{[`data.${roomName.Name1}.capacity`]:{$gte:Number(desiredCapacity)}},{[`data.${roomName.Name1}.availableM`]:true}]});
       const b=({$set:{[`data.${roomName.Name1}.availableM`]:false}})
       const c=({$set:{[`data.${roomName.Name1}.who_bookedM`]:newSearch}})
       const result1=await collection.updateOne(a,c);
       console.log(result1);
       const result = await collection.updateOne(a,b);
     
     
     if (result.modifiedCount > 0) {
       response.status(201).send({pay:1,message:`${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} is now marked as unavailable in Morning.`});
      
       roomFound = true;
      break;
    }
    const d=({$and:[{date:date},{[`data.${roomName.Name1}.capacity`]:{$gte:Number(desiredCapacity)}},{[`data.${roomName.Name1}.availableA`]:true}]});
    const e=({$set:{[`data.${roomName.Name1}.availableA`]:false}})
    const f=({$set:{[`data.${roomName.Name1}.who_bookedA`]:newSearch}})
    const result2=await collection.updateOne(d,f);
    console.log(result2);
    const result3 = await collection.updateOne(d,e);
  
  
  if (result3.modifiedCount > 0) {
    response.status(201).send({pay:1,message:`${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} is now marked as unavailable in Afternoon.`});
   
    roomFound = true;
   break;
 }
  }
   // if room is not available
  

  if (!roomFound) {
    const availableRoomsNextThreeDays = [];

    for (let i = 1; i <= 3; i++) {
      
      const nextDate1 = new Date(newSearch.date);
      //console.log(currentDate,"cur")
      nextDate1.setDate(nextDate1.getDate() + i);
      const nextDate2 = nextDate1.toISOString().split('T')[0];
      

      for (const roomName of roomNames) {
        const c=({$and:[{date:nextDate2},{[`data.${roomName.Name1}.capacity`]:{$gte:Number(desiredCapacity)}},{[`data.${roomName.Name1}.availableM`]:true}]});
    const result1 = await collection.findOne(c);
    if(result1!==null)
    {
      availableRoomsNextThreeDays.push(`${roomName.Name1} Auditorium on ${nextDate2} in morning\n`);
    
    }
    const d=({$and:[{date:nextDate2},{[`data.${roomName.Name1}.capacity`]:{$gte:Number(desiredCapacity)}},{[`data.${roomName.Name1}.availableA`]:true}]});
    const result2= await collection.findOne(d);
    if(result2!==null)
    {
      availableRoomsNextThreeDays.push(`${roomName.Name1} Auditorium on ${nextDate2} in afternoon\n`);
    
    }
     //console.log(result1,"res")
      
      }
    }
    if (availableRoomsNextThreeDays.length > 0) {
       response.status(201).send({pay:2,message:availableRoomsNextThreeDays})
    } else {
      response.status(201).send({pay:3,message:`No available Auditoriums with capacity ${desiredCapacity} for the next three days.`});
    }


    // Print the available rooms for the next three days
    
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