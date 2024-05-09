const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

//Generate user token

const generateToken = ( id ) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: "7d"
    })
}

//Register user and Sign in

const register = async (req, res) => {
    
    const { name, email, password } = req.body;
    
    //Check if user exist
    const user = await  User.findOne({email});
    if(user) {
        res.status(422).json({errors: ["Por favor, utilize outro e-mail"]})
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
    if(!newUser) {
        res.status(422).json({errors:["Houveum erro por favor tente mais tarde."]});
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
    const user = await User.findOne({email});

    //Check if user exists

    if(!user) {
        res.status(404).json({erros: ["Usuário não encontrado"]});
        return
    }

//Check if passord matches

if(!(await bcrypt.compare(password, user.password))){
    res.status(422).json({errors:["Senha inválida."]});
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

module.exports = {
    register,
    login,
    getCurrentUser,
};