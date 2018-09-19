const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

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
                res.redirect("/users/sign_up");
            } else {
                        
                passport.authenticate("local")(req, res, () => {
                    console.log('USER CREATED SUCCESSFULLY!')
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    
                    console.log('Sending email');
                    console.log(process.env.SENDGRID_API_KEY);
                    console.log(SENDGRID_API_KEY);
                    const msg = {
                      to: newUser.email,
                      from: 'test@example.com',
                      subject: 'Thanks for signing up!',
                      text: 'Welcome to Blocpedia!',
                      html: '<strong>Make wikis now!</strong>',
                    };
                    console.log(newUser.email);
                    sgMail.send(msg);
                    console.log(msg);
                
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                 })

            }
        });
    }

}
