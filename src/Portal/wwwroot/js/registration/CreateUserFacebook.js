var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CreateUserFacebook = (function (_super) {
    __extends(CreateUserFacebook, _super);
    function CreateUserFacebook() {
        var _this = this;
        _super.call(this);
        //todo: rename
        this.createUserEndpoint = '/api/FacebookUser';
        this.statusChangeCallback = function (response) {
            if (response.status === 'connected') {
                _this.handleRoughResponse(response.authResponse);
            }
            else if (response.status === 'not_authorized') {
            }
            else {
            }
        };
        this.loginType = NetworkType.Facebook;
    }
    CreateUserFacebook.prototype.registerOrLogin = function () {
        FB.getLoginStatus(this.statusChangeCallback);
    };
    CreateUserFacebook.prototype.handleRoughResponse = function (jsonRequest) {
        var fbUser = new FacebookUser(jsonRequest.accessToken, jsonRequest.userID, jsonRequest.expiresIn, jsonRequest.signedRequest);
        _super.prototype.sendUserRegistrationData.call(this, fbUser);
    };
    return CreateUserFacebook;
})(CreateUserBase);
var FacebookUser = (function () {
    function FacebookUser(accessToken, userId, expiresIn, signedRequest) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.expiresIn = expiresIn;
        this.signedRequest = signedRequest;
    }
    return FacebookUser;
})();
//# sourceMappingURL=CreateUserFacebook.js.map