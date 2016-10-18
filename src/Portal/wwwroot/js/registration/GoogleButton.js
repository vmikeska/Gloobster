var Reg;
(function (Reg) {
    var GoogleButton = (function () {
        function GoogleButton() {
            this.clientId = document["googleId"];
            this.config = {
                client_id: this.clientId,
                cookiepolicy: "single_host_origin"
            };
        }
        GoogleButton.prototype.initialize = function (elementId) {
            var _this = this;
            this.elementId = elementId;
            gapi.client.setApiKey(this.clientId);
            gapi.load("auth2", function () { _this.onLoaded(); });
        };
        GoogleButton.prototype.onLoaded = function () {
            var _this = this;
            if (this.auth2) {
                return;
            }
            this.auth2 = gapi.auth2.init(this.config);
            var element = document.getElementById(this.elementId);
            $(element).click(function (e) {
                if (_this.onBeforeClick) {
                    _this.onBeforeClick();
                }
            });
            if (element) {
                this.attachSignin(element);
            }
        };
        GoogleButton.prototype.errorHandler = function (error) {
            var id = new Common.InfoDialog();
            id.create("Sorry", "Something went wrong :(");
            console.log("GoogleError: " + JSON.stringify(error, undefined, 2));
        };
        GoogleButton.prototype.attachSignin = function (element) {
            this.auth2.attachClickHandler(element, {}, this.successfulCallback, this.errorHandler);
        };
        return GoogleButton;
    }());
    Reg.GoogleButton = GoogleButton;
})(Reg || (Reg = {}));
//# sourceMappingURL=GoogleButton.js.map