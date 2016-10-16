module Common {
	export class GlobalUtils {

		public static getSocLink(sourceType: SourceType, sourceId: string) {
			var link = "";
			if (sourceType === SourceType.FB) {
				link = "http://facebook.com/" + sourceId;
			}
			if (sourceType === SourceType.S4) {
				link = "http://foursquare.com/v/" + sourceId;
			}
			if (sourceType === SourceType.Yelp) {
				link = "http://www.yelp.com/biz/" + sourceId;
			}
			return link;
		}


		public static getDistance(lat1, lon1, lat2, lon2) {
			var r = 6371; // Radius of the earth in km
			var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
			var dLon = this.deg2rad(lon2 - lon1);
			var a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
					Math.sin(dLon / 2) * Math.sin(dLon / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = r * c; // Distance in km
			return d;
		}

		private static deg2rad(deg) {
			return deg * (Math.PI / 180);
		}

	}
}



