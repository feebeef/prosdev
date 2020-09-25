const express = require("express");
const router = express.Router();
const moment = require('moment');

const bcrypt = require("bcryptjs");
const auth = require("../auth-account/auth.js");

const {Account} = require("../model/account");
const {Appointment} = require("../model/appointment");
const {Doctor} = require("../model/doctor");
const {Process} = require("../model/process");

const bad_request = (err, res) => {let x = ''; if(err)for(field in err.errors) x += (err.errors[field].message + '-')
                                     console.log(err); res.status(400).send(x)}
const ok_request = (data, res) => { console.log("sending back to client"); console.log(data); res.status(300).send(data) }

router.get("/admin", isAdmin, async function(req, res) {
	console.log("Admin login");
	let doctors = await Doctor.getAll();
	let processes = await Process.getAll();
	let accounts = await Account.find()
	let appointments = await Appointment.find()
						.populate('doctor')
						.populate('process')
						.exec()
	res.render('admin.hbs', {doctor: doctors, process: processes, account: accounts, appointment:appointments});
});


router.post("/addAccount", isAdmin, async function (req, res) {
	console.log("Adding secretary...");
	console.log(req.body);
	const { username, password, accountType } = req.body;
	
	try {
		let user = await Account.findOne({username});
		if(user) {
			return res.status(400).send({message: "Username taken."})
		}else{

			account = new Account({
				username,
				password,
				accountType
			});
			
			const salt = await bcrypt.genSalt(10);
			account.password = await bcrypt.hash(password, salt);
			
			account.acountType= accountType;
			
			await account.save();
			res.status(300).send({message: "Success"})
		} 
		}catch (err) {
			console.log(err.message);
			res.status(500).send("Could not save.");
	}

});
module.exports = router;