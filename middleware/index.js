var Record = require("../models/record");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkRecordOwnership = async function(req, res, next) {
    if(req.isAuthenticated()){
        try {
            var foundRecord = await Record.findById(req.params.id);
            if(foundRecord.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        } catch(err) {
            res.redirect("back");
        }
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = async function(req, res, next) {
    if(req.isAuthenticated()){
        try {
            var foundComment = await Comment.findById(req.params.comment_id);
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        } catch(err) {
            res.redirect("back");
        }
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("success", "You need to be logged in.")
    res.redirect("/login");
};

module.exports = middlewareObj;
