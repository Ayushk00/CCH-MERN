const express = require("express");
const router = express.Router();
const studentModel = require("../models/studentinfo");
const SignupModel = require("../models/signup");
const cors=require("cors");
router.use(express.json()); 
router.use(cors()); 

router.post('/register', (req, res) => {
    const { email, name, password, role } = req.body;

    SignupModel.findOne({ email: email })
        .then(user => {
            if (user) {
                console.log("User already exists");
                return res.json("User already exists");
            } else {
                SignupModel.create({
                    name: name,
                    email: email,
                    password: password,
                    type: role
                })
                    .then(() => res.json("User added"))
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json("Internal server error");
        });
});

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    SignupModel.findOne({ email: email })
        .then(user => {
            if (user) {
                console.log(role);
                if (user.password === password && user.type === role) {
                    res.json(user.name);
                } else {
                    res.json("Password is incorrect");
                }
            } else {
                res.json("User not found");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json("Internal server error");
        });
});

router.post('/studentinfo', async (req, res) => {
    try {
        const { email, firstname, lastname, phonenumber, password, quali, Stream, city, state, hsc, ssc, ug, Address, skills } = req.body;

        const existingStudent = await studentModel.findOne({ email });

        if (existingStudent) {
            if (firstname != "") existingStudent.firstname = firstname;
            if (lastname != "") existingStudent.lastname = lastname;
            if (phonenumber != "") existingStudent.phonenumber = phonenumber;
            if (password != "") existingStudent.password = password;
            if (quali != "") existingStudent.quali = quali;
            if (Stream != "") existingStudent.Stream = Stream;
            if (city != "") existingStudent.city = city;
            if (state != "") existingStudent.state = state;
            if (hsc != "") existingStudent.hsc = hsc;
            if (ssc != "") existingStudent.ssc = ssc;
            if (ug != "") existingStudent.ug = ug;
            if (Address != "") existingStudent.Address = Address;
            if (skills != "") existingStudent.skills = existingStudent.skills + skills;

            await existingStudent.save();
            return res.json("User information updated successfully");
        } else {
            await studentModel.create({
                firstname: firstname,
                lastname: lastname,
                email: email,
                phonenumber: phonenumber,
                password: password,
                quali: quali,
                Stream: Stream,
                city: city,
                state: state,
                hsc: hsc,
                ssc: ssc,
                ug: ug,
                Address: Address,
                skills: skills
            });
            res.json("User added successfully");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Error: " + err.message);
    }
});

router.get('/getinfo',async(req,res)=>{
  try
  {
    const students=await studentModel.find();
    res.json(students);
  }
  catch(err){
    res.status(400).json("Error : ",err);
  }
})

// router.get('/userinfo',async(req,res)=>{
//     try{
//         const userInfo=await SignupModel.find();
//         res.json(userInfo);
//     }
//     catch(err){
//         res.status(400).json("Error : ",err);
//     }
// })

router.delete('/delete/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        await studentModel.findByIdAndDelete(studentId);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error: ' + err });
    }
});

module.exports = router;