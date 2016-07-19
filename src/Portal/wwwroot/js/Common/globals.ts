declare var $: any;
declare var _: any;
declare var FB: any;
declare var WE: any;
declare var L: any;
declare var gapi: any;
declare var Handlebars: any;
declare var Cookies: any;


//function geoip_country_code() { return 'DE'; }
//function geoip_country_name() { return 'Germany'; }
//function geoip_city() { return ''; }
//function geoip_region() { return ''; }
//function geoip_region_name() { return ''; }
//function geoip_latitude() { return '51'; }
//function geoip_longitude() { return '9'; }
//function geoip_postal_code() { return ''; }
//function geoip_area_code() { return ''; }
//function geoip_metro_code() { return ''; }

declare var geoip_latitude;
declare var geoip_longitude;

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

enum FlightCacheRecordType { City, Country }

enum TabsWeekendType { ByWeek, ByCity, ByCountry }

enum Gender { N, M, F }

enum CheckinType { Now, City }
