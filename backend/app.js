require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

//Config JSON e Form Data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Solve cors
app.use(cors({credentials:true, origin:"http://localhost:3000"}));

//Upload directory
app.use("/uploads", express.static(path.join(__dirname,"/uploads")));

//DB Conection
require("./config/db.js");

//Routes
const  router = require("./routes/Router.js");

app.use(router);

//test route
router.get("/", (req, res) => {
    res.send("Api working!");
});

app.listen( port, () => {
    console.log(`App rodando na porta ${port}`);
})