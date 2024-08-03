const express = require("express");
const {datafetch} = require("../controller/dataDisplay")
const router =  express.Router();



router.get("/getData",datafetch);

module.exports = router;
