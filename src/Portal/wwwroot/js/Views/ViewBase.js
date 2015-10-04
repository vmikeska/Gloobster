var Views;
(function (Views) {
    var ViewBase = (function () {
        function ViewBase() {
            this.loginManager = new LoginManager;
            var useCookie = true;
            var isAlreadyLogged = this.loginManager.isAlreadyLogged() && useCookie;
            if (isAlreadyLogged) {
                console.log("isAlreadyLogged with " + this.loginManager.cookieLogin.networkType);
            }
            if (!isAlreadyLogged) {
                this.initializeGoogle();
                this.initializeFacebook();
            }
        }
        ViewBase.prototype.initializeGoogle = function () {
            var self = this;
            this.googleInit = new GoogleInit();
            this.googleInit.onSuccess = function (googleUser) {
                self.loginManager.googleUserCreator.registerOrLogin(googleUser);
            };
            this.googleInit.onFailure = function (error) {
                //todo: display general dialog
            };
        };
        ViewBase.prototype.initializeFacebook = function () {
            var self = this;
            var fbInit = new FacebookInit();
            fbInit.onFacebookInitialized = function () {
                self.loginManager.facebookUserCreator.registerOrLogin();
            };
            fbInit.initialize();
        };
        ViewBase.prototype.apiGet = function (endpointName, params, callback) {
            var endpoint = '/api/' + endpointName;
            console.log("getting: " + endpoint);
            var request = new RequestSender(endpoint, null, true);
            request.params = params;
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sendGet();
        };
        ViewBase.prototype.apiPost = function (endpointName, data, callback) {
            var endpoint = '/api/' + endpointName;
            console.log("posting: " + endpoint);
            var request = new RequestSender(endpoint, data, true);
            request.serializeData();
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sentPost();
        };
        return ViewBase;
    })();
    Views.ViewBase = ViewBase;
})(Views || (Views = {}));
//# sourceMappingURL=ViewBase.js.map