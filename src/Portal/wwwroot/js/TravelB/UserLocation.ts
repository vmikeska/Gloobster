module TravelB {
	export class UserLocation {

		public static currentLocation;

		public static setCurrentLocation(lat, lng) {
			this.currentLocation = { lat: lat, lng: lng };
		}

		private static getLocationByIp(callback) {
			$.get('http://freegeoip.net/json/', (r) => {
				callback(r);							
			});
		}

		public static getLocation(callback) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						callback({
							lat: pos.coords.latitude,
							lng: pos.coords.longitude,
							exactLoc: true,
							userDenied: false
						});
											
					},
					(error) => {
						var userDenied = (error.code === error.PERMISSION_DENIED);
						//other codes we consider as technical error: POSITION_UNAVAILABLE, TIMEOUT
										
						this.getLocationByIp((ipLoc) => {
							callback({
								lat: ipLoc.latitude,
								lng: ipLoc.longitude,
								exactLoc: false,
								userDenied: userDenied
							});
						});											
					}
				);

			} else {
				this.getLocationByIp((ipLoc) => {
					callback({
						lat: ipLoc.latitude,
						lng: ipLoc.longitude,
						exactLoc: false,
						userDenied: false
					});
				});
			}
		}

	}
}