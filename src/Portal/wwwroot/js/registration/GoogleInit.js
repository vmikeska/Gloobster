var GoogleInit = (function () {
    function GoogleInit() {
    }
    GoogleInit.prototype.initialize = function () {
        gapi.signin2.render('my-signin2', {
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'width': 200,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': this.onSuccess,
            'onfailure': this.onFailure
        });
    };
    return GoogleInit;
})();
//# sourceMappingURL=GoogleInit.js.map