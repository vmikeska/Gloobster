var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Reg;
(function (Reg) {
    var CreateUserGoogle = (function (_super) {
        __extends(CreateUserGoogle, _super);
        function CreateUserGoogle() {
            _super.call(this);
            this.endpoint = "/api/GoogleUser";
            this.loginType = Reg.NetworkType.Google;
        }
        CreateUserGoogle.prototype.registerOrLogin = function (googleUser) {
            _super.prototype.sendUserRegistrationData.call(this, googleUser);
        };
        return CreateUserGoogle;
    })(Reg.CreateUserBase);
    Reg.CreateUserGoogle = CreateUserGoogle;
})(Reg || (Reg = {}));
//# sourceMappingURL=CreateUserGoogle.js.map