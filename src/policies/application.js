module.exports = class ApplicationPolicy {

  constructor(user, record, collaborators) {
    this.user = user;
    this.record = record;
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
      } else if (this.record.private == true) {
        return this.new() &&
         (this.record && this._isOwner && this._isPremium()) || this._isAdmin();
      }
    
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }

}
