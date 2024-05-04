const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyparser = require("body-parser");
const Student = require("./models");
const con = require("./config");

const app = express();
app.set("view-engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

mongoose
  .connect(con.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch(() => {
    console.log("could not connect", err);
    process.exit();
  });

app.post('/addmarks' ,(req,res) =>{
  var myData = new Student(req.body);
  myData
  .save()
  .then((item) =>
  {
    console.log("item saved");
    res.redirect('/getmarks');
  })
  .catch((err) =>{
    console.log(res.status(400).send("unable to save data"));
  });
});

app.get('/getmarks',  (req,res) =>
{
  console.log(req.query);
  Student.find(req.query)
  .then((student) =>
{
   res.render("table",{
    student:student
   })
   .catch((err) =>{
      res.json({message:"err"});
   });
});
});

app.get('/dsbdagreater40',(req,res) => {
  Student.find({ dsbda_marks : {$gt: 40}})
  .then((student) => {
    res.render("table",{student : student});
  })

  .catch((err) =>{
    res.json({message:"err"});
  });
});

app.get('/wadccmarks20',(req,res) => {
  Student.find({ wad_marks : {$gt : 40 } , cc_marks : { $gt : 40}})
  .then((student) =>{
    res.render("table" , {
      student : student
    });
  })
  .catch((err) =>{
    res.json({message:"err"});
  });
});

app.post('/deletestudent/:id ' , (req,res) => {
  Student.findByIdAndDelete(req.params.id)
  .then((student) => {
    console.log("katt gaya");
    res.redirect("/getmarks");
  });
});

app.listen(3000, () => {
  console.log("port is listening");
});
