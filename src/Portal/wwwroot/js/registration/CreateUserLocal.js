var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Reg;
(function (Reg) {
    var CreateUserLocal = (function (_super) {
        __extends(CreateUserLocal, _super);
        function CreateUserLocal() {
            _super.call(this);
            this.endpoint = "/api/User";
            this.loginType = Reg.NetworkType.Base;
        }
        CreateUserLocal.prototype.registerOrLogin = function (mail, password, action) {
            var baseUser = new PortalUser();
            baseUser.mail = mail;
            baseUser.password = password;
            baseUser.action = action;
            _super.prototype.sendUserRegistrationData.call(this, baseUser);
        };
        return CreateUserLocal;
    })(Reg.CreateUserBase);
    Reg.CreateUserLocal = CreateUserLocal;
    var PortalUser = (function () {
        function PortalUser() {
        }
        return PortalUser;
    })();
    Reg.PortalUser = PortalUser;
})(Reg || (Reg = {}));
//# sourceMappingURL=CreateUserLocal.js.map