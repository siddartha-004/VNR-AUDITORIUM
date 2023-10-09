const exp = require("express");
const AddAudiApp = exp.Router();
require("dotenv").config()
const expressAsyncHandler=require('express-async-handler')
const multerObj=require("./middlewares/cloudinaryConfig")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")
const verifyToken=require("./middlewares/verifyToken")
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
    response.status(201).send({message:"Audi created"})
  }
}))
// AddAudiApp.post("/get-availabilty",expressAsyncHandler(async(request,response)=>{
//   console.log("first");
//   room_capacity = {
   
// }

//   console.log("second");
//   const AddAudiObj=request.app.get("AddAudi")
//   let Audi=await AddAudiObj.find().toArray();
//   room_capacity=Audi;
//   console.log(room_capacity)
//   const availability=request.app.get("audiavailability")
// let room_availability = await availability.find().toArray();
// const currentDate = new Date();
// const dateList = [currentDate]; // Initialize with the current date

// // Generate a list of future dates for the next 7 days
// for (let i = 1; i < 8; i++) {
//   const futureDate = new Date(currentDate);
//   futureDate.setDate(currentDate.getDate() + i);
//   dateList.push(futureDate.toISOString().slice(0, 10));
// }

// for (const dateItem of dateList) {
//   if (!(dateItem in room_availability)) {
//     // If the date is not in the dictionary, initialize it with room availability
//     room_availability[dateItem] = { A: true, B: true, C: true };
//   }

//   const availableRooms = [];
//   for (const room in roomCapacity) {
//     if (room_availability[dateItem][room] && numStudents <= roomCapacity[room]) {
//       availableRooms.push(room);
//     }
//   }

//   if (availableRooms.length > 0) {
//     // If there are available rooms, book the one with the least capacity
//     const minCapacityRoom = availableRooms.reduce((minRoom, room) =>
//       roomCapacity[room] < roomCapacity[minRoom] ? room : minRoom
//     );
//     room_availability[dateItem][minCapacityRoom] = false;
  
//   }
// }

// // If no room is available, suggest the next available date for each room
// const nextAvailableDates = {};
// for (const room in roomCapacity) {
//   nextAvailableDates[room] = null;
//   for (const dateItem of dateList) {
//     if (roomAvailability[dateItem][room]) {
//       nextAvailableDates[room] = dateItem;
//       break;
//     }
//   }
// }

// const unavailableRooms = Object.keys(nextAvailableDates).filter(room => !nextAvailableDates[room]);
// if (unavailableRooms.length === Object.keys(roomCapacity).length) {
// //   return No available room for ${numStudents} students. Next available dates for rooms: ${JSON.stringify(nextAvailableDates)};
//  } else {
//   const availableRoomList = Object.keys(roomCapacity).filter(room => nextAvailableDates[room]);
//   // return No available room for ${numStudents} students. Next available dates for rooms: ${JSON.stringify(nextAvailableDates)}. Rooms available on ${availableRoomList.join(', ')} on different dates.;
// }



// console.log("third")



// }))
AddAudiApp.get("/get-Audi",verifyToken,expressAsyncHandler(async(request,response)=>{
    const AddAudiObj=request.app.get("AddAudi")
    let Audi=await AddAudiObj.find().toArray();
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


