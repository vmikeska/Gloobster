var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var TripMenu = (function () {
        function TripMenu() {
            this.registerEvents();
            this.registerTemplates();
            this.container = $(".menuItemContent");
        }
        TripMenu.prototype.registerTemplates = function () {
            this.privacyTemplate = Views.ViewBase.currentView.registerTemplate("menuPrivacy-template");
            this.shareTemplate = Views.ViewBase.currentView.registerTemplate("menuShare-template");
            this.participantsTemplate = Views.ViewBase.currentView.registerTemplate("participants-template");
            this.participantTemplate = Views.ViewBase.currentView.registerTemplate("participant-template");
        };
        TripMenu.prototype.registerEvents = function () {
            var _this = this;
            var btns = $(".tripMenuButton");
            btns.click(function (e) {
                var $btn = $(e.target);
                var tmp = $btn.data("tmp");
                _this.displayContent(tmp);
            });
        };
        TripMenu.prototype.setCode = function (code) {
            var text = "";
            if (code) {
                text = "http://gloobster/" + code;
            }
            $("#sharingCode").val(text);
        };
        TripMenu.prototype.createPrivacyContent = function (trip) {
            var _this = this;
            var $html = $(this.privacyTemplate());
            $html.find("#justForInvited").prop("checked", trip.justForInvited);
            $html.find("#allowRequestJoin").prop("checked", trip.allowToRequestJoin);
            if (trip.sharingCode) {
                $html.find("#shareByCode").prop("checked", trip.sharingCode != null);
                this.setCode(trip.sharingCode);
            }
            $html.find("#justForInvited").change(function (e) {
                var state = $(e.target).prop("checked");
                var data = { propertyName: "JustForInvited", values: { id: trip.tripId, state: state } };
                Views.ViewBase.currentView.apiPut("tripProperty", data, function () {
                    trip.justForInvited = state;
                });
            });
            $html.find("#allowRequestJoin").change(function (e) {
                var state = $(e.target).prop("checked");
                var data = { propertyName: "AllowToRequestJoin", values: { id: trip.tripId, state: state } };
                Views.ViewBase.currentView.apiPut("tripProperty", data, function () {
                    trip.allowToRequestJoin = state;
                });
            });
            $html.find("#shareByCode").change(function (e) {
                var state = $(e.target).prop("checked");
                var data = { propertyName: "ShareByCode", values: { id: trip.tripId, state: state } };
                Views.ViewBase.currentView.apiPut("tripProperty", data, function (code) {
                    _this.setCode(code);
                    trip.sharingCode = code;
                });
            });
            this.container.html($html);
        };
        TripMenu.prototype.createShareContent = function () {
            var _this = this;
            var $html = $(this.shareTemplate());
            var shareButtons = new Common.ShareButtons($html.find("#shareCont"), "Share on social media");
            $html.find("#share").click(function () {
                var networks = shareButtons.getSelectedNetworks();
                var data = {
                    message: $("#message").val(),
                    tripId: Views.ViewBase.currentView["trip"].tripId,
                    networks: networks
                };
                Views.ViewBase.currentView.apiPost("TripSocNetworks", data, function (r) {
                    _this.container.hide();
                });
            });
            this.container.html($html);
        };
        TripMenu.prototype.createParticipantsContent = function (trip) {
            var _this = this;
            var $html = this.participantsTemplate();
            this.container.html($html);
            trip.participants.forEach(function (p) {
                _this.generateOneParticipant(p.name, p.userId, p.isAdmin, p.state);
            });
            var config = new Common.UserSearchConfig();
            config.elementId = "friends";
            config.clearAfterSearch = true;
            config.endpoint = "FriendsSearch";
            this.userSearchBox = new Common.UserSearchBox(config);
            this.userSearchBox.onUserSelected = function (user) {
                _this.addUser(trip, user);
            };
        };
        TripMenu.prototype.isAreadyAdded = function (trip, userId) {
            var foundParticiapnt = _.find(trip.participants, function (p) { return p.id === userId; });
            return foundParticiapnt != null;
        };
        TripMenu.prototype.addUser = function (trip, user) {
            var _this = this;
            var userId = user.friendId;
            var isAdded = this.isAreadyAdded(trip, userId);
            if (isAdded) {
                return;
            }
            var data = {
                caption: $("#caption").val(),
                tripId: trip.tripId,
                users: [userId]
            };
            Views.ViewBase.currentView.apiPost("TripParticipants", data, function (r) {
                _this.addOneParticipant(user.displayName, userId);
            });
        };
        TripMenu.prototype.generateOneParticipant = function (name, id, isAdmin, state) {
            var trip = Views.ViewBase.currentView["trip"];
            var context = {
                name: name,
                id: id,
                checked: (isAdmin ? "checked" : ""),
                state: this.getTextState(state)
            };
            var $table = $("#participantsTable");
            var $html = $(this.participantTemplate(context));
            $html.find(".del").click(function (e) {
                var $btn = $(e.target);
                var id = $btn.data("id");
                var prms = [["tripId", trip.tripId], ["id", id]];
                Views.ViewBase.currentView.apiDelete("TripParticipants", prms, function (r) {
                    $table.find("#" + id).remove();
                    trip.participants = _.reject(trip.participants, function (p) { return p.userId === id; });
                });
            });
            $html.find(".isAdmin").click(function (e) {
                var $chck = $(e.target);
                var id = $chck.data("id");
                var isAdmin = $chck.prop("checked");
                var prms = {
                    tripId: trip.tripId,
                    id: id,
                    isAdmin: isAdmin
                };
                Views.ViewBase.currentView.apiPut("TripParticipantsIsAdmin", prms, function (r) {
                    var par = _.find(trip.participants, function (p) { return p.userId === id; });
                    par.isAdmin = isAdmin;
                });
            });
            $table.append($html);
        };
        TripMenu.prototype.getTextState = function (state) {
            if (state === ParticipantState.Invited) {
                return "Invited";
            }
            if (state === ParticipantState.Accepted) {
                return "Accepted";
            }
            if (state === ParticipantState.Maybe) {
                return "Maybe";
            }
            if (state === ParticipantState.Refused) {
                return "Refused";
            }
        };
        TripMenu.prototype.addOneParticipant = function (name, id) {
            this.generateOneParticipant(name, id, false, 0);
            var trip = Views.ViewBase.currentView["trip"];
            var part = {
                isAdmin: false,
                name: name,
                state: 0,
                userId: id
            };
            trip.participants.push(part);
        };
        TripMenu.prototype.displayContent = function (tmp) {
            this.container.toggle();
            var trip = Views.ViewBase.currentView["trip"];
            if (tmp === "menuPrivacy-template") {
                this.createPrivacyContent(trip);
            }
            if (tmp === "menuShare-template") {
                this.createShareContent();
            }
            if (tmp === "participants-template") {
                this.createParticipantsContent(trip);
            }
        };
        return TripMenu;
    })();
    Views.TripMenu = TripMenu;
    var TripViewView = (function (_super) {
        __extends(TripViewView, _super);
        function TripViewView() {
            _super.apply(this, arguments);
        }
        TripViewView.prototype.initialize = function (id) {
            var self = this;
            this.inviteDialogView = new Views.InviteDialogView();
            var filesConfig = new Trip.FilesConfig();
            filesConfig.containerId = "filesContainer";
            filesConfig.inputId = "fileInput";
            filesConfig.editable = false;
            filesConfig.addAdder = true;
            filesConfig.templateId = "file-template";
            this.files = new Trip.Files(filesConfig);
            this.getTrip(id);
            $("#commentSubmit").click(function () {
                self.comments.postComment(self.trip.tripId);
            });
            this.tripMenu = new TripMenu();
        };
        TripViewView.prototype.getTrip = function (id) {
            var _this = this;
            var prms = [["id", id]];
            _super.prototype.apiGet.call(this, "trip", prms, function (request) { return _this.onTripLoaded(request); });
        };
        TripViewView.prototype.setFilesCustomConfig = function (tripId) {
            var customData = new Common.TripFileCustom();
            customData.tripId = tripId;
            this.files.fileUpload.customConfig = customData;
        };
        TripViewView.prototype.initAcceptCombo = function () {
            var isOwner = this.trip.ownerId === Reg.LoginManager.currentUserId;
            if (!isOwner) {
                var thisParticipant = _.find(this.trip.participants, function (p) { return p.userId === Reg.LoginManager.currentUserId; });
                var acConfig = {
                    comboId: "invitationState",
                    initialState: thisParticipant.state,
                    tripId: this.trip.tripId
                };
                this.acceptCombo = new Trip.AcceptCombo(acConfig);
                $("#invitationState").show();
            }
        };
        TripViewView.prototype.onTripLoaded = function (request) {
            this.trip = request;
            this.initAcceptCombo();
            this.files.setFiles(this.trip.files, this.trip.tripId, this.trip.filesPublic);
            this.comments = new Trip.Comments();
            this.comments.comments = this.trip.comments;
            this.comments.users = this.trip.users;
            this.comments.displayComments();
            this.planner = new Trip.Planner(this.trip, false);
        };
        TripViewView.prototype.generateButtons = function () {
        };
        return TripViewView;
    })(Views.ViewBase);
    Views.TripViewView = TripViewView;
})(Views || (Views = {}));
//# sourceMappingURL=TripViewView.js.map