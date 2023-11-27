const exp = require("express");
const AddAudiApp = exp.Router();
require("dotenv").config()
const expressAsyncHandler=require('express-async-handler')
const multerObj=require("./middlewares/cloudinaryConfig")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")
const verifyToken=require("./middlewares/verifyToken")
const extractUsernameMiddleware = (req, res, next) => {
  // Assuming the username is in the Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Assuming the header is in the format: Bearer <token>
    const token = authHeader.split(' ')[1];

    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Replace 'your-secret-key' with your actual secret key

      // Assuming the username is stored in the decoded token
      const username = decodedToken.username;

      // Attach the username to the request object for further use
      req.username = username;
    } catch (error) {
      console.error('Error decoding token:', error.message);
      // Handle token verification errors
    }
  }

  // Continue to the next middleware or route handler
  next();
};
AddAudiApp.use(exp.json())
AddAudiApp.post("/register-audi",multerObj.single('photo'),expressAsyncHandler(async(request,response)=>{
  const AddAudiObj=request.app.get("AddAudi")
  const newAudi=JSON.parse(request.body.Audi);
 const AudiOfDB= await AddAudiObj.findOne({Name1:newAudi.Name1})
  if(AudiOfDB!==null){
    response.status(200).send({message:"Audi already existed"})
  }
  else{
    newAudi.image=request.file.path;
    await AddAudiObj.insertOne(newAudi)
    const audiavailability=request.app.get("audiavailability")
    
    

audiavailability.updateMany({},{ $set: { [`data.${newAudi.Name1}`]: { availableM1: true,availableM2: true,availableM3: true, who_bookedM1: null, who_bookedM2: null, who_bookedM3: null,availableA1: true,availableA2: true,availableA3: true, who_bookedA1: null,who_bookedA2: null,who_bookedA3: null, capacity: Number(newAudi.Capacity) } } });

    response.status(201).send({message:"Audi created"})
  }
}))

AddAudiApp.get("/get-Audi",verifyToken,expressAsyncHandler(async(request,response)=>{
  
    const AddAudiObj=request.app.get("AddAudi")
    let Audi=await AddAudiObj.find().toArray();
    response.status(200).send({payload:Audi})
}))
AddAudiApp.get("/get-MyEvents",verifyToken,extractUsernameMiddleware,expressAsyncHandler(async(request,response)=>{
  const username = request.username;
  
   const userCollectionObj = request.app.get("userCollection")
   let userOfDB = await userCollectionObj.findOne({ username: username })
   let coordinatorname=userOfDB.coordinatorname;
   
  const collection = request.app.get("audiavailability")
  const AudiObj = request.app.get("AddAudi")
  const currentDate = new Date();
 

  let Audi = await AudiObj.find().toArray();
  const roomNames = Audi;
  const Todaysevents = [];
  for (let i = 0; i <= 14; i++) {
    const currentDateFormatted1 = new Date();
    currentDateFormatted1.setDate(currentDateFormatted1.getDate() + i);

    const currentDateFormatted = currentDateFormatted1.toISOString().split('T')[0];


    for (const roomName of roomNames) {
      const c = ({ $and: [{ date: currentDateFormatted }, { [`data.${roomName.Name1}.availableM1`]: false }] });
      const d = ({ $and: [{ date: currentDateFormatted }, { [`data.${roomName.Name1}.availableM2`]: false }] });
      const result1 = await collection.findOne(c);
      const result2 = await collection.findOne(d);
      const e = ({ $and: [{ date: currentDateFormatted }, { [`data.${roomName.Name1}.availableM3`]: false }] });
      const f = ({ $and: [{ date: currentDateFormatted }, { [`data.${roomName.Name1}.availableA1`]: false }] });
      const result3 = await collection.findOne(e);
      const result4 = await collection.findOne(f);
      const g = ({ $and: [{ date: currentDateFormatted }, { [`data.${roomName.Name1}.availableA2`]: false }] });
      const h = ({ $and: [{ date: currentDateFormatted }, { [`data.${roomName.Name1}.availableA3`]: false }] });
      const result5 = await collection.findOne(g);
      const result6 = await collection.findOne(h);

      if (result1 != null) {
        const y = roomName.Name1;
        // const z=result1.data[y];


        // result1.bookeddetails=z;
        result1.bookedaudi = y;
        //console.log(result1);
        let requireddata = result1.data[y].who_bookedM1;
        requireddata.bookedaudi = y;
        requireddata.timeslot = "M1";
        //console.log(requireddata,"required")
        if(requireddata.coordinatorname===coordinatorname)
        {
        Todaysevents.push(requireddata);
        }



      }
      if (result2 != null) {
        const y = roomName.Name1;
        // const z=result2.data[y];


        // result2.bookeddetails=z;
        result2.bookedaudi = y;

        //console.log(result1);
        let requireddata = result2.data[y].who_bookedM2;
        requireddata.bookedaudi = y
        requireddata.timeslot = "M2";
        //console.log(requireddata,"required")
        if(requireddata.coordinatorname===coordinatorname)
        {
        Todaysevents.push(requireddata);
        }
        //console.log(Todaysevents,"2")
      } if (result3 != null) {
        const y = roomName.Name1;
        // const z=result3.data[y];


        // result3.bookeddetails=z;
        result3.bookedaudi = y;
        //console.log(result1);
        let requireddata = result3.data[y].who_bookedM3;
        requireddata.bookedaudi = y;
        requireddata.timeslot = "M3";
        //console.log(requireddata,"required")
        if(requireddata.coordinatorname===coordinatorname)
        {
        Todaysevents.push(requireddata);
        }
        //console.log(Todaysevents,"3")
      }
      if (result4 != null) {
        const y = roomName.Name1;
        // const z=result4.data[y];


        // result4.bookeddetails=z;
        result4.bookedaudi = y;
        //console.log(result1);
        let requireddata = result4.data[y].who_bookedA1;
        requireddata.bookedaudi = y;
        requireddata.timeslot = "A1";
        if(requireddata.coordinatorname===coordinatorname)
        {
        Todaysevents.push(requireddata);
        }
        //console.log(Todaysevents,"4")
      } if (result5 != null) {
        const y = roomName.Name1;
        // const z=result5.data[y];


        // result5.bookeddetails=z;
        result5.bookedaudi = y;
        //console.log(result1);
        let requireddata = result5.data[y].who_bookedA2;
        requireddata.bookedaudi = y;
        //console.log(requireddata,"required")
        requireddata.timeslot = "A2";
        if(requireddata.coordinatorname===coordinatorname)
        {
        Todaysevents.push(requireddata);
        }
        //console.log(Todaysevents,"5")
      }
      if (result6 != null) {
        const y = roomName.Name1;
        // const z=result6.data[y];


        // result6.bookeddetails=z;
        result6.bookedaudi = y;
        //console.log(result1);
        let requireddata = result6.data[y].who_bookedA3;
        requireddata.bookedaudi = y;
        requireddata.timeslot = "A3";
        //console.log(requireddata,"required")
        if(requireddata.coordinatorname===coordinatorname)
        {
        Todaysevents.push(requireddata);
        }
        //console.log(Todaysevents,"6")
      }


    }

  }
 

  if (Todaysevents.length > 0) {
  
    response.status(200).send({ payload: Todaysevents, message: "booked" })
  } else {
    response.status(200).send({ message: "No events Today!" })
  }


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
 const audiavailability=request.app.get("audiavailability")
 audiavailability.updateMany({},{ $unset: { [`data.${name}`]: { availableM1: true,availableM2: true,availableM3: true, who_bookedM1: null, who_bookedM2: null, who_bookedM3: null,availableA1: true,availableA2: true,availableA3: true, who_bookedA1: null,who_bookedA2: null,who_bookedA3: null } } });
 let dbRes=await AddAudiObj1.deleteOne({Name1:name}).then(
  dbRes=>{
   
    
   response.status(201).send({message:"Audi removed"})
 })
}))

module.exports = AddAudiApp;


