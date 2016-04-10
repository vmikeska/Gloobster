var Reg;
(function (Reg) {
    var FacebookInit = (function () {
        function FacebookInit() {
        }
        FacebookInit.prototype.initialize = function (callback) {
            if (FacebookInit.initCalled) {
                if (FacebookInit.initialized) {
                    callback();
                }
                else {
                    FacebookInit.onInitialized.push(callback);
                }
                return;
            }
            else {
                FacebookInit.initCalled = true;
                FacebookInit.onInitialized.push(callback);
            }
            $.ajaxSetup({ cache: true });
            $.getScript("//connect.facebook.net/en_US/sdk.js", function () {
                FB.init({
                    appId: document["facebookId"],
                    cookie: true,
                    xfbml: true,
                    version: 'v2.5'
                });
                FacebookInit.initialized = true;
                FacebookInit.onInitialized.forEach(function (f) { f(); });
            });
        };
        FacebookInit.onInitialized = [];
        FacebookInit.initCalled = false;
        FacebookInit.initialized = false;
        return FacebookInit;
    })();
    Reg.FacebookInit = FacebookInit;
})(Reg || (Reg = {}));
//# sourceMappingURL=FacebookInit.js.map