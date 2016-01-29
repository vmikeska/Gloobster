var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Reg;
(function (Reg) {
    var CreateUserFacebook = (function (_super) {
        __extends(CreateUserFacebook, _super);
        function CreateUserFacebook() {
            var _this = this;
            _super.call(this);
            this.endpoint = "/api/FacebookUser";
            this.statusChangeCallback = function (response) {
                if (response.status === "connected") {
                    _this.handleRoughResponse(response.authResponse);
                }
                else if (response.status === "not_authorized") {
                }
                else {
                }
            };
            this.loginType = Reg.NetworkType.Facebook;
        }
        CreateUserFacebook.prototype.registerOrLogin = function () {
            FB.getLoginStatus(this.statusChangeCallback);
        };
        CreateUserFacebook.prototype.handleRoughResponse = function (jsonRequest) {
            var fbUser = new FacebookUser(jsonRequest.accessToken, jsonRequest.userID, jsonRequest.expiresIn, jsonRequest.signedRequest);
            _super.prototype.sendUserRegistrationData.call(this, fbUser);
        };
        CreateUserFacebook.prototype.login = function () {
            FB.login(this.statusChangeCallback, { scope: 'publish_actions,user_location,user_hometown,user_friends,email' });
        };
        return CreateUserFacebook;
    })(Reg.CreateUserBase);
    Reg.CreateUserFacebook = CreateUserFacebook;
    var FacebookUser = (function () {
        function FacebookUser(accessToken, userId, expiresIn, signedRequest) {
            this.accessToken = accessToken;
            this.userId = userId;
            this.expiresIn = expiresIn;
            this.signedRequest = signedRequest;
        }
        return FacebookUser;
    })();
    Reg.FacebookUser = FacebookUser;
})(Reg || (Reg = {}));
//# sourceMappingURL=CreateUserFacebook.js.map