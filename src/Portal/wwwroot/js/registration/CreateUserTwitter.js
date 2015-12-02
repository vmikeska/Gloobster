var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Reg;
(function (Reg) {
    var CreateUserTwitter = (function (_super) {
        __extends(CreateUserTwitter, _super);
        function CreateUserTwitter() {
            _super.call(this);
            this.endpoint = "/api/TwitterUser";
            this.loginType = Reg.NetworkType.Twitter;
        }
        CreateUserTwitter.prototype.handleRoughResponse = function (twUser) {
            _super.prototype.sendUserRegistrationData.call(this, twUser);
        };
        return CreateUserTwitter;
    })(Reg.CreateUserBase);
    Reg.CreateUserTwitter = CreateUserTwitter;
})(Reg || (Reg = {}));
//# sourceMappingURL=CreateUserTwitter.js.map