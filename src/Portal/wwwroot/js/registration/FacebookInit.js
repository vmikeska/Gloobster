var Reg;
(function (Reg) {
    var FacebookInit = (function () {
        function FacebookInit() {
            var _this = this;
            this.asyncInit = function () {
                FB.init({
                    //appId: '1519189774979242',
                    appId: '1717433995154818',
                    cookie: true,
                    xfbml: true,
                    version: 'v2.1'
                });
                _this.onFacebookInitialized();
            };
        }
        FacebookInit.prototype.initialize = function () {
            window['fbAsyncInit'] = this.asyncInit;
            this.sdkLoad(document);
        };
        FacebookInit.prototype.sdkLoad = function (doc) {
            var scriptElementName = 'script';
            var scriptElementId = 'facebook-jssdk';
            var src = "//connect.facebook.net/en_US/sdk.js";
            var isSdkAlreadyLoaded = doc.getElementById(scriptElementId);
            if (isSdkAlreadyLoaded)
                return;
            //create SCRIPT element for SDK
            var js = doc.createElement(scriptElementName);
            js.id = scriptElementId;
            js.src = src;
            //add loaded script before all the previous scripts
            var fjs = doc.getElementsByTagName(scriptElementName)[0];
            fjs.parentNode.insertBefore(js, fjs);
        };
        return FacebookInit;
    })();
    Reg.FacebookInit = FacebookInit;
})(Reg || (Reg = {}));
//# sourceMappingURL=FacebookInit.js.map