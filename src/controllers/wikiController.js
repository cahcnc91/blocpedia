const wikiQueries = require("../db/queries.wikis.js");
const userQueries = require("../db/queries.users.js");
const Authorizer = require("../policies/application");
const md = require( "markdown" ).markdown;


module.exports = {

    index(req, res, next){
        wikiQueries.getAllWikis((err, wikis) => {

            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/index", {wikis});
            }
        })
    },
    
    new(req, res, next){

        const authorized = new Authorizer(req.user).new();

        if(authorized) {
            res.render("wikis/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    newPrivate(req, res, next){

        const authorized = new Authorizer(req.user).newPrivate();

        if(authorized) {
            res.render("wikis/new_private");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    create(req, res, next){

        const authorized = new Authorizer(req.user).create();

        if(authorized) {
            let newWiki= {
            title: req.body.title,
            body: req.body.body,
            userId: req.user.id
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if(err){
                    res.redirect(500, "/wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            console.log('failed');
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    createPrivate(req, res, next){

        const authorized = new Authorizer(req.user).createPrivate();

        if(authorized){

            let newWiki= {
            title: req.body.title,
            body: req.body.body,
            userId: req.user.id,
            private: true
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if(err){
                    res.redirect(500, "/wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },

    show(req, res, next){

        wikiQueries.getWikiCollaborator(req.params.id, (err, result) => {

            wiki = result["wiki"];
            collaborators = result["collaborators"];
        
            if(err || wiki == null){
                res.redirect(404, "/");
            } else {
                wiki.body = md.toHTML(wiki.body);

                    res.render("wikis/show", {wiki, collaborators});


            }
        });
    },

    destroy(req, res, next){

        wikiQueries.deleteWiki(req.params.id, req, (err, wiki) => {
        
            if(err || wiki == null){
                req.flash("notice", "You are not authorized to do that.")
                res.render(`/wikis/${req.params.id}`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    },

    edit(req, res, next){
        
        wikiQueries.getWikiCollaborator(req.params.id, (err, result) => {

            wiki = result["wiki"];
            collaborators = result["collaborators"];

            if(err || wiki == null){
              res.redirect(404, "/");
            } else {

              const authorized = new Authorizer(req.user, wiki, collaborators).edit();
 
              if(authorized){
                  res.render("wikis/edit", {wiki, collaborators});
              } else {
                req.flash("alert", "You are not authorized to do that");
                return res.redirect(`/wikis/${req.params.id}`);
                
                  
              }
            }
          });
    },

    update(req, res, next){

        wikiQueries.updateWiki(req.params.id, req.body, req, (err, wiki) => {
        
            if(err || wiki == null){
                req.flash("notice","You are not authorized to do that.")
                res.render(`/wikis/${req.params.id}`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        });
    }

}