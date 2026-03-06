var express = require("express");
var router  = express.Router();
var Record = require("../models/record");
var middleware = require("../middleware");


//INDEX - show all records
router.get("/", async function(req, res){
    try {
        var allRecords = await Record.find({});
        res.render("records/index", {records: allRecords});
    } catch(err) {
        console.log(err);
    }
});

//CREATE - add new record to DB
router.post("/", middleware.isLoggedIn, async function(req, res){
    var data = {
     artist: req.body.artist,
     album: req.body.album,
     year: req.body.year,
     image: req.body.image,
     found: req.body.found,
     author: {
        id: req.user._id,
        username: req.user.username
    }
    };
    try {
        var newlyCreated = await Record.create(data);
        console.log(newlyCreated);
        res.redirect("/records");
    } catch(err) {
        console.log(err);
    }
});

//NEW - show form to create new record
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("records/new");
});

// SHOW - shows more info about one record
router.get("/:id", async function(req, res){
    try {
        var foundRecord = await Record.findById(req.params.id).populate("comments");
        console.log(foundRecord);
        res.render("records/show", {record: foundRecord});
    } catch(err) {
        console.log(err);
    }
});

// EDIT RECORD ROUTE
router.get("/:id/edit", middleware.checkRecordOwnership, async function(req, res){
    try {
        var foundRecord = await Record.findById(req.params.id);
        res.render("records/edit", {record: foundRecord});
    } catch(err) {
        res.redirect("/records");
    }
});

// UPDATE RECORD ROUTE
router.put("/:id", middleware.checkRecordOwnership, async function(req, res){
    try {
        await Record.findByIdAndUpdate(req.params.id, req.body.record);
        res.redirect("/records/" + req.params.id);
    } catch(err) {
        res.redirect("/records");
    }
});

// DESTROY RECORD ROUTE
router.delete("/:id", middleware.checkRecordOwnership, async function(req, res){
    try {
        await Record.findByIdAndDelete(req.params.id);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/records");
});


module.exports = router;
