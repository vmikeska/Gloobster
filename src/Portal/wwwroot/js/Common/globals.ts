﻿declare var $: any;
declare var _: any;
declare var FB: any;
declare var WE: any;
declare var L: any;
declare var gapi: any;
declare var Handlebars: any;

module Constants {
	export var cookieName = "loginCookie";
	export var firstRedirectUrl = "/PinBoard/Pins";
	export var networkTypes = "NetworkTypes";
	export var emptyId = "000000000000000000000000";
}

enum SourceType { FB, S4, City, Country }

enum SocialNetworkType { Facebook, Google, Twitter, Base, Foursquare, GeoNames }

enum ParticipantState { Invited, Accepted, Maybe, Refused }

enum UserActionType { Login, Register }
