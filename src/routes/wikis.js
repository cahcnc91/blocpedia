const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const validation = require("./validation");
const helper = require("../auth/helpers");

router.get("/wikis", wikiController.index);

router.get("/wikis/new", wikiController.new);

router.get("/wikis/new_private", wikiController.newPrivate);

router.post("/wikis/create", wikiController.create);

router.post("/wikis/create_private", wikiController.createPrivate);

router.get("/wikis/searchstring", wikiController.getByString);

router.get("/wikis/:id", wikiController.show);

router.post("/wikis/:id/destroy", wikiController.destroy);

router.get("/wikis/:id/edit", wikiController.edit);

router.post("/wikis/:id/update", wikiController.update);

module.exports = router;
