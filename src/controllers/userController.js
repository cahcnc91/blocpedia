const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
//const SENDGRID_API_KEY = require("../../sendgrid.js");


module.exports = {

    signUp(req, res, next){
      res.render("users/sign_up");
    },

    create(req, res, next){

        let newUser = {
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                console.log(err);
                res.redirect("/users/sign_up");
            } else {
                        
                passport.authenticate("local")(req, res, () => {
                    const SENDGRID_API_KEY = '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';
                    sgMail.setApiKey(SENDGRID_API_KEY);
                    //sgMail.setApiKey(SENDGRID_API_KEY.sendgridKey);
                    //console.log(SENDGRID_API_KEY.sendgridKey);
                    
                    const msg = {
                      to: newUser.email,
                      from: 'test@gmail.com',
                      subject: 'Thanks for signing up!',
                      text: 'Welcome to Blocpedia!',
                      html: '<strong>Make wikis now!</strong>',
                    };
                    sgMail.send(msg).then( () => {
                    }).
                      catch( error => {
                        console.error(error.toString());
                  
                        //Extract error msg
                        const {message, code, response} = error;
                  
                        //Extract response msg
                        const {headers, body} = response;
                      });
                       
                
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                 })

            }
        });
    },

    signInForm(req, res, next){
        res.render("users/sign_in");
    },

    signIn(req, res, next){

        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { 
                req.flash("notice", "Login info incorrect!");
                return res.redirect('/users/sign_in'); 
            }
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              return res.redirect('/');
            });
          })(req, res, next);

       /* passport.authenticate("local")(req, res, function () {
            if(!user){
              
              res.redirect("/users/sign_in");
            } else {
              req.flash("notice", "You've successfully signed in!");
              res.redirect("/");
            }
        })
        */
    },

    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    }

}
