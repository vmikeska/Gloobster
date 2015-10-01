//interface ICreateUser {		
// sendUserRegistrationData: Function;
// storeCookieWithToken(token: string);
// createUserEndpoint: string;
//}
//implements ICreateUser
var NetworkType;
(function (NetworkType) {
    NetworkType[NetworkType["Local"] = 0] = "Local";
    NetworkType[NetworkType["Facebook"] = 1] = "Facebook";
    NetworkType[NetworkType["Twitter"] = 2] = "Twitter";
    NetworkType[NetworkType["Google"] = 3] = "Google";
})(NetworkType || (NetworkType = {}));
var CreateUserBase = (function () {
    function CreateUserBase() {
        var _this = this;
        this.createUserEndpoint = '';
        this.onSuccess = function (response) {
            _this.storeCookieWithToken(response.encodedToken);
        };
        this.onError = function (response) {
            //todo: show some general error dialog
        };
    }
    CreateUserBase.prototype.storeCookieWithToken = function (token) {
        $.cookie("token", token);
        console.log("token received: " + this.loginType);
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
//# sourceMappingURL=registration.js.map