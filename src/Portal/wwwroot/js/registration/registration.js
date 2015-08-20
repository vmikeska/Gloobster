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
        this.createUserEndpoint = '/api/user';
    }
    CreateUserBase.prototype.onSuccess = function (response) {
    };
    CreateUserBase.prototype.onError = function (response) {
    };
    CreateUserBase.prototype.sendUserRegistrationData = function (newUser) {
        //var serializedData = JSON.stringify(newUser); //$(newUser).serialize()
        var request = new RequestSender(this.createUserEndpoint, newUser);
        request.serializeData();
        request.onSuccess = this.onSuccess;
        request.onError = this.onError;
        request.post();
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
var RequestSender = (function () {
    function RequestSender(endPoint, data) {
        this.endPoint = endPoint;
        this.data = data;
        this.dataToSend = data;
    }
    RequestSender.prototype.serializeData = function () {
        this.dataToSend = JSON.stringify(this.data);
    };
    RequestSender.prototype.post = function () {
        $.ajax({
            type: 'POST',
            url: this.endPoint,
            data: this.dataToSend,
            success: function (response) {
                if (this.onSuccess) {
                    this.onSuccess(response);
                }
            },
            error: function (response) {
                if (this.onError) {
                    this.onError(response);
                }
            },
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
        });
    };
    return RequestSender;
})();
//# sourceMappingURL=registration.js.map