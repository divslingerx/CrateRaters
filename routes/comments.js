var express = require("express");
var router  = express.Router({mergeParams: true});
var Record = require("../models/record");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, async function(req, res){
    try {
        console.log(req.params.id);
        var record = await Record.findById(req.params.id);
        res.render("comments/new", {record: record});
    } catch(err) {
        console.log(err);
    }
});

//Comments Create
router.post("/", middleware.isLoggedIn, async function(req, res){
    try {
        var record = await Record.findById(req.params.id);
        var comment = await Comment.create(req.body.comment);
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        await comment.save();
        record.comments.push(comment);
        await record.save();
        console.log(comment);
        req.flash("success", "Successfully added comment");
        res.redirect('/records/' + record._id);
    } catch(err) {
        req.flash("error", "Something went wrong");
        console.log(err);
        res.redirect("/records");
    }
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async function(req, res){
    try {
        var foundComment = await Comment.findById(req.params.comment_id);
        res.render("comments/edit", {record_id: req.params.id, comment: foundComment});
    } catch(err) {
        res.redirect("back");
    }
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, async function(req, res){
    try {
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        res.redirect("/records/" + req.params.id);
    } catch(err) {
        res.redirect("back");
    }
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, async function(req, res){
    try {
        await Comment.findByIdAndDelete(req.params.comment_id);
        req.flash("success", "Comment deleted");
        res.redirect("/records/" + req.params.id);
    } catch(err) {
        res.redirect("back");
    }
});

module.exports = router;
