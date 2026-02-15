const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const z = require("zod");
const cors = require("cors");

const app = express();
const JWT_SECRET = "terimaakichut";
const JWT_SECRET2 = "nai batao gya";
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const { UserModel, ComplaintModel } = require("./db");
const { da } = require("zod/v4/locales");
mongoose
  .connect("mongodb://localhost:27017/project-db")
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((err) => {
    console.log("connection error", err);
  });

// ================= SIGNUP =================
app.post("/signup", async function (req, res) {
  try {
    const { username, password } = req.body;
    const requiredBody = z.object({
      username: z.string().min(3).max(100),
      password: z.string().min(3).max(12),
    });
    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
      return res.send({
        message: "invalid format",
        error: parsedData.error,
      });
    }

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.send({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    await UserModel.create({
      username: username,
      password: hashedPassword,
    });
    const token = jwt.sign({ username }, JWT_SECRET);
    return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= SIGNIN =================
app.post("/signin/student", async function (req, res) {
  const { username, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ username });
    const passMatch = await bcrypt.compare(password, existingUser.password);
    const token = jwt.sign({ username }, JWT_SECRET);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post("/signin/admin",function(req,res){
  const data=req.body;
  if(data.username==="admin" && data.password==="147258369"){
    const token = jwt.sign( data.username , JWT_SECRET2);
    res.send({message:"login successful",token});
  }
})

function auth(req, res, next) {
  // console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Please sign in first" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.username = decoded.username;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
app.get("/me", auth, async function (req, res) {
  const existingUser = await UserModel.findOne({ username: req.username });

  res.json({
    username: existingUser.username,
  });
});



app.post("/new-complaint",auth,async function (req,res){
  try{
    const user = await UserModel.findOne({username:req.username});
  const id =  user._id;
  const data = req.body;
  console.log(data);
  await ComplaintModel.create({
    userId:id,
    title:data.title,
    urgent:data.urgent,
    hostel:data.hostel,
    room_no:data.room_no,
    done:data.done,
    });
    

    res.send({message:"Complaint Added"});
  }catch(error){
    res.send({error});
  }
})

app.get("/get-complaints", auth, async function (req, res) {
  try {
    const user = await UserModel.findOne({ username: req.username });
    const id = user._id;

    const complaints = await ComplaintModel.find({ userId: id });
    console.log(complaints);
    res.json(complaints);   // ✅ send array directly
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/admin", async function(req,res){
  const allComplaints = await ComplaintModel.find({})
  res.send({allComplaints});
})
app.put("/markedDone/:id", async (req, res) => {
  try {
    await ComplaintModel.findByIdAndUpdate(
      req.params.id,
      { done: true }
    );

    res.json({ message: "Marked as done" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
