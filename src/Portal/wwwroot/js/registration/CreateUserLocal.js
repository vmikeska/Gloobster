var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CreateUserLocal = (function (_super) {
    __extends(CreateUserLocal, _super);
    function CreateUserLocal() {
        _super.apply(this, arguments);
    }
    CreateUserLocal.prototype.createUser = function (displayName, mail, password) {
        var baseUser = new PortalUser();
        baseUser.displayName = displayName;
        baseUser.mail = mail;
        baseUser.password = password;
        _super.prototype.sendUserRegistrationData.call(this, baseUser);
    };
    return CreateUserLocal;
})(CreateUserBase);
var PortalUser = (function () {
    function PortalUser() {
    }
    return PortalUser;
})();
//# sourceMappingURL=CreateUserLocal.js.map