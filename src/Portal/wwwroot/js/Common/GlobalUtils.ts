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
	}
}