var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CreateUserTwitter = (function (_super) {
    __extends(CreateUserTwitter, _super);
    function CreateUserTwitter() {
        _super.call(this);
        this.endpoint = "/api/TwitterUser";
        this.loginType = NetworkType.Twitter;
    }
    CreateUserTwitter.prototype.handleRoughResponse = function (twUser) {
        _super.prototype.sendUserRegistrationData.call(this, twUser);
    };
    return CreateUserTwitter;
})(CreateUserBase);
//# sourceMappingURL=CreateUserTwitter.js.map