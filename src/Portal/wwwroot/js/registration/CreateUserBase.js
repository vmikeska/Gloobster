var CreateUserBase = (function () {
    function CreateUserBase() {
        var _this = this;
        this.endpoint = "";
        this.onSuccess = function (response) {
            console.log("storing cookie: " + response.encodedToken);
            _this.storeCookieWithToken(response.encodedToken, response.networkType);
            $(".popup").hide();
        };
        this.onError = function (response) {
            //todo: show some general error dialog
        };
        this.cookieManager = new CookieManager();
    }
    CreateUserBase.prototype.storeCookieWithToken = function (encodedToken, networkType) {
        var cookieObj = new CookieLogin();
        cookieObj.encodedToken = encodedToken;
        cookieObj.networkType = parseInt(networkType);
        this.cookieManager.setJson(Constants.cookieName, cookieObj);
        console.log("token received: " + this.loginType);
        if (cookieObj.networkType !== NetworkType.Twitter) {
            window.location.href = Constants.firstRedirectUrl;
        }
    };
    CreateUserBase.prototype.sendUserRegistrationData = function (newUser) {
        var request = new RequestSender(this.endpoint, newUser);
        request.serializeData();
        request.onSuccess = this.onSuccess;
        request.onError = this.onError;
        request.sendPost();
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
//# sourceMappingURL=CreateUserBase.js.map