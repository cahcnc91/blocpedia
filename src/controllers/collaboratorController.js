const Authorizer = require('../policies/application');
const wikiQueries = require('../db/queries.wikis.js');
const collaboratorQueries = require('../db/queries.collaborators.js');

module.exports = {

    addCollaborator(req, res, next) {
        console.log('worked');
        console.log(req.body);
        collaboratorQueries.add(req, (err, collaborator) => {
            if(err) {
                console.log(err);
                req.flash("error", err);
            }
            res.redirect(req.headers.referer);
        });
    },



}