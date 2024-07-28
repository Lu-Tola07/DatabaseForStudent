require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
require("./config/db");
const router = require("./router/schoolRouter")

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/api/v1", router);

app.listen(port, () => {
    console.log(`Server is running on ${port}.`)
});