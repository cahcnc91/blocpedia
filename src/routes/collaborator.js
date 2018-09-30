const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:wikiId/collaborator/show", collaboratorController.show);
router.post("/wikis/:wikiId/collaborator/add", collaboratorController.addCollaborator);
router.post("/wikis/:wikiId/collaborator/remove", collaboratorController.removeCollaborator);

module.exports = router;