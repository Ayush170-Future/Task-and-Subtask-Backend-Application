const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const registerAdmin = asyncHandler( async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const adminAvailable = await Admin.findOne({email});
    if(adminAvailable) {
        res.status(400)
        throw new Error("Admin already exist");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
        email: email,
        password: hashedPassword
    })

    const result = await newAdmin.save();
    if(result) {
        res.status(200).json({_id: newAdmin.id, email: newAdmin.email, message: "Registered"});
    } else {
        res.status(400);
        throw new Error("Admin data not saved")
    }
})

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
        const accessToken = jwt.sign(
            {
                admin: {
                    _id: admin._id,
                    email: admin.email,
                },
            },
            process.env.JWT_SECRET, // secret phrase anything
            { expiresIn: "1d" } // JWT token expires in 1 Day
        );
        res.status(200).json({ access: accessToken, message: "Success" });
    } else {
        res.status(400);
        throw new Error("Task did not save, Try again.");
    }
});

module.exports = {registerAdmin, loginAdmin};