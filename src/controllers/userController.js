const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


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
                res.redirect("/");
            } else {
                        
                passport.authenticate("local")(req, res, () => {
                  
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
                    res.redirect("/wikis");
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
                req.flash("notice", "Login info incorrect");
                return res.redirect('/users/sign_in'); 
            }
            req.logIn(user, function(err) {
              if (err) { return next(err); }

             
                  res.redirect("/wikis");
                
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
    },

    show(req, res, next){

         userQueries.getUser(req.params.id, (err, result) => {
     
           if(err || result.user === undefined){
             req.flash("notice", "No user found with that ID.");
             res.redirect("/");
           } else {
             res.render("users/show", {...result});
           }
         });
    },

      upgrade(req, res, next){
        res.render("users/upgrade"); 
      },

      payment(req, res, next){
          stripe.customers.create({
              email: req.body.stripeEmail,
              source: req.body.stripeToken
          })
          .then((customer) => {
              stripe.charges.create({
                  amount: 1500,
                  description: "Blocipedia Premium Membership",
                  currency: "USD",
                  customer: customer.id
              })
          })
          .then((charge) => {
              userQueries.upgrade(req.user.dataValues.id);
              res.render("users/payment");
          })
      },

      downgrade(req, res, next){
          userQueries.downgrade(req.user.dataValues.id);
          req.flash("notice", "Your account has been downgraded to a Standard Membership");
          res.redirect("/");
      },

      paymentDone(req, res, next){
        res.render("users/payment"); 
      },


}
