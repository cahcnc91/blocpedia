const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Wiki = require("./models").Wiki;


module.exports = {

  createUser(newUser, callback){

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){

       let result = {};
       User.findById(id)
       .then((user) => {

         if(!user) {
           callback(404);
         } else {

           result["user"] = user;

           Wiki.scope({method: ["allWikis", id]}).all()
           .then((wikis) => {

             result["wikis"] = wikis;
             callback(null, result);
           })
             .catch((err) => {
               callback(err);
             })
           
         }
       })
    },

    upgrade(id, callback){
        return User.findById(id)
        .then((user) => {
            if(!user){
                return callback("User does not exist");
            } else {
                return user.updateAttributes({role: "premium"});
            }
        })
        .catch((err) => {
            callback(err);
        })
    },

    downgrade(id, callback){
        let result = {};
        return User.findById(id)
        .then((user) => {
            if(!user){
                return callback("User does not exist");
            } else {
                
                Wiki.update({
                    private: false,
                  }, {
                    where: {
                      userId:user.id
                    }
                  }
                )
                return user.updateAttributes({role: "standard"})    
            }
            
        })
        .catch((err) => {
            callback(err);
        })
                          
    }



        



}