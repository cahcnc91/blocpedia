const Authorizer = require('../policies/application');;
const wikiQueries = require('../db/queries.wikis.js');
const userQueries = require('../db/queries.users.js');
const collaboratorQueries = require('../db/queries.collaborators.js');

module.exports = {

    show(req, res, next) {
        wikiQueries.getWikiCollaborator(req.params.wikiId, (err, result) => {
            userQueries.getUsersNotCollaborator((err, usersNotCollaborator) => {
                wiki = result["wiki"];
                collaborators = result["collaborators"];

                if(err || wiki == null) {
                    res.redirect(404, "/");
                } else {

                    const authorized = new Authorizer(req.user, wiki, collaborators).createPrivate()

                    if(authorized) {
                        res.render("collaborator/show", {wiki, collaborators, usersNotCollaborator}); 
                    } else {
                        req.flash("notice", "You are not authorized to do that.");
                        res.redirect(`/wikis/${req.params.wikiId}`)

                    }
                    
                }
                
            })
            
        });
    },

    addCollaborator(req, res, next) {
        collaboratorQueries.addCollaborator(req, (err, collaborator) => {
          if(err) {
              req.flash("error", err);
          }
          res.redirect(req.headers.referer);
        });
      },

    removeCollaborator(req, res, next) {
          collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
              if(err){
                req.flash("error", err);
              } else {
                res.redirect(req.headers.referer);
              }
      })
    }

    



}