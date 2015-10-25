var GoogleButton = (function () {
    function GoogleButton() {
        this.config = {
            //todo: to constants
            client_id: "430126253289-14tdcfe4noqm6p201jrugpi9dsies2at.apps.googleusercontent.com",
            cookiepolicy: "single_host_origin"
        };
    }
    GoogleButton.prototype.initialize = function () {
        var _this = this;
        gapi.load("auth2", function () { _this.onLoaded(); });
    };
    GoogleButton.prototype.onLoaded = function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        //this.auth2 = gapi.auth2.getAuthInstance();
        //if (!this.auth2) {
        this.auth2 = gapi.auth2.init(this.config);
        //}
        var element = document.getElementById(this.elementId);
        this.attachSignin(element);
    };
    GoogleButton.prototype.errorHandler = function (error) {
        //todo: do something here ?
        alert(JSON.stringify(error, undefined, 2));
    };
    GoogleButton.prototype.attachSignin = function (element) {
        this.auth2.attachClickHandler(element, {}, this.successfulCallback, this.errorHandler);
    };
    return GoogleButton;
})();
//# sourceMappingURL=GoogleButton.js.map