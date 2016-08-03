var Constants;
(function (Constants) {
    Constants.tokenCookieName = "token";
    Constants.nameCookieName = "name";
    Constants.socNetsCookieName = "socNets";
    Constants.twitterLoggedCookieName = "twitterLogged";
    Constants.fullRegCookieName = "fullReg";
    Constants.firstRedirectUrl = "/travelmap";
    Constants.networkTypes = "NetworkTypes";
    Constants.emptyId = "000000000000000000000000";
})(Constants || (Constants = {}));
var SourceType;
(function (SourceType) {
    SourceType[SourceType["FB"] = 0] = "FB";
    SourceType[SourceType["S4"] = 1] = "S4";
    SourceType[SourceType["City"] = 2] = "City";
    SourceType[SourceType["Country"] = 3] = "Country";
    SourceType[SourceType["Yelp"] = 4] = "Yelp";
})(SourceType || (SourceType = {}));
var SocialNetworkType;
(function (SocialNetworkType) {
    SocialNetworkType[SocialNetworkType["Facebook"] = 0] = "Facebook";
    SocialNetworkType[SocialNetworkType["Google"] = 1] = "Google";
    SocialNetworkType[SocialNetworkType["Twitter"] = 2] = "Twitter";
    SocialNetworkType[SocialNetworkType["Base"] = 3] = "Base";
    SocialNetworkType[SocialNetworkType["Foursquare"] = 4] = "Foursquare";
    SocialNetworkType[SocialNetworkType["GeoNames"] = 5] = "GeoNames";
})(SocialNetworkType || (SocialNetworkType = {}));
var ParticipantState;
(function (ParticipantState) {
    ParticipantState[ParticipantState["Invited"] = 0] = "Invited";
    ParticipantState[ParticipantState["Accepted"] = 1] = "Accepted";
    ParticipantState[ParticipantState["Maybe"] = 2] = "Maybe";
    ParticipantState[ParticipantState["Refused"] = 3] = "Refused";
})(ParticipantState || (ParticipantState = {}));
var FlightCacheRecordType;
(function (FlightCacheRecordType) {
    FlightCacheRecordType[FlightCacheRecordType["City"] = 0] = "City";
    FlightCacheRecordType[FlightCacheRecordType["Country"] = 1] = "Country";
})(FlightCacheRecordType || (FlightCacheRecordType = {}));
var TabsWeekendType;
(function (TabsWeekendType) {
    TabsWeekendType[TabsWeekendType["ByWeek"] = 0] = "ByWeek";
    TabsWeekendType[TabsWeekendType["ByCity"] = 1] = "ByCity";
    TabsWeekendType[TabsWeekendType["ByCountry"] = 2] = "ByCountry";
})(TabsWeekendType || (TabsWeekendType = {}));
var Gender;
(function (Gender) {
    Gender[Gender["N"] = 0] = "N";
    Gender[Gender["M"] = 1] = "M";
    Gender[Gender["F"] = 2] = "F";
})(Gender || (Gender = {}));
var CheckinType;
(function (CheckinType) {
    CheckinType[CheckinType["Now"] = 0] = "Now";
    CheckinType[CheckinType["City"] = 1] = "City";
})(CheckinType || (CheckinType = {}));
var TripEntityType;
(function (TripEntityType) {
    TripEntityType[TripEntityType["Place"] = 0] = "Place";
    TripEntityType[TripEntityType["Travel"] = 1] = "Travel";
})(TripEntityType || (TripEntityType = {}));
//# sourceMappingURL=Globals.js.map