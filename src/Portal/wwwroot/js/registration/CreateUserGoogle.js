var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CreateUserGoogle = (function (_super) {
    __extends(CreateUserGoogle, _super);
    function CreateUserGoogle() {
        _super.call(this);
        //todo: rename
        this.createUserEndpoint = '/api/GoogleUser';
        this.loginType = NetworkType.Google;
    }
    CreateUserGoogle.prototype.registerOrLogin = function (googleUser) {
        _super.prototype.sendUserRegistrationData.call(this, googleUser);
    };
    return CreateUserGoogle;
})(CreateUserBase);
//# sourceMappingURL=CreateUserGoogle.js.map