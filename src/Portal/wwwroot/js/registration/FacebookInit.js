var Reg;
(function (Reg) {
    var FacebookInit = (function () {
        function FacebookInit() {
            var _this = this;
            this.asyncInit = function () {
                FB.init({
                    appId: document["facebookId"],
                    cookie: true,
                    xfbml: true,
                    version: 'v2.5'
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
            var src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5";
            var scriptElem = doc.getElementById(scriptElementId);
            var isSdkAlreadyLoaded = scriptElem != null;
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