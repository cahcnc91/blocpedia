const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:wikiId/collaborators", collaboratorController.index);
router.post("/wikis/:wikiId/edit/collaborator/add_collaborator", collaboratorController.addCollaborator);
router.post("/wikis/:wikiId/edit/collaborator/remove_collaborator", collaboratorController.addCollaborator);

module.exports = router;