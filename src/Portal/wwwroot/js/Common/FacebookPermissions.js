var Common;
(function (Common) {
    var FacebookPermissions = (function () {
        function FacebookPermissions() {
        }
        FacebookPermissions.prototype.initFb = function (callback) {
            var fbInit = new Reg.FacebookInit();
            fbInit.initialize(function () {
                FB.getLoginStatus(function (response) {
                    callback();
                });
            });
        };
        FacebookPermissions.prototype.hasPermission = function (permissionsName, callback) {
            FB.api("/me/permissions", function (permResp) {
                var found = _.find(permResp.data, function (permItem) {
                    return permItem.permission === permissionsName;
                });
                var hasPermissions = found && found.status === "granted";
                callback(hasPermissions);
            });
        };
        FacebookPermissions.prototype.requestPermissions = function (perm, callback) {
            FB.login(function (response) {
                callback(response);
            }, {
                scope: perm,
                auth_type: "rerequest"
            });
        };
        return FacebookPermissions;
    }());
    Common.FacebookPermissions = FacebookPermissions;
})(Common || (Common = {}));
//# sourceMappingURL=FacebookPermissions.js.map