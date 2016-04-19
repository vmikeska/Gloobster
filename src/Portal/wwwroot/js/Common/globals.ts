declare var $: any;
declare var _: any;
declare var FB: any;
declare var WE: any;
declare var L: any;
declare var gapi: any;
declare var Handlebars: any;
declare var Cookies: any;

module Constants {
	export var tokenCookieName = "token";
	export var nameCookieName = "name";
	export var socNetsCookieName = "socNets";
	export var twitterLoggedCookieName = "twitterLogged";
	export var fullRegCookieName = "fullReg";

	export var firstRedirectUrl = "/PinBoard/Pins";
	export var networkTypes = "NetworkTypes";
	export var emptyId = "000000000000000000000000";
}

enum SourceType { FB, S4, City, Country, Yelp }

enum SocialNetworkType { Facebook, Google, Twitter, Base, Foursquare, GeoNames }

enum ParticipantState { Invited, Accepted, Maybe, Refused }
