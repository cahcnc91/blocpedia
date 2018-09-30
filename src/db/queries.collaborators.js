const User = require('./models').User;
const Wiki = require('./models').Wiki;
const Collaborator = require('./models').Collaborator;

module.exports = {

    addCollaborator(req, callback){
        
        if (req.user.email === req.body.email){
            req.flash("notice", 'You can not add yourself.'); 
            return callback("You can't add yourself");    
        }

         User.findOne({
            where: {
              email: req.body.email
              
            }
        })

       .then((user) => {
        if(!user){
          return callback("User does not exist")
        } 
        Collaborator.findOne({
          where: {
            userId: user.id,
            wikiId: req.params.wikiId
          }
        })
        .then((collaborator) => {
          if(collaborator) {
            console.log('error! This collaborator already exists');
            return callback('This user is already a collaborator on this wiki.')
          }
          let newCollaborator = {
            userId: user.id,
            wikiId: req.params.wikiId
          };
          return Collaborator.create(newCollaborator)
          .then((collaborator) => {
            callback(null, collaborator);
          })
          .catch((err) => {
            callback(err, null);
          })
        })
      })  
  },

  removeCollaborator(req, callback){

    Collaborator.findById(req.body.id)
 
    .then((collaborator) => {
     
      collaborator.destroy()
        .then((res) => {
          callback(null, collaborator);
      });
        })
        .catch((err) => {
        callback(err);
        });
   
  }




}