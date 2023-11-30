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
//import express-async-handler
const expressAsyncHandler = require('express-async-handler')

//import multerObj
const multerObj = require("./middlewares/cloudinaryConfig")

const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const verifyToken = require("./middlewares/verifyToken");
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
  console.log("req", req.body.recipient)
  //   const { recipient, subject, message } = req.body;

  const mailOptions = {
    from: 'vnrvjietaudis@gmail.com',
    to: req.body.recipient,
    subject: req.body.subject,
    text: req.body.message,

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error, "dsafsfdas");
      res.status(500).json({ error: 'Error sending email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
  res.send("Supree");
});
userApp.post('/login-user', expressAsyncHandler(async (request, response) => {

  //get user collection
  const userCollectionObj = request.app.get("userCollection")

  //get user from client
  const userCredentialsObj = request.body;

  //verify username of userCredentialsObj
  let userOfDB = await userCollectionObj.findOne({ username: userCredentialsObj.username })

  //if username is invalid
  if (userOfDB === null) {
    response.status(200).send({ message: "Invalid username" })
  }
  //if username is valid
  else {
    //compare passwords
    let isEqual = await bcryptjs.compare(userCredentialsObj.password, userOfDB.password)
    //if passwords not matched
    if (isEqual === false) {
      response.status(200).send({ message: "Invalid password" })
    }
    //passwords are matched
    else {
      //create JWT token
      let signedJWTToken = jwt.sign({ username: userOfDB.username }, process.env.SECRET_KEY, { expiresIn: "1d" })
      //send token in response

      response.status(200).send({ message: "success", token: signedJWTToken, user: userOfDB })
    }

  }

}))
userApp.get("/nonvacant-events", expressAsyncHandler(async (request, response) => {

  const collection = request.app.get("audiavailability")
  const AudiObj = request.app.get("AddAudi")
  const currentDate = new Date();
  console.log("ppp")

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
        Todaysevents.push(requireddata);



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
        Todaysevents.push(requireddata);
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
        Todaysevents.push(requireddata);
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

        Todaysevents.push(requireddata);
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
        Todaysevents.push(requireddata);
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
        Todaysevents.push(requireddata);
        //console.log(Todaysevents,"6")
      }


    }

  }
  console.log(Todaysevents, "lo")

  if (Todaysevents.length > 0) {
    console.log("yuu", Todaysevents)
    response.status(200).send({ payload: Todaysevents, message: "booked" })
  } else {
    response.status(200).send({ message: "No events Today!" })
  }
}))
userApp.get("/vacant-events", expressAsyncHandler(async (request, response) => {
  const collection = request.app.get("audiavailability")
  //console.log(collection,"hello");
  const AudiObj = request.app.get("AddAudi")
  let Audi = await AudiObj.find().toArray();

  // calculate the dates
  //console.log(currentDate)
  // Format the start date and end date strings

  //console.log(date,"date")
  const roomNames = Audi
  const availableRoomsNextDays = [];
  for (let i = 0; i <= 14; i++) {

    const currentDateFormatted = new Date();
    currentDateFormatted.setDate(currentDateFormatted.getDate() + i);

    const nextDate2 = currentDateFormatted.toISOString().split('T')[0];


    for (const roomName of roomNames) {
      const morningSlots = ['M1', 'M2', 'M3'];
      const afternoonSlots = ['A1', 'A2', 'A3'];
      const availableMorningSlots = [];
      const availableAfternoonSlots = [];

      // Check morning slots
      for (const slot of morningSlots) {
        const query = { $and: [{ date: nextDate2 }, { [`data.${roomName.Name1}.available${slot}`]: true }] };
        const result = await collection.findOne(query);

        if (result !== null) {
          availableMorningSlots.push(parseInt(slot.substring(1), 10)); // Extract the number from the slot name and convert to an integer
        }
        else {
          availableMorningSlots.push(0);
        }
      }

      // Check afternoon slots
      for (const slot of afternoonSlots) {
        const query = { $and: [{ date: nextDate2 }, { [`data.${roomName.Name1}.available${slot}`]: true }] };
        const result = await collection.findOne(query);

        if (result !== null) {
          availableAfternoonSlots.push(parseInt(slot.substring(1), 10)); // Extract the number from the slot name and convert to an integer
        } else {
          availableAfternoonSlots.push(0);
        }
      }

      // Add to availableRoomsNextDays if there are available morning slots
      if (availableMorningSlots.length > 0) {
        availableRoomsNextDays.push({
          vacantdate: nextDate2,
          availableaudi: roomName.Name1,
          capacity: roomName.Capacity,
          time: 'Morning',
          slots: availableMorningSlots
        });
      }

      // Add to availableRoomsNextDays if there are available afternoon slots
      if (availableAfternoonSlots.length > 0) {
        availableRoomsNextDays.push({
          vacantdate: nextDate2,
          availableaudi: roomName.Name1,
          capacity: roomName.Capacity,
          time: 'Afternoon',
          slots: availableAfternoonSlots
        });
      }


    }
  }
  console.log(availableRoomsNextDays, "availjo")
  if (availableRoomsNextDays.length > 0) {
    response.status(200).send({ payload: availableRoomsNextDays, message: "available" })
  } else {
    response.status(200).send({ message: "No available slots" })
  }


  // Print the available rooms for the next three days


}))
userApp.get("/current-event", expressAsyncHandler(async (request, response) => {

  const collection = request.app.get("audiavailability")
  const AudiObj = request.app.get("AddAudi")
  const currentDate = new Date();
  const currentDateFormatted = currentDate.toISOString().split('T')[0];

  let Audi = await AudiObj.find().toArray();
  const roomNames = Audi;
  const Todaysevents = [];
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
      Todaysevents.push(requireddata);


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
      Todaysevents.push(requireddata);
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
      Todaysevents.push(requireddata);
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

      Todaysevents.push(requireddata);
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
      Todaysevents.push(requireddata);
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
      Todaysevents.push(requireddata);
      //console.log(Todaysevents,"6")
    }
    //console.log(Todaysevents,"lo")

  }

  if (Todaysevents.length > 0) {

    response.status(200).send({ payload: Todaysevents, message: "having" })
  } else {
    response.status(200).send({ message: "No events Today!" })
  }
}))
userApp.get("/upcoming-event", expressAsyncHandler(async (request, response) => {

  const collection = request.app.get("audiavailability")
  const AudiObj = request.app.get("AddAudi")
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const currentDateFormatted = currentDate.toISOString().split('T')[0];
  let Audi = await AudiObj.find().toArray();
  const roomNames = Audi;
  const Tomorrowsevents = [];
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
      Tomorrowsevents.push(requireddata);


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
      Tomorrowsevents.push(requireddata);
      //console.log(Tomorrowsevents,"2")
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
      Tomorrowsevents.push(requireddata);
      //console.log(Tomorrowsevents,"3")
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

      Tomorrowsevents.push(requireddata);
      //console.log(Tomorrowsevents,"4")
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
      Tomorrowsevents.push(requireddata);
      //console.log(Tomorrowsevents,"5")
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
      Tomorrowsevents.push(requireddata);
      //console.log(Tomorrowsevents,"6")
    }


  }
  if (Tomorrowsevents.length > 0) {
    response.status(200).send({ payload: Tomorrowsevents, message: "having" })
  } else {
    response.status(200).send({ message: "No events Upcoming" })
  }
}))
userApp.post("/book-priority", multerObj.single('photo'), expressAsyncHandler(async (request, response) => {
  const newSearch = JSON.parse(request.body.search);
  console.log(newSearch, "bookprior");
  newSearch.image = request.file.path;
  const collection = request.app.get("audiavailability")
  //console.log(collection,"hello");
  const AudiObj = request.app.get("AddAudi")

  let Audi = await AudiObj.find({}, { sort: { Capacity: 1 } }).toArray();



  // calculate the dates
  const currentDate = new Date();
  //console.log(currentDate)
  // Format the start date and end date strings
  const currentDateFormatted = currentDate.toISOString().split('T')[0];
  //console.log(currentDateFormatted)
  const deleteResult = await collection.deleteMany({ date: { $lt: currentDateFormatted } });
  //console.log(deleteResult)
  const numDeleted = deleteResult.deletedCount;
  //console.log(numDeleted)
  const maxDate = await collection.findOne({}, { sort: { date: -1 } });

  //console.log(maxDate)
  // add corresponding date's
  for (let i = 1; i <= numDeleted; i++) {
    const nextDate = new Date(maxDate.date);
    //console.log(nextDate)
    nextDate.setDate(nextDate.getDate() + i);
    const nextDateFormatted = nextDate.toISOString().split('T')[0];

    const newDocuments = {};
    Audi.forEach(roomName => {
      newDocuments[roomName.Name1] = { availableM1: true, availableM2: true, availableM3: true, who_bookedM1: null, who_bookedM2: null, who_bookedM3: null, availableA1: true, availableA2: true, availableA3: true, who_bookedA1: null, who_bookedA2: null, who_bookedA3: null, capacity: Number(roomName.Capacity) };
    });
    newDocuments[waiting]=[];
    await collection.insertOne({ date: nextDateFormatted, data: newDocuments });
  }




  // now do the booking logic
  // get the collection

  const desiredCapacity = newSearch.Capacity;
  //console.log(newSearch)
  const date = newSearch.date;
  const description = newSearch
  //console.log(date,"date")
  const roomNames = Audi
  const slots = newSearch.time;
  const audigiven = newSearch.Audiname;
  let previousbookings = [];
  let previousslot = []
  for (const slot in slots) {
    console.log(audigiven, "e")
    const a = ({ $and: [{ date: date }, { [`data.${audigiven}.available${slots[slot]}`]: false }] });
    const result1 = await collection.findOne(a);

    if (result1 != null) {

      const x = `who_booked${slots[slot]}`;
      console.log(result1.data[audigiven][x], "cx")
      previousbookings.push(result1.data[audigiven][x]);
      previousslot.push(slots[slot])
    }
  }

  for (const p in previousbookings) {
    const x = previousbookings[p].connect.split("+");
    for (const i in x) {
      if (previousslot.includes(x[i])) {
        continue;
      } else {
        previousslot.push(x[i]);
      }
    }
  }
  // console.log(previousbookings)
  // console.log(previousslot)
  for (const slot in previousslot) {
    // const a=({$and:[{date:date},{[`data.${audigiven}.available${previousslot[slot]}}`]:false}]});

    const a = ({ $and: [{ date: date }, { [`data.${audigiven}.available${previousslot[slot]}`]: false }] });
    const b = { $set: { [`data.${audigiven}.available${previousslot[slot]}`]: true } }
    const c = { $set: { [`data.${audigiven}.who_booked${previousslot[slot]}`]: null } }
    const result1 = await collection.updateOne(a, c);
    const result = await collection.updateOne(a, b);


  }


  if (slots.length === 6) {
    newSearch.option = "Full";

  } else {
    if (slots.includes("M1") || slots.includes("M2") || slots.includes("M3")) {
      newSearch.option = "Morning";
    } else {
      newSearch.option = "Afternoon";
    }
  }

  newSearch.connect = slots.join("+");
  newSearch.time = slots.length.toString();
  for (const slot in slots) {
    const a = ({ $and: [{ date: date }, { [`data.${audigiven}.available${slots[slot]}`]: true }] });
    const b = ({ $set: { [`data.${audigiven}.available${slots[slot]}`]: false } })
    const c = ({ $set: { [`data.${audigiven}.who_booked${slots[slot]}`]: newSearch } })
    const result1 = await collection.updateOne(a, c);

    const result = await collection.updateOne(a, b);

  }
  function getUniqueObjects(array, property) {
    return array.filter((obj, index, self) =>
      index === self.findIndex((o) => o[property] === obj[property])
    );
  }
  let previousbookings1 = getUniqueObjects(previousbookings,"eventname");
console.log(previousbookings1, previousbookings1.length, "loiuytr");
  
  for (const booked of previousbookings1) {
    let roomFound1 = [];

    const bookedDate = new Date(booked.date);

for (let i = 0; i < 3; i++) {
  console.log(i, "index");

  const currentDateFormatted = new Date(bookedDate);
  currentDateFormatted.setDate(bookedDate.getDate() + i);

  const nextDate2 = currentDateFormatted.toISOString().split('T')[0];
  console.log(nextDate2, "dfg");

      booked.date =nextDate2
      console.log("hellop")
      ///now start
      console.log(booked, "nuy")
      const desiredCapacity = booked.Capacity;
      //console.log(newSearch)
      const date = nextDate2;
      const time = booked.time;
      console.log(time)

      //console.log(date,"date")
      const roomNames = Audi


      for (const roomName of roomNames) {

        if (time === "1") {
          for (let i = 1; i <= 3; i++) {
            console.log(date, roomName.Name1, desiredCapacity, i);
            const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM${i}`]: true }] });
            const result1 = await collection.findOne(a);
            console.log(result1)
            if (result1 != null) {
            
              
             
              
              roomFound1.push([nextDate2,roomName.Name1,`SLOT ${i} Morning`]);
              console.log("rescheduling done")

              
            }

          }
          
            for (let i = 1; i <= 3; i++) {
              
              const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA${i}`]: true }] });
              const result1 = await collection.findOne(a);
              console.log(result1, "loiu")
              if (result1 != null) {
               
                roomFound1.push([nextDate2,roomName.Name1,`SLOT ${i} Afternoon`]);
                console.log("rescheduling done")
                
              }

            }

          
          
        }
        else if (time === "2") {
          console.log("hello")
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM1`]: true }] });
          const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
          const result1 = await collection.findOne(a);
          const result2 = await collection.findOne(b);
          if (result1 != null && result2 != null) {
           
             roomFound1.push([date,roomName.Name1,"Slot M1+M2 "]);
             console.log(roomFound1)
            
          }
          {
            const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
            const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM3`]: true }] });
            const result1 = await collection.findOne(a);
            const result2 = await collection.findOne(b);
            if (result1 != null && result2 != null) {
             

              roomFound1.push([date,roomName.Name1,"SLOT M2+M3"]);
              console.log(roomFound1)
              
            }

          }
          {
            const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA1`]: true }] });
            const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
            const result1 = await collection.findOne(a);
            const result2 = await collection.findOne(b);
            if (result1 != null && result2 != null) {
             

              roomFound1.push([date,roomName.Name1,"SLOT A1+A2"]);
              console.log(roomFound1)
            
            }
          }
          {
            const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
            const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA3`]: true }] });
            const result1 = await collection.findOne(a);
            const result2 = await collection.findOne(b);
            if (result1 != null && result2 != null) {
              

              roomFound1.push([date,roomName.Name1,"SLOT A2+A3"]);
              console.log(roomFound1)
          
            }
          }
        } else if (time === "3") {

          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM1`]: true }] });
          const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
          const c = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM3`]: true }] });
          const result1 = await collection.findOne(a);
          const result2 = await collection.findOne(b);
          const result3 = await collection.findOne(c);
          if (result1 != null && result2 != null && result3 != null) {
            

            roomFound1.push([nextDate2,roomName.Name1,"Morning"]);

            

          }

           {
            const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA1`]: true }] });
            const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
            const c = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA3`]: true }] });
            const result1 = await collection.findOne(a);
            const result2 = await collection.findOne(b);
            const result3 = await collection.findOne(c);
            if (result1 != null && result2 != null && result3 != null) {
             

              roomFound1.push([nextDate2,roomFound1.Name1,"Afternoon"]);
              
            }


          }


        } else if (time === "6") {
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM1`]: true }] });
          const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
          const c = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM3`]: true }] });
          const result1 = await collection.findOne(a);
          const result2 = await collection.findOne(b);
          const result3 = await collection.findOne(c);
          const d = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA1`]: true }] });
          const e = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
          const f = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA3`]: true }] });
          const result4 = await collection.findOne(d);
          const result5 = await collection.findOne(e);
          const result6 = await collection.findOne(f);
          if (result1 != null && result2 != null && result3 != null && result4 != null && result5 != null && result6 != null) {
           
            roomFound1.push([nextDate2,roomName.Name1,"Full Day"])
          
          }
        }

      }
    }
      // if room is not available

      ///now end


      if (roomFound1.length>0) {



        const mailOptions = {
          from: 'vnrvjietaudis@gmail.com',
          to: booked.email,
          subject: "Sorry for Interruption ",
          html: `
          <p>Dear ${booked.coordinatorname},</p>
          <p>Due to an emergency event, your previous booking was cancelled, and you can reschedule.</p>
          <p>Available audis:</p>
          <ul>
            ${roomFound1.map(roomInfo => `
              <li>${roomInfo.join(', ')}</li>
            `).join('')}
          </ul>
          <p>Thank you for your understanding.</p>
          <p>Best regards,</p>
          <p>Your Name</p>
        `,

        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error, "dsafsfdas");

          } else {
            console.log('Email sent: ' + info.response);

          }
        });

      
      }else{
        const mailOptions = {
          from: 'vnrvjietaudis@gmail.com',
          to: booked.email,
          subject: "Sorry for Interruption ",
          text: `Due to Emergency Event your event was cancelled and No available Auditoriums for next 3 days.Please reschedule to other day`,

        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error, "dsafsfdas");

          } else {
            console.log('Email sent: ' + info.response);

          }
        });

      
      
    }

  }
  response.status(201).send({ pay: 1, message: `${audigiven} Auditorium is booked on ${date} is now marked as unavailable for given slots.` });












}))
userApp.post("/book-audi", multerObj.single('photo'), expressAsyncHandler(async (request, response) => {
  const userCollectionObj = request.app.get("userCollection")
  
  const newSearch = JSON.parse(request.body.search);
  let userOfDB = await userCollectionObj.findOne({ coordinatorname: newSearch.coordinatorname })
  console.log(userOfDB,"stick")

  newSearch.image = request.file.path;
  const collection = request.app.get("audiavailability")
  //console.log(collection,"hello");
  const AudiObj = request.app.get("AddAudi")

  let Audi = await AudiObj.find({}, { sort: { Capacity: 1 } }).toArray();



  // calculate the dates
  const currentDate = new Date();
  //console.log(currentDate)
  // Format the start date and end date strings
  const currentDateFormatted = currentDate.toISOString().split('T')[0];
  //console.log(currentDateFormatted)
  const deleteResult = await collection.deleteMany({ date: { $lt: currentDateFormatted } });
  //console.log(deleteResult)
  const numDeleted = deleteResult.deletedCount;
  //console.log(numDeleted)
  const maxDate = await collection.findOne({}, { sort: { date: -1 } });

  //console.log(maxDate)
  // add corresponding date's
  for (let i = 1; i <= numDeleted; i++) {
    const nextDate = new Date(maxDate.date);
    //console.log(nextDate)
    nextDate.setDate(nextDate.getDate() + i);
    const nextDateFormatted = nextDate.toISOString().split('T')[0];

    const newDocuments = {};
    Audi.forEach(roomName => {
      
      newDocuments[roomName.Name1] = { availableM1: true, availableM2: true, availableM3: true, who_bookedM1: null, who_bookedM2: null, who_bookedM3: null, availableA1: true, availableA2: true, availableA3: true, who_bookedA1: null, who_bookedA2: null, who_bookedA3: null, capacity: Number(roomName.Capacity) };
       
    });
    console.log(newDocuments,"derwds")
    
    newDocuments["waiting"]=[];
    await collection.insertOne({ date: nextDateFormatted, data: newDocuments });
  }

if(parseInt(userOfDB.maxcount,10)<=parseInt(userOfDB.count,10))
{
  response.status(201).send({ pay: 5, message:"Maximum limit of bookings exceeded.For further bookings please approach Admin" })
}else{
  

  // now do the booking logic
  // get the collection
  let roomFound = false;
  const desiredCapacity = newSearch.Capacity;
  //console.log(newSearch)
  const date = newSearch.date;
  const time = request.body.sliderValue;
  console.log(time)
  const description = newSearch
  //console.log(date,"date")
  const roomNames = Audi

  for (const roomName of roomNames) {
    //console.log(roomName)
    if (time === "1") {
      for (let i = 1; i <= 3; i++) {
        const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM${i}`]: true }] });
        const result1 = await collection.findOne(a);
        if (result1 != null) {
          newSearch.time = time;
          newSearch.connect = `M${i}`;
          if ((i + 9) >= 12 && (i + 10) >= 12) {
            newSearch.eventtime = `${i + 9}:00 pm to ${i + 10}:00 pm (Slot ${i})`
          }
          else if ((i + 10) == 12) {
            newSearch.eventtime = `${i + 9}:00 am to ${i + 10}:00 pm (Slot ${i})`
          } else {
            newSearch.eventtime = `${i + 9}:00 am to ${i + 10}:00 am (Slot ${i})`
          }
          newSearch.option = "Morning"
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM${i}`]: true }] });
          const b = ({ $set: { [`data.${roomName.Name1}.availableM${i}`]: false } })
          const c = ({ $set: { [`data.${roomName.Name1}.who_bookedM${i}`]: newSearch } })
          const result1 = await collection.updateOne(a, c);
          console.log(result1);
          const result = await collection.updateOne(a, b);
          roomFound = true;
          const count=parseInt(userOfDB.count,10)+1;
          const m=({coordinatorname:newSearch.coordinatorname})
          const n = ({ $set: { count: count } })
          const result2 = await userCollectionObj.updateOne(m, n);
          response.status(201).send({ pay: 1, message: `${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} for slot ${i} is now marked as unavailable in Morning.` });
          break;
        }

      }
      if (roomFound === false) {
        for (let i = 1; i <= 3; i++) {
          newSearch.time = time;
          newSearch.connect = `A${i}`;
          newSearch.eventtime = `${i + 12}:40 pm to ${i + 13}:40 pm (Slot ${i})`
          newSearch.option = "Afternoon"
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA${i}`]: true }] });
          const result1 = await collection.findOne(a);
          if (result1 != null) {
            const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA${i}`]: true }] });
            const b = ({ $set: { [`data.${roomName.Name1}.availableA${i}`]: false } })
            const c = ({ $set: { [`data.${roomName.Name1}.who_bookedA${i}`]: newSearch } })
            const result1 = await collection.updateOne(a, c);
            console.log(result1);
            const result = await collection.updateOne(a, b);
            roomFound = true;
            const count=parseInt(userOfDB.count,10)+1;
          const m=({coordinatorname:newSearch.coordinatorname})
          const n = ({ $set: { count: count } })
          const result2 = await userCollectionObj.updateOne(m, n);
            response.status(201).send({ pay: 1, message: `${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} for slot ${i} is now marked as unavailable in Afternoon.` });
            break;
          }

        }

      }
      if (roomFound === true) {
        break;
      }
    }
    else if (time === "2") {

      const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM1`]: true }] });
      const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
      const result1 = await collection.findOne(a);
      const result2 = await collection.findOne(b);
      if (result1 != null && result2 != null) {
        newSearch.time = time;
        newSearch.connect = "M1+M2";
        newSearch.eventtime = "10:00 am - 12:00 pm (Slots 1,2)"
        newSearch.option = "Morning"
        const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM1`]: true }] });
        const b = ({ $set: { [`data.${roomName.Name1}.availableM1`]: false } })
        const c = ({ $set: { [`data.${roomName.Name1}.who_bookedM1`]: newSearch } })
        const result1 = await collection.updateOne(a, c);
        console.log(result1);
        const result = await collection.updateOne(a, b);

        const d = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
        const e = ({ $set: { [`data.${roomName.Name1}.availableM2`]: false } })
        const f = ({ $set: { [`data.${roomName.Name1}.who_bookedM2`]: newSearch } })
        const result2 = await collection.updateOne(d, f);
        console.log(result2);
        const result3 = await collection.updateOne(d, e);

        roomFound = true;
        const count=parseInt(userOfDB.count,10)+1;
          const m=({coordinatorname:newSearch.coordinatorname})
          const n = ({ $set: { count: count } })
          const result4= await userCollectionObj.updateOne(m, n);
        response.status(201).send({ pay: 1, message: `${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} for slot 1,2 is now marked as unavailable in Morning.` });
        break;
      }
      if (roomFound === false) {
        const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
        const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM3`]: true }] });
        const result1 = await collection.findOne(a);
        const result2 = await collection.findOne(b);
        if (result1 != null && result2 != null) {
          newSearch.time = time;
          newSearch.connect = "M2+M3";
          newSearch.eventtime = "11:00 am - 13:00 pm (Slots 2,3)"
          newSearch.option = "Morning"
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
          const b = ({ $set: { [`data.${roomName.Name1}.availableM2`]: false } })
          const c = ({ $set: { [`data.${roomName.Name1}.who_bookedM2`]: newSearch } })
          const result1 = await collection.updateOne(a, c);
          console.log(result1);
          const result = await collection.updateOne(a, b);

          const d = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM3`]: true }] });
          const e = ({ $set: { [`data.${roomName.Name1}.availableM3`]: false } })
          const f = ({ $set: { [`data.${roomName.Name1}.who_bookedM3`]: newSearch } })
          const result2 = await collection.updateOne(d, f);
          console.log(result2);
          const result3 = await collection.updateOne(d, e);

          roomFound = true;
          const count=parseInt(userOfDB.count,10)+1;
          const m=({coordinatorname:newSearch.coordinatorname})
          const n = ({ $set: { count: count } })
          const result5 = await userCollectionObj.updateOne(m, n);
          response.status(201).send({ pay: 1, message: `${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} for slot 2,3 is now marked as unavailable in Morning.` });
          break;
        }

      }
      if (roomFound === false) {
        const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA1`]: true }] });
        const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
        const result1 = await collection.findOne(a);
        const result2 = await collection.findOne(b);
        if (result1 != null && result2 != null) {
          newSearch.time = time;
          newSearch.connect = "A1+A2";
          newSearch.eventtime = "13:40 pm to 15:40 pm (Slots 1,2)"
          newSearch.option = "Afternoon"
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA1`]: true }] });
          const b = ({ $set: { [`data.${roomName.Name1}.availableA1`]: false } })
          const c = ({ $set: { [`data.${roomName.Name1}.who_bookedA1`]: newSearch } })
          const result1 = await collection.updateOne(a, c);
          console.log(result1);
          const result = await collection.updateOne(a, b);

          const d = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
          const e = ({ $set: { [`data.${roomName.Name1}.availableA2`]: false } })
          const f = ({ $set: { [`data.${roomName.Name1}.who_bookedA2`]: newSearch } })
          const result2 = await collection.updateOne(d, f);
          console.log(result2);
          const result3 = await collection.updateOne(d, e);

          roomFound = true;
          const count=parseInt(userOfDB.count,10)+1;
          const m=({coordinatorname:newSearch.coordinatorname})
          const n = ({ $set: { count: count } })
          const result5 = await userCollectionObj.updateOne(m, n);
          response.status(201).send({ pay: 1, message: `${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} for slot 1,2 is now marked as unavailable in Afternoon.` });
          break;
        }
      }
      if (roomFound === false) {
        const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
        const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA3`]: true }] });
        const result1 = await collection.findOne(a);
        const result2 = await collection.findOne(b);
        if (result1 != null && result2 != null) {
          newSearch.time = time;
          newSearch.eventtime = "14:40 pm to 16:40 pm (Slots 2,3)"
          newSearch.connect = "A2+A3";
          newSearch.option = "Afternoon"
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
          const b = ({ $set: { [`data.${roomName.Name1}.availableA2`]: false } })
          const c = ({ $set: { [`data.${roomName.Name1}.who_bookedA2`]: newSearch } })
          const result1 = await collection.updateOne(a, c);
          console.log(result1);
          const result = await collection.updateOne(a, b);

          const d = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA3`]: true }] });
          const e = ({ $set: { [`data.${roomName.Name1}.availableA3`]: false } })
          const f = ({ $set: { [`data.${roomName.Name1}.who_bookedA3`]: newSearch } })
          const result2 = await collection.updateOne(d, f);
          console.log(result2);
          const result3 = await collection.updateOne(d, e);

          roomFound = true;
          const count=parseInt(userOfDB.count,10)+1;
          const m=({coordinatorname:newSearch.coordinatorname})
          const n = ({ $set: { count: count } })
          const result5 = await userCollectionObj.updateOne(m, n);
          response.status(201).send({ pay: 1, message: `${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} for slot 2,3 is now marked as unavailable in Afternoon.` });
          break;
        }
      }
    } else if (time === "3") {

      const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM1`]: true }] });
      const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
      const c = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM3`]: true }] });
      const result1 = await collection.findOne(a);
      const result2 = await collection.findOne(b);
      const result3 = await collection.findOne(c);
      if (result1 != null && result2 != null && result3 != null) {
        newSearch.time = time;
        newSearch.eventtime = "10:00 am to 13:00 pm (Slots 1-3)"
        newSearch.connect = "M1+M2+M3";
        newSearch.option = "Morning"
        const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM1`]: true }] });
        const b = ({ $set: { [`data.${roomName.Name1}.availableM1`]: false } })
        const c = ({ $set: { [`data.${roomName.Name1}.who_bookedM1`]: newSearch } })
        const result1 = await collection.updateOne(a, c);
        console.log(result1);
        const result = await collection.updateOne(a, b);

        const d = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
        const e = ({ $set: { [`data.${roomName.Name1}.availableM2`]: false } })
        const f = ({ $set: { [`data.${roomName.Name1}.who_bookedM2`]: newSearch } })
        const result2 = await collection.updateOne(d, f);
        console.log(result2);
        const result3 = await collection.updateOne(d, e);

        const g = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM3`]: true }] });
        const h = ({ $set: { [`data.${roomName.Name1}.availableM3`]: false } })
        const i = ({ $set: { [`data.${roomName.Name1}.who_bookedM3`]: newSearch } })
        const result4 = await collection.updateOne(g, i);
        console.log(result4);
        const result5 = await collection.updateOne(g, h);

        roomFound = true;
        const count=parseInt(userOfDB.count,10)+1;
          const m=({coordinatorname:newSearch.coordinatorname})
          const n = ({ $set: { count: count } })
          const result6 = await userCollectionObj.updateOne(m, n);
        response.status(201).send({ pay: 1, message: `${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} is now marked as unavailable in Morning.` });
        break;

      }

      if (roomFound === false) {
        const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA1`]: true }] });
        const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
        const c = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA3`]: true }] });
        const result1 = await collection.findOne(a);
        const result2 = await collection.findOne(b);
        const result3 = await collection.findOne(c);
        if (result1 != null && result2 != null && result3 != null) {
          newSearch.time = time;
          newSearch.connect = "A1+A2+A3";
          newSearch.eventtime = "13:40 pm to 16:40 pm (Slots 1-3)";
          newSearch.option = "Afternoon"
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA1`]: true }] });
          const b = ({ $set: { [`data.${roomName.Name1}.availableA1`]: false } })
          const c = ({ $set: { [`data.${roomName.Name1}.who_bookedA1`]: newSearch } })
          const result1 = await collection.updateOne(a, c);
          console.log(result1);
          const result = await collection.updateOne(a, b);

          const d = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
          const e = ({ $set: { [`data.${roomName.Name1}.availableA2`]: false } })
          const f = ({ $set: { [`data.${roomName.Name1}.who_bookedA2`]: newSearch } })
          const result2 = await collection.updateOne(d, f);
          console.log(result2);
          const result3 = await collection.updateOne(d, e);

          const g = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA3`]: true }] });
          const h = ({ $set: { [`data.${roomName.Name1}.availableA3`]: false } })
          const i = ({ $set: { [`data.${roomName.Name1}.who_bookedA3`]: newSearch } })
          const result4 = await collection.updateOne(g, i);
          console.log(result4);
          const result5 = await collection.updateOne(g, h);

          roomFound = true;
          const count=parseInt(userOfDB.count,10)+1;
          const m=({coordinatorname:newSearch.coordinatorname})
          const n = ({ $set: { count: count } })
          const result6 = await userCollectionObj.updateOne(m, n);
          response.status(201).send({ pay: 1, message: `${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} is now marked as unavailable in Afternoon.` });
          break;
        }


      }


    }

    else if (time === "6") {
      const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM1`]: true }] });
      const b = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM2`]: true }] });
      const c = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM3`]: true }] });
      const result1 = await collection.findOne(a);
      const result2 = await collection.findOne(b);
      const result3 = await collection.findOne(c);
      const d = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA1`]: true }] });
      const e = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA2`]: true }] });
      const f = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA3`]: true }] });
      const result4 = await collection.findOne(d);
      const result5 = await collection.findOne(e);
      const result6 = await collection.findOne(f);
      if (result1 != null && result2 != null && result3 != null && result4 != null && result5 != null && result6 != null) {
        newSearch.time = time;
        newSearch.connect = "M1+M2+M3+A1+A2+A3";
        newSearch.eventtime = "10:00 am to 16:40 pm (Slots 1-6)";
        newSearch.option = "Full"
        for (let i = 1; i <= 3; i++) {
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM${i}`]: true }] });
          const b = ({ $set: { [`data.${roomName.Name1}.availableM${i}`]: false } })
          const c = ({ $set: { [`data.${roomName.Name1}.who_bookedM${i}`]: newSearch } })
          const result1 = await collection.updateOne(a, c);
          console.log(result1);
          const result = await collection.updateOne(a, b);
        }
        for (let i = 1; i <= 3; i++) {
          const a = ({ $and: [{ date: date }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA${i}`]: true }] });
          const b = ({ $set: { [`data.${roomName.Name1}.availableA${i}`]: false } })
          const c = ({ $set: { [`data.${roomName.Name1}.who_bookedA${i}`]: newSearch } })
          const result1 = await collection.updateOne(a, c);
          console.log(result1);
          const result = await collection.updateOne(a, b);

        }
        roomFound = true;
        const count=parseInt(userOfDB.count,10)+1;
          const m=({coordinatorname:newSearch.coordinatorname})
          const n = ({ $set: { count: count } })
          const result2 = await userCollectionObj.updateOne(m, n);
        response.status(201).send({ pay: 1, message: `${roomName.Name1} Auditorium with capacity ${desiredCapacity} on ${date} is now marked as unavailable for full day.` });
        break;
      }
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
        for (let i = 1; i <= 3; i++) {
          const c = ({ $and: [{ date: nextDate2 }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableM${i}`]: true }] });
          const result1 = await collection.findOne(c);
          if (result1 !== null) {
            availableRoomsNextThreeDays.push(`${roomName.Name1} Auditorium on ${nextDate2} of slot ${i} in morning\n`);

          }
        }
        for (let i = 1; i <= 3; i++) {
          const d = ({ $and: [{ date: nextDate2 }, { [`data.${roomName.Name1}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${roomName.Name1}.availableA${i}`]: true }] });
          const result2 = await collection.findOne(d);
          if (result2 !== null) {
            availableRoomsNextThreeDays.push(`${roomName.Name1} Auditorium on ${nextDate2} of slot ${i} in afternoon\n`);

          }
        }


        //console.log(result1,"res")

      }
    }
    
    if (availableRoomsNextThreeDays.length > 0) {
      response.status(201).send({ pay: 2, message: availableRoomsNextThreeDays })
    } else {
      response.status(201).send({ pay: 3, message: `No available Auditoriums with capacity ${desiredCapacity} for the next three days.` });
    }


    // Print the available rooms for the next three days

  }
  }
}))

userApp.post("/register-user", multerObj.single('photo'), expressAsyncHandler(async (request, response) => {

  //get user collection
  const userCollectionObj = request.app.get("userCollection")

  //get user from client
  const newUser = JSON.parse(request.body.user);

  //verify user is already existed
  const userOfDB = await userCollectionObj.findOne({ username: newUser.username })

  //if user already existed
  if (userOfDB !== null) {
    response.status(200).send({ message: "User already existed" })
  }
  //if user not existed
  else {

    //add CDN link of cloudinary image to user obj
    newUser.image = request.file.path;
    //hash the password of newUser
    let hashedPassword = await bcryptjs.hash(newUser.password, 6)
    //replace palin password with hased password
    newUser.password = hashedPassword;
    //insert user
    await userCollectionObj.insertOne(newUser)
    //send response
    response.status(201).send({ message: "User created" })
  }
}))
userApp.get("/get-admin", expressAsyncHandler(async (request, response) => {


  //get user collection
  const userObj = request.app.get("userCollection")

  //get username from url

  //find user by iusername

  let User = await userObj.find({ typeofuser: "Admin" }).toArray();



  //send res
  response.status(200).send({ payload: User })

}))
userApp.put("/edit-user/:id", expressAsyncHandler(async (request, response) => {
  const userObj1 = request.app.get("userCollection")
  console.log("hello")
  const id = +request.params.id;
  let modifiedUser = request.body;
  let hashedPassword = await bcryptjs.hash(modifiedUser.password, 6)
  //replace palin password with hased password
  modifiedUser.password = hashedPassword;
  let dbRes = await userObj1.updateOne({ image: modifiedUser.image }, { $set: { ...modifiedUser } }).then(dbRes => {
    response.status(201).send({ message: "User updated" })
    console.log("updtaed")
    console.log(dbRes);
  })

}))
userApp.put("/edit-admin/:id", expressAsyncHandler(async (request, response) => {
  const userObj1 = request.app.get("userCollection")
  console.log("hello")
  const id = +request.params.id;
  let modifiedAdmin = request.body;
  let hashedPassword = await bcryptjs.hash(modifiedAdmin.password, 6)
  //replace palin password with hased password
  modifiedAdmin.password = hashedPassword;
  let dbRes = await userObj1.updateOne({ image: modifiedAdmin.image }, { $set: { ...modifiedAdmin } }).then(dbRes => {
    response.status(201).send({ message: "User updated" })
    console.log("updtaed")
    console.log(dbRes);
  })

}))
userApp.get("/get-user", expressAsyncHandler(async (request, response) => {


  //get user collection
  const userObj = request.app.get("userCollection")

  //get username from url

  //find user by iusername

  let User = await userObj.find({ typeofuser: "User" }).toArray();



  //send res
  response.status(200).send({ payload: User })

}))
userApp.delete("/remove/:name", expressAsyncHandler(async (request, response) => {
  const userObj1 = request.app.get("userCollection")
  const name = request.params.name;
  let dbRes = await userObj1.deleteOne({ coordinatorname: name }).then(dbRes => {
    response.status(201).send({ message: "User removed" })
  })

}))
userApp.post("/remove-event", expressAsyncHandler(async (request, response) => {
  
  const userObj1 = request.app.get("userCollection")
  const newSearch = (request.body);
  console.log(newSearch)
  const audiavailability=request.app.get("audiavailability")
  const parts = (newSearch.connect).split('+');
  const audi=newSearch.bookedaudi;
  
  for(const slot of parts)
  {
    const result=await audiavailability.updateOne({date:newSearch.date},{ $set:  { [`data.${audi}.available${slot}`]: true, [`data.${audi}.who_booked${slot}`]: null} } );
    console.log(result,"lp")
  }
  const waiting_list1=await audiavailability.findOne( { date: newSearch.date });
  const waiting_list=waiting_list1.data.waiting;
   
  console.log(waiting_list,"wait");
  for(const efg of waiting_list)
{
  let event=efg;
  const time=event.time;
  const desiredCapacity=event.Capacity;
  let roomFound=false;
  let maildetails={};
  if (time === "1") {
    
    for (let i = 1; i <= 3; i++) {
      const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM${i}`]: true }] });
      const result1 = await audiavailability.findOne(a);
     
      if (result1 != null) {
        console.log(event)
        event.time = time;
        event.connect = `M${i}`;
        if ((i + 9) >= 12 && (i + 10) >= 12) {
          event.eventtime = `${i + 9}:00 pm to ${i + 10}:00 pm (Slot ${i})`
        }
        else if ((i + 10) == 12) {
          event.eventtime = `${i + 9}:00 am to ${i + 10}:00 pm (Slot ${i})`
        } else {
          event.eventtime = `${i + 9}:00 am to ${i + 10}:00 am (Slot ${i})`
        }
        console.log(event)
        event.option = "Morning"
        const a = ({ $and: [{ date: newSearch.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM${i}`]: true }] });
        const b = ({ $set: { [`data.${audi}.availableM${i}`]: false } })
        const c = ({ $set: { [`data.${audi}.who_bookedM${i}`]: event } })
        const result1 = await audiavailability.updateOne(a, c);
      
        const result = await audiavailability.updateOne(a, b);
        const filter = {date:newSearch.date}
  const update = {
   
    $pull: {
      'data.waiting': {eventname:efg.eventname}
    },
  };
  let result9=await audiavailability.updateOne(filter,update);
  console.log(result9,"result9");
        roomFound = true;
       
       break;
      
      }

    }
    if (roomFound === false) {
      for (let i = 1; i <= 3; i++) {
        event.time = time;
        event.connect = `M${i}`;
        event.eventtime = `${i + 12}:40 pm to ${i + 13}:40 pm (Slot ${i})`
        event.option = "Afternoon"
        const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA${i}`]: true }] });
        const result1 = await audiavailability.findOne(a);
        if (result1 != null) {
          const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA${i}`]: true }] });
          const b = ({ $set: { [`data.${audi}.availableA${i}`]: false } })
          const c = ({ $set: { [`data.${audi}.who_bookedA${i}`]: event } })
          const result1 = await audiavailability.updateOne(a, c);
          console.log(result1);
          const result = await audiavailability.updateOne(a, b);
           const filter = {date:newSearch.date}
        const update = {
   
          $pull: {
            'data.waiting': {eventname:efg.eventname}
             },
            };
        let result9=await audiavailability.updateOne(filter,update);
          console.log(result9,"result9");
         roomFound = true;
         break;
        }

      }

    }
    
  }
  else if (time === "2") {
    console.log("hiii");
    const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM1`]: true }] });
    const b = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM2`]: true }] });
    const result1 = await audiavailability.findOne(a);
    const result2 = await audiavailability.findOne(b);
    if (result1 != null && result2 != null) {
      event.time = time;
      event.connect = "M1+M2";
      event.eventtime = "10:00 am - 12:00 pm (Slots 1,2)"
      event.option = "Morning"
      const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM1`]: true }] });
      const b = ({ $set: { [`data.${audi}.availableM1`]: false } })
      const c = ({ $set: { [`data.${audi}.who_bookedM1`]: event } })
      const result1 = await audiavailability.updateOne(a, c);
      
      const result = await audiavailability.updateOne(a, b);

      const d = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM2`]: true }] });
      const e = ({ $set: { [`data.${audi}.availableM2`]: false } })
      const f = ({ $set: { [`data.${audi}.who_bookedM2`]: event } })
      const result2 = await audiavailability.updateOne(d, f);
    
      const result3 = await audiavailability.updateOne(d, e);

      const filter = {date:newSearch.date}
    const update = {
   
     $pull: {
       'data.waiting': {eventname:efg.eventname}
        },
        };
      let result9=await audiavailability.updateOne(filter,update);
        console.log(newSearch,efg,"result9");
         roomFound = true;
          
    }
    if (roomFound === false) {
      const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM2`]: true }] });
      const b = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM3`]: true }] });
      const result1 = await audiavailability.findOne(a);
      const result2 = await audiavailability.findOne(b);
      if (result1 != null && result2 != null) {
        event.time = time;
        event.connect = "M2+M3";
        event.eventtime = "11:00 am - 13:00 pm (Slots 2,3)"
        event.option = "Morning"
        const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM2`]: true }] });
        const b = ({ $set: { [`data.${audi}.availableM2`]: false } })
        const c = ({ $set: { [`data.${audi}.who_bookedM2`]: event } })
        const result1 = await audiavailability.updateOne(a, c);
        console.log(result1);
        const result = await audiavailability.updateOne(a, b);

        const d = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM3`]: true }] });
        const e = ({ $set: { [`data.${audi}.availableM3`]: false } })
        const f = ({ $set: { [`data.${audi}.who_bookedM3`]: event} })
        const result2 = await audiavailability.updateOne(d, f);
        console.log(result2);
        const result3 = await audiavailability.updateOne(d, e);

        const filter = {date:newSearch.date}
  const update = {
   
    $pull: {
      'data.waiting': {eventname:efg.eventname}
    },
  };
  let result9=await audiavailability.updateOne(filter,update);
  console.log(result9,"result9");
        roomFound = true;
      
      
      }

    }
    if (roomFound === false) {
      const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA1`]: true }] });
      const b = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA2`]: true }] });
      const result1 = await audiavailability.findOne(a);
      const result2 = await audiavailability.findOne(b);
      if (result1 != null && result2 != null) {
        event.time = time;
        event.connect = "A1+A2";
        event.eventtime = "13:40 pm to 15:40 pm (Slots 1,2)"
        event.option = "Afternoon"
        const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA1`]: true }] });
        const b = ({ $set: { [`data.${audi}.availableA1`]: false } })
        const c = ({ $set: { [`data.${audi}.who_bookedA1`]: event} })
        const result1 = await audiavailability.updateOne(a, c);
        console.log(result1);
        const result = await audiavailability.updateOne(a, b);

        const d = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA2`]: true }] });
        const e = ({ $set: { [`data.${audi}.availableA2`]: false } })
        const f = ({ $set: { [`data.${audi}.who_bookedA2`]: event } })
        const result2 = await audiavailability.updateOne(d, f);
        console.log(result2);
        const result3 = await audiavailability.updateOne(d, e);

        const filter = {date:newSearch.date}
     const update = {
   
      $pull: {
        'data.waiting': {eventname:efg.eventname}
      },
     };
     let result9=await audiavailability.updateOne(filter,update);
      console.log(result9,"result9");
          roomFound = true;
          
      
      }
    }
    if (roomFound === false) {
      const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA2`]: true }] });
      const b = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA3`]: true }] });
      const result1 = await audiavailability.findOne(a);
      const result2 = await audiavailability.findOne(b);
      if (result1 != null && result2 != null) {
        event.time = time;
        event.eventtime = "14:40 pm to 16:40 pm (Slots 2,3)"
        event.connect = "A2+A3";
        event.option = "Afternoon"
        const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA2`]: true }] });
        const b = ({ $set: { [`data.${audi}.availableA2`]: false } })
        const c = ({ $set: { [`data.${audi}.who_bookedA2`]: event } })
        const result1 = await audiavailability.updateOne(a, c);
        console.log(result1);
        const result = await audiavailability.updateOne(a, b);

        const d = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA3`]: true }] });
        const e = ({ $set: { [`data.${audi}.availableA3`]: false } })
        const f = ({ $set: { [`data.${audi}.who_bookedA3`]: event } })
        const result2 = await audiavailability.updateOne(d, f);
        console.log(result2);
        const result3 = await audiavailability.updateOne(d, e);

        const filter = {date:newSearch.date}
  const update = {
   
    $pull: {
      'data.waiting': {eventname:efg.eventname}
    },
  };
  let result9=await audiavailability.updateOne(filter,update);
  console.log(result9,"result9");
        roomFound = true;
       
      
      }
    }
  }else if (time === "3") {

    const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM1`]: true }] });
    const b = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM2`]: true }] });
    const c = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM3`]: true }] });
    const result1 = await audiavailability.findOne(a);
    const result2 = await audiavailability.findOne(b);
    const result3 = await audiavailability.findOne(c);
    if (result1 != null && result2 != null && result3 != null) {
      event.time = time;
      event.eventtime = "10:00 am to 13:00 pm (Slots 1-3)"
      event.connect = "M1+M2+M3";
      event.option = "Morning"
      const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM1`]: true }] });
      const b = ({ $set: { [`data.${audi}.availableM1`]: false } })
      const c = ({ $set: { [`data.${audi}.who_bookedM1`]: event } })
      const result1 = await audiavailability.updateOne(a, c);
      const result = await audiavailability.updateOne(a, b);

      const d = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM2`]: true }] });
      const e = ({ $set: { [`data.${audi}.availableM2`]: false } })
      const f = ({ $set: { [`data.${audi}.who_bookedM2`]: event } })
      const result2 = await audiavailability.updateOne(d, f);
      const result3 = await audiavailability.updateOne(d, e);

      const g = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM3`]: true }] });
      const h = ({ $set: { [`data.${audi}.availableM3`]: false } })
      const i = ({ $set: { [`data.${audi}.who_bookedM3`]: event } })
      const result4 = await audiavailability.updateOne(g, i);
      const result5 = await audiavailability.updateOne(g, h);
      const filter = {date:newSearch.date}
      const update = {
     
       $pull: {
         'data.waiting': {eventname:efg.eventname}
          },
          };
        let result9=await audiavailability.updateOne(filter,update);
        
           roomFound = true;
     

    }

    if (roomFound === false) {
      const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA1`]: true }] });
      const b = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA2`]: true }] });
      const c = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA3`]: true }] });
      const result1 = await audiavailability.findOne(a);
      const result2 = await audiavailability.findOne(b);
      const result3 = await audiavailability.findOne(c);
      if (result1 != null && result2 != null && result3 != null) {
        event.time = time;
        event.connect = "A1+A2+A3";
        event.eventtime = "13:40 pm to 16:40 pm (Slots 1-3)";
        event.option = "Afternoon"
        const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA1`]: true }] });
        const b = ({ $set: { [`data.${audi}.availableA1`]: false } })
        const c = ({ $set: { [`data.${audi}.who_bookedA1`]: event } })
        const result1 = await audiavailability.updateOne(a, c);
      
        const result = await audiavailability.updateOne(a, b);

        const d = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA2`]: true }] });
        const e = ({ $set: { [`data.${audi}.availableA2`]: false } })
        const f = ({ $set: { [`data.${audi}.who_bookedA2`]: event } })
        const result2 = await audiavailability.updateOne(d, f);
      
        const result3 = await audiavailability.updateOne(d, e);

        const g = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA3`]: true }] });
        const h = ({ $set: { [`data.${audi}.availableA3`]: false } })
        const i = ({ $set: { [`data.${audi}.who_bookedA3`]: event } })
        const result4 = await audiavailability.updateOne(g, i);
        
        const result5 = await audiavailability.updateOne(g, h);

        const filter = {date:newSearch.date}
        const update = {
       
         $pull: {
           'data.waiting': {eventname:efg.eventname}
            },
            };
          let result9=await audiavailability.updateOne(filter,update);
 
             roomFound = true;
      }


    }


  }
  else if (time === "6") {
    const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM1`]: true }] });
    const b = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM2`]: true }] });
    const c = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM3`]: true }] });
    const result1 = await audiavailability.findOne(a);
    const result2 = await audiavailability.findOne(b);
    const result3 = await audiavailability.findOne(c);
    const d = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA1`]: true }] });
    const e = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA2`]: true }] });
    const f = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA3`]: true }] });
    const result4 = await audiavailability.findOne(d);
    const result5 = await audiavailability.findOne(e);
    const result6 = await audiavailability.findOne(f);
    if (result1 != null && result2 != null && result3 != null && result4 != null && result5 != null && result6 != null) {
      event.time = time;
      event.connect = "M1+M2+M3+A1+A2+A3";
      event.eventtime = "10:00 am to 16:40 pm (Slots 1-6)";
      event.option = "Full"
      for (let i = 1; i <= 3; i++) {
        const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableM${i}`]: true }] });
        const b = ({ $set: { [`data.${audi}.availableM${i}`]: false } })
        const c = ({ $set: { [`data.${audi}.who_bookedM${i}`]: event } })
        const result1 = await audiavailability.updateOne(a, c);
        console.log(result1);
        const result = await audiavailability.updateOne(a, b);
      }
      for (let i = 1; i <= 3; i++) {
        const a = ({ $and: [{ date: event.date }, { [`data.${audi}.capacity`]: { $gte: Number(desiredCapacity) } }, { [`data.${audi}.availableA${i}`]: true }] });
        const b = ({ $set: { [`data.${audi}.availableA${i}`]: false } })
        const c = ({ $set: { [`data.${audi}.who_bookedA${i}`]: event } })
        const result1 = await audiavailability.updateOne(a, c);
        console.log(result1);
        const result = await audiavailability.updateOne(a, b);

      }
      const filter = {date:newSearch.date}
      const update = {
     
       $pull: {
         'data.waiting': {eventname:efg.eventname}
          },
          };
        let result9=await audiavailability.updateOne(filter,update);
        
           roomFound = true;
    }
  }
  
  if(roomFound)
  {
    console.log(efg,"efg");
    console.log(event,"event");
  const mailOptions = {
    from: 'vnrvjietaudis@gmail.com',
    to: efg.email,
    subject: "Hurrah! You're waiting time is over",
    html: `
    <p>Dear ${efg.coordinatorname},</p>
    <p>Your event was booked on ${efg.date} in ${audi} (${event.eventtime}) from waiting list</p>
    
  `,
  
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error, "dsafsfdas");
  
    } else {
      console.log('Email sent: ' + info.response);
  
    }
  });
}
}

response.status(201).send({ message: "Event removed" })
}))
userApp.post("/waiting-list", multerObj.single('photo'),expressAsyncHandler(async (request, response) => {
console.log("kkkkkk")
  const newSearch = JSON.parse(request.body.search);
  newSearch.image = request.file.path;
  newSearch.time=request.body.sliderValue;

  const collection = request.app.get("audiavailability")
  console.log(newSearch)
  const date=newSearch.date;
  console.log(date);
  
  const filter = {date:date}
  const update = {
   
    $push: {
      'data.waiting': newSearch
    },
  };

  let result1=await collection.updateOne(filter, update)
 

  let result2 =await collection.findOne({date:date}).then(result2=>{
    console.log(result2,"mnbnm")
    let l=result2.data;
    let r=l.waiting;
    
    response.status(201).send({message:`${r.length}`});
 
  })
  
}))
module.exports = userApp;