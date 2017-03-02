function any(a) {
    if (a) {
        if (a.length > 0) {
            return true;
        }
    }
    return false;
}
function notNull(a) {
    return (a !== null) && (a !== "null") && (a !== undefined) && (a !== "undefined");
}
function parseBool(a) {
    return a.toLowerCase() === "true";
}
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
var NewPlacePosition;
(function (NewPlacePosition) {
    NewPlacePosition[NewPlacePosition["ToLeft"] = 0] = "ToLeft";
    NewPlacePosition[NewPlacePosition["ToRight"] = 1] = "ToRight";
})(NewPlacePosition || (NewPlacePosition = {}));
var TravelType;
(function (TravelType) {
    TravelType[TravelType["Walk"] = 0] = "Walk";
    TravelType[TravelType["Plane"] = 1] = "Plane";
    TravelType[TravelType["Car"] = 2] = "Car";
    TravelType[TravelType["Bus"] = 3] = "Bus";
    TravelType[TravelType["Train"] = 4] = "Train";
    TravelType[TravelType["Ship"] = 5] = "Ship";
    TravelType[TravelType["Bike"] = 6] = "Bike";
})(TravelType || (TravelType = {}));
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
var PlanningType;
(function (PlanningType) {
    PlanningType[PlanningType["Anytime"] = 0] = "Anytime";
    PlanningType[PlanningType["Weekend"] = 1] = "Weekend";
    PlanningType[PlanningType["Custom"] = 2] = "Custom";
})(PlanningType || (PlanningType = {}));
var QueryState;
(function (QueryState) {
    QueryState[QueryState["Saved"] = 0] = "Saved";
    QueryState[QueryState["Started"] = 1] = "Started";
    QueryState[QueryState["Finished"] = 2] = "Finished";
    QueryState[QueryState["Failed"] = 3] = "Failed";
})(QueryState || (QueryState = {}));
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
var ScoreLevel;
(function (ScoreLevel) {
    ScoreLevel[ScoreLevel["Excellent"] = 0] = "Excellent";
    ScoreLevel[ScoreLevel["Good"] = 1] = "Good";
    ScoreLevel[ScoreLevel["Standard"] = 2] = "Standard";
})(ScoreLevel || (ScoreLevel = {}));
var OS;
(function (OS) {
    OS[OS["A"] = 0] = "A";
    OS[OS["WP"] = 1] = "WP";
    OS[OS["IOS"] = 2] = "IOS";
    OS[OS["Other"] = 3] = "Other";
})(OS || (OS = {}));
var PageType;
(function (PageType) {
    PageType[PageType["HomePage"] = 0] = "HomePage";
    PageType[PageType["PinBoard"] = 1] = "PinBoard";
    PageType[PageType["TripList"] = 2] = "TripList";
    PageType[PageType["TwitterAuth"] = 3] = "TwitterAuth";
    PageType[PageType["Friends"] = 4] = "Friends";
})(PageType || (PageType = {}));
var FriendActionType;
(function (FriendActionType) {
    FriendActionType[FriendActionType["Confirm"] = 0] = "Confirm";
    FriendActionType[FriendActionType["Request"] = 1] = "Request";
    FriendActionType[FriendActionType["Unfriend"] = 2] = "Unfriend";
    FriendActionType[FriendActionType["Block"] = 3] = "Block";
    FriendActionType[FriendActionType["CancelRequest"] = 4] = "CancelRequest";
})(FriendActionType || (FriendActionType = {}));
var DealsPlaceReturnType;
(function (DealsPlaceReturnType) {
    DealsPlaceReturnType[DealsPlaceReturnType["CountryCode"] = 0] = "CountryCode";
    DealsPlaceReturnType[DealsPlaceReturnType["GID"] = 1] = "GID";
    DealsPlaceReturnType[DealsPlaceReturnType["AirCode"] = 2] = "AirCode";
})(DealsPlaceReturnType || (DealsPlaceReturnType = {}));
//# sourceMappingURL=globals.js.map