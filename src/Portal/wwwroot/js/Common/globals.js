var Constants;
(function (Constants) {
    Constants.cookieName = "loginCookie";
    Constants.firstRedirectUrl = "/PinBoard/Pins";
    Constants.networkTypes = "NetworkTypes";
})(Constants || (Constants = {}));
var SourceType;
(function (SourceType) {
    SourceType[SourceType["FB"] = 0] = "FB";
    SourceType[SourceType["S4"] = 1] = "S4";
    SourceType[SourceType["City"] = 2] = "City";
    SourceType[SourceType["Country"] = 3] = "Country";
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
var UserActionType;
(function (UserActionType) {
    UserActionType[UserActionType["Login"] = 0] = "Login";
    UserActionType[UserActionType["Register"] = 1] = "Register";
})(UserActionType || (UserActionType = {}));
//# sourceMappingURL=Globals.js.map