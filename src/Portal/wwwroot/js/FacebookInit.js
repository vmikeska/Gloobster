var FacebookInit = (function () {
    function FacebookInit(onInitializedCallback) {
        var _this = this;
        this.asyncInit = function () {
            FB.init({
                appId: '1519189774979242',
                cookie: true,
                xfbml: true,
                version: 'v2.2'
            });
            if (_this.onInitialized) {
                _this.onInitialized();
            }
        };
        this.onInitialized = onInitializedCallback;
    }
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
//# sourceMappingURL=FacebookInit.js.map