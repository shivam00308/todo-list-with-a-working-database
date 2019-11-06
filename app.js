//jshint esversion:6

const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

var app = express();



app.use(bodyparser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemschema ={
  name: String
};
const Item = new mongoose.model("item", itemschema);
const item1 = new Item({
  name: "Welcome to your todo list"
});
const item2 = new Item({
  name: "click on the new item and type your work item to add it in your list"
});
const item3 = new Item({
  name: "<-- hit this checkbox if your work is completed"
});
const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {
      let today = new Date();
      let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
      };

      Item.find({}, function(err, results){
        if (results.length === 0) {
          Item.insertMany(defaultItems, function(err){
            if (err) {
              console.log(err);
            } else {
              console.log("success");

            }});
            res.redirect("/");
          } else {
          res.render("list", { listtitle: day , newlistitems: results});
          }});
      var day = today.toLocaleDateString("en-US", options);
    });




    app.post("/", function(req, res){
    const itemName = req.body.new;
    const item = new Item({
      name: itemName
    });

    item.save() ;
    res.redirect("/");
    });
    app.post("/delete", function(req, res){
      const checkedid = req.body.checkbox;
      Item.findByIdAndRemove(checkedid, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("success");
          res.redirect("/");
        }
      });
    });
    app.get("/work", function(req, res){
      res.render("list", {listtitle: "Work list", newlistitems: workitems});
    });




    app.listen(3000, function() {
      console.log("server created on localhost 3000");
    });
