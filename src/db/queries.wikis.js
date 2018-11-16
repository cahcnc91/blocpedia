const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/application");

module.exports = {
  getAllWikis(callback) {
    return Wiki.all()

      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },

  addWiki(newWiki, callback) {
    return Wiki.create(newWiki)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        console.log(err);
        callback(err);
      });
  },

  getWiki(id, callback) {
    return Wiki.findById(id)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  getWikiCollaborator(id, callback) {
    let result = {};
    return Wiki.findById(id)
      .then(wiki => {
        if (!wiki) {
          callback(404);
        } else {
          result["wiki"] = wiki;
          Collaborator.scope({ method: ["collaboratorsFor", id] })
            .all()
            .then(collaborators => {
              result["collaborators"] = collaborators;
              callback(null, result);
            });
        }
      })
      .catch(err => {
        callback(err);
      });
  },

  deleteWiki(req, callback) {
    return Wiki.findById(req.params.id)
      .then(wiki => {
        const authorized = new Authorizer(req.user, wiki).destroy();

        if (authorized) {
          wiki.destroy().then(res => {
            callback(null, wiki);
          });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          callback(401);
        }
      })
      .catch(err => {
        callback(err);
      });
  },

  updateWiki(id, updatedWiki, req, callback) {
    let result = {};
    Wiki.findById(id)
    .then(wiki => {
      if (!wiki) {
        callback(404);
        console.log("Not Found");
      } else {
        result["wiki"] = wiki;
        Collaborator.scope({ method: ["collaboratorsFor", id] })
          .all()
          .then(collaborators => {
            result["collaborators"] = collaborators;
            callback(null, result);

            const authorized = new Authorizer(
              req.user,
              wiki,
              collaborators
            ).update();

            if (authorized) {
              wiki.update(updatedWiki, {
                fields: Object.keys(updatedWiki)
              });
            } else {
              req.flash("notice", "You are not authorized to do that.");
              console.log("not authorized");
              callback("Forbidden");
            }
          });
      }
    });
  },

  upgradeUser(id, callback) {
    return User.findById(id)
      .then(user => {
        if (!user) {
          return callback("User does not exist");
        } else {
          return user.updateAttributes({ role: "premium" });
        }
      })
      .catch(err => {
        callback(err);
      });
  }
};
