var TravelB;
(function (TravelB) {
    var UserLocation = (function () {
        function UserLocation() {
        }
        UserLocation.setCurrentLocation = function (lat, lng) {
            this.currentLocation = { lat: lat, lng: lng };
        };
        UserLocation.getLocationByIp = function (callback) {
            $.get('http://freegeoip.net/json/', function (r) {
                callback(r);
            });
        };
        UserLocation.getLocation = function (callback) {
            var _this = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (pos) {
                    callback({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        exactLoc: true,
                        userDenied: false
                    });
                }, function (error) {
                    var userDenied = (error.code === error.PERMISSION_DENIED);
                    _this.getLocationByIp(function (ipLoc) {
                        callback({
                            lat: ipLoc.latitude,
                            lng: ipLoc.longitude,
                            exactLoc: false,
                            userDenied: userDenied
                        });
                    });
                });
            }
            else {
                this.getLocationByIp(function (ipLoc) {
                    callback({
                        lat: ipLoc.latitude,
                        lng: ipLoc.longitude,
                        exactLoc: false,
                        userDenied: false
                    });
                });
            }
        };
        UserLocation.currentLocation = null;
        return UserLocation;
    }());
    TravelB.UserLocation = UserLocation;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=UserLocation.js.map