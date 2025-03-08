const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const companyroute = require("./routes/companyroutes");
const studentroute = require("./routes/student");
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/pcell').then((e)=>console.log("Mongodb connected"));

const app = express();

app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
 
const PORT= process.env.PORT || 8000;

// app.get("/f", (req, res) => {
//     console.log("hello");
// })
app.use('/student', studentroute);
app.use('/company', companyroute);

app.listen(PORT,()=>console.log(`Server started at PORT:${PORT}`));
