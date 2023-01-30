const express = require("express");
const contactschema = require('../models/contact')


module.exports.contactform = (req,res)=>{
    res.render("./views/contact/contact.ejs");
}

module.exports.formsubmitted = async (req,res)=>{
    const contact = new contactschema(req.body);
    await contact.save();
    res.redirect("/");
}