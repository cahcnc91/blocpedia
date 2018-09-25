module.exports = class ApplicationPolicy {

     constructor(user, record) {
       this.user = user;
       this.record = record;
     }

     _isOwner() {
      return this.record && (this.record.userId == this.user.id);
    }
  
    _isAdmin() {
      return this.user && this.user.role == "admin";
    }
   
     new() {
       return this.user != null;7
     }
   
     create() {
       return this.new();
     }
   
     show() {
       return true;
     }
   

     edit() {
      return this.user != null;
     }
   
     update() {
       return this.edit();
     }
   

     destroy() {
       return this.update();
     }
   }