var CreateUserBase = (function () {
    function CreateUserBase() {
        var _this = this;
        this.endpoint = "";
        this.onSuccess = function (response) {
            _this.storeCookieWithToken(response.encodedToken, response.networkType);
            $(".popup").hide();
        };
        this.onError = function (response) {
            //todo: show some general error dialog
        };
    }
    CreateUserBase.prototype.storeCookieWithToken = function (encodedToken, networkType) {
        var cookieObj = { "encodedToken": encodedToken, "networkType": networkType };
        var cookieStr = JSON.stringify(cookieObj);
        $.cookie(Constants.cookieName, cookieStr);
        var firstRedirectUrl = 'Home/PinBoard';
        console.log("token received: " + this.loginType);
        return;
        window.location.href = firstRedirectUrl;
    };
    CreateUserBase.prototype.sendUserRegistrationData = function (newUser) {
        var request = new RequestSender(this.endpoint, newUser);
        request.serializeData();
        request.onSuccess = this.onSuccess;
        request.onError = this.onError;
        request.sentPost();
    };
    return CreateUserBase;
})();
var NetworkType;
(function (NetworkType) {
    NetworkType[NetworkType["Facebook"] = 0] = "Facebook";
    NetworkType[NetworkType["Google"] = 1] = "Google";
    NetworkType[NetworkType["Twitter"] = 2] = "Twitter";
    NetworkType[NetworkType["Base"] = 3] = "Base";
})(NetworkType || (NetworkType = {}));
//interface ICreateUser {		
// sendUserRegistrationData: Function;
// storeCookieWithToken(token: string);
// endpoint: string;
//}
//implements ICreateUser
//# sourceMappingURL=CreateUserBase.js.map