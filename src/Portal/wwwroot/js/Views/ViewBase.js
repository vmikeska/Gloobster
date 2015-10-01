var Views;
(function (Views) {
    var ViewBase = (function () {
        function ViewBase() {
            this.initializeFacebook();
            this.initializeGoogle();
        }
        ViewBase.prototype.initializeGoogle = function () {
            var _this = this;
            this.googleInit = new GoogleInit();
            this.googleInit.onSuccess = function (googleUser) {
                _this.googleUserCreator.registerOrLogin(googleUser);
            };
            this.googleInit.onFailure = function (error) {
                //todo: display general dialog
            };
        };
        ViewBase.prototype.initializeFacebook = function () {
            var self = this;
            this.facebookUserCreator = new CreateUserFacebook();
            var fbInit = new FacebookInit();
            fbInit.onFacebookInitialized = function () {
                self.facebookUserCreator.registerOrLogin();
            };
            fbInit.initialize();
        };
        //		googleInit.onSuccess = function onSuccess(googleUser) {
        //			var dbgStr = 'Logged in as: ' + googleUser.getBasicProfile().getName();
        //			console.log(dbgStr);
        //			alert(dbgStr);
        //			currentView.googleUserLogged(googleUser);
        //		}
        //		function renderButton() {
        //googleInit.renderButton();
        //}
        ViewBase.prototype.apiGet = function (endpointName, params, callback) {
            var endpoint = '/api/' + endpointName;
            var request = new RequestSender(endpoint, null, true);
            request.params = params;
            request.onSuccess = callback;
            request.onError = function (response) { alert('error'); };
            request.sendGet();
        };
        ViewBase.prototype.apiPost = function (endpointName, data, callback) {
            var endpoint = '/api/' + endpointName;
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