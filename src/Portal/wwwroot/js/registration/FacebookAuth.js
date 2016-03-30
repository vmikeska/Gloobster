var Reg;
(function (Reg) {
    var FacebookAuth = (function () {
        function FacebookAuth() {
            var _this = this;
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
        }
        FacebookAuth.prototype.login = function () {
            FB.login(this.statusChangeCallback, { scope: 'publish_actions,user_location,user_hometown,user_friends,email' });
        };
        FacebookAuth.prototype.registerOrLogin = function () {
            FB.getLoginStatus(this.statusChangeCallback);
        };
        FacebookAuth.prototype.handleRoughResponse = function (jsonRequest) {
            var fbUser = new FacebookUser();
            fbUser.accessToken = jsonRequest.accessToken;
            fbUser.userId = jsonRequest.userID;
            fbUser.expiresIn = jsonRequest.expiresIn;
            fbUser.signedRequest = jsonRequest.signedRequest;
            if (this.onSuccessful) {
                this.onSuccessful(fbUser);
            }
        };
        return FacebookAuth;
    })();
    Reg.FacebookAuth = FacebookAuth;
    var FacebookUser = (function () {
        function FacebookUser() {
        }
        return FacebookUser;
    })();
    Reg.FacebookUser = FacebookUser;
})(Reg || (Reg = {}));
//# sourceMappingURL=FacebookAuth.js.map