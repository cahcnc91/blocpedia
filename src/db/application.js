module.exports = class ApplicationPolicy {

  constructor(user, record, collaborators) {
    this.user = user;
    this.record = record;
    this.collaborators = collaborators;
  }

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role == "admin";
  }

  _isStandard() {
      return this.user && this.user.role == "standard";
  }

  _isPremium() {
      return this.user && this.user.role == "premium";
  }

 /* _isCollaborator() {
    this.collaborators.forEach(collaborator => {
      if (collaborator.userId === this.user.id) {
        console.log('true')
        return true;
      }
    }) 
  }
  */
  _isCollaborator() { 
    var isCollaborator = false;
    this.collaborators.forEach(collaborator => { 
      if (this.user && collaborator.userId === this.user.id) { 
        isCollaborator = this.user && collaborator.userId === this.user.id; 
        return isCollaborator
      } 
    })
    return isCollaborator; 
  }

  new() {
    return this.user != null;
  }

  newPrivate() {
    return this._isPremium();
  }

  create() {
    return this.new();
  }

  createPrivate() {
    return this._isPremium() || this._isAdmin();
  }

  show() {
    return true;
  }

  edit() {
    if (this.record.private == false) {
      return this.new() &&
        this.record && (this._isStandard() || this._isPremium() || this._isAdmin());
      } else if (this.record.private == true && this.collaborators) {
        return (this.record && this._isPremium()) || this._isAdmin() || this._isCollaborator();
      } else if (this.record.private == true) {
        return this.new() &&
        (this.record && this._isPremium() && this._isOwner()) || this._isAdmin()
      }
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }

}
