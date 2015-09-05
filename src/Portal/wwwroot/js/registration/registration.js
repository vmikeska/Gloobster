var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PortalUser = (function () {
    function PortalUser() {
    }
    return PortalUser;
})();
var FacebookUser = (function () {
    function FacebookUser(accessToken, userId, expiresIn, signedRequest) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.expiresIn = expiresIn;
        this.signedRequest = signedRequest;
    }
    return FacebookUser;
})();
var CreateUserBase = (function () {
    function CreateUserBase() {
        var _this = this;
        this.createUserEndpoint = '/api/user';
        this.onSuccess = function (response) {
            alert(JSON.stringify(response.encodedToken));
            _this.storeCookieWithToken(response.encodedToken);
        };
        this.onError = function (response) {
        };
    }
    CreateUserBase.prototype.storeCookieWithToken = function (token) {
        $.cookie("token", token);
        //todo: set other stuff, like domain and so
    };
    CreateUserBase.prototype.sendUserRegistrationData = function (newUser) {
        var request = new RequestSender(this.createUserEndpoint, newUser);
        request.serializeData();
        request.onSuccess = this.onSuccess;
        request.onError = this.onError;
        request.sentPost();
    };
    return CreateUserBase;
})();
var CreateUserFacebook = (function (_super) {
    __extends(CreateUserFacebook, _super);
    function CreateUserFacebook() {
        _super.apply(this, arguments);
    }
    CreateUserFacebook.prototype.handleRoughResponse = function (jsonRequest) {
        var fbUser = new FacebookUser(jsonRequest.accessToken, jsonRequest.userID, jsonRequest.expiresIn, jsonRequest.signedRequest);
        var baseUser = new PortalUser();
        //baseUser.displayName = 'test';
        baseUser.facebookUser = fbUser;
        _super.prototype.sendUserRegistrationData.call(this, baseUser);
    };
    return CreateUserFacebook;
})(CreateUserBase);
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
//# sourceMappingURL=registration.js.map