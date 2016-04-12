var Views;
(function (Views) {
    var TwitterAuthView = (function () {
        function TwitterAuthView() {
            this.twInterval = null;
            this.cookiesSaver = new Reg.AuthCookieSaver();
        }
        TwitterAuthView.prototype.onResponse = function (resp) {
            var _this = this;
            var data = resp;
            this.apiPost("TwitterUser", data, function (r) {
                var lrv = new Reg.LoginResponseValidator();
                var resValid = lrv.validate(r);
                if (!resValid) {
                    close();
                    return;
                }
                _this.cookiesSaver.saveTwitterLogged();
                _this.cookiesSaver.saveCookies(r);
                _this.twitterLoginWatch(function () {
                    close();
                });
            });
        };
        TwitterAuthView.prototype.twitterLoginWatch = function (callback) {
            var _this = this;
            this.twInterval = setInterval(function () {
                var isLogged = _this.cookiesSaver.isTwitterLogged();
                if (isLogged) {
                    clearInterval(_this.twInterval);
                    callback();
                }
            }, 500);
        };
        TwitterAuthView.prototype.apiPost = function (endpointName, data, callback) {
            var endpoint = '/api/' + endpointName;
            console.log("posting: " + endpoint);
            var request = new Common.RequestSender(endpoint, data, true);
            request.serializeData();
            request.onSuccess = callback;
            request.onError = function (response) { console.log(JSON.stringify(response)); };
            request.sendPost();
        };
        return TwitterAuthView;
    })();
    Views.TwitterAuthView = TwitterAuthView;
})(Views || (Views = {}));
//# sourceMappingURL=TwitterAuthView.js.map