const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const jwtSecret = process.env.JWT_SECRET;

//Generate user token

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d"
    })
}

//Register user and Sign in

const register = async (req, res) => {

    const { name, email, password } = req.body;

    //Check if user exist
    const user = await User.findOne({ email });
    if (user) {
        res.status(422).json({ errors: ["Por favor, utilize outro e-mail"] })
        return
    }

    //Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //Create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    });

    //If user was created succesfully, return the token
    if (!newUser) {
        res.status(422).json({ errors: ["Houveum erro por favor tente mais tarde."] });
        return
    }

    return res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })
}

//Sing user in
const login = async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //Check if user exists

    if (!user) {
        res.status(404).json({ errors: ["Usuário não encontrado"] });
        return
    }

    //Check if passord matches

    if (!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({ errors: ["Senha inválida."] });
        return
    }

    //Return user with token
    return res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    })

}

//Get current logged user
const getCurrentUser = async (req, res) => {
    const user = req.user;
    res.status(200).json(user);
}

//Update a User

const update = async (req, res) => {

    const { name, password, bio } = req.body;

    let profileImage = null;

    if (req.file) {
        profileImage = req.file.filename;
    }

    const reqUser = req.user;

    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password");

    if (name) {
        user.name = name;
    }

    if (password) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        user.password = passwordHash;
    }

    if (profileImage) {
        user.profileImage = profileImage;
    }

    if (bio) {
        user.bio = bio;
    }

    await user.save();

    res.status(200).json(user);

}

//Get user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(new mongoose.Types.ObjectId(id)).select("-password");
    try {
        //Check if user exists
        if (!user) {
            res.status(404).json({ errors: ["Usuário não encontrado-1."] })
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ errors: ["Usuário não encontrado-2."] })
        return;
    }

}

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
};