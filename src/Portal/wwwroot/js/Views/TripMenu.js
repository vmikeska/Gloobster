var Views;
(function (Views) {
    var TripMenu = (function () {
        function TripMenu() {
            this.$win = $("#menuItemContent");
            this.$container = this.$win.find(".cont");
            this.registerEvents();
            this.registerTemplates();
        }
        TripMenu.prototype.registerTemplates = function () {
            this.privacyTemplate = Views.ViewBase.currentView.registerTemplate("menuPrivacy-template");
            this.shareTemplate = Views.ViewBase.currentView.registerTemplate("menuShare-template");
            this.participantsTemplate = Views.ViewBase.currentView.registerTemplate("participants-template");
            this.participantTemplate = Views.ViewBase.currentView.registerTemplate("participant-template");
        };
        TripMenu.prototype.setCode = function (code) {
            var text = "";
            if (code) {
                text = "http://gloobster/" + code;
            }
            $("#sharingCode").val(text);
        };
        TripMenu.prototype.createPrivacyContent = function (trip) {
            var $html = $(this.privacyTemplate());
            $html.find("#friendsPublic").prop("checked", trip.friendsPublic);
            $html.find("#allowRequestJoin").prop("checked", trip.allowToRequestJoin);
            $html.find("#friendsPublic").change(function (e) {
                var state = $(e.target).prop("checked");
                var data = { propertyName: "FriendsPublic", values: { id: trip.tripId, state: state } };
                Views.ViewBase.currentView.apiPut("tripProperty", data, function () {
                    trip.friendsPublic = state;
                });
            });
            $html.find("#allowRequestJoin").change(function (e) {
                var state = $(e.target).prop("checked");
                var data = { propertyName: "AllowToRequestJoin", values: { id: trip.tripId, state: state } };
                Views.ViewBase.currentView.apiPut("tripProperty", data, function () {
                    trip.allowToRequestJoin = state;
                });
            });
            this.$container.html($html);
        };
        TripMenu.prototype.fillSocStr = function (str, $html) {
            $html.find("#share").find("span").html(str);
        };
        TripMenu.prototype.createShareContent = function () {
            var _this = this;
            var $html = $(this.shareTemplate());
            var shareButtons = new Common.ShareButtons($html.find("#shareCont"));
            shareButtons.onSelectionChanged = function (nets) {
                _this.fillSocStr(nets, $html);
            };
            this.fillSocStr(shareButtons.getStr(), $html);
            $html.find("#share").click(function () {
                var networks = shareButtons.getSelectedNetworks();
                var data = {
                    message: $("#message").val(),
                    tripId: Views.ViewBase.currentView["trip"].tripId,
                    networks: networks
                };
                _this.$container.hide();
                var v = Views.ViewBase.currentView;
                var id = new Common.InprogressDialog();
                id.create(v.t("SharingTrip", "jsTrip"));
                var hd = new Common.HintDialog();
                Views.ViewBase.currentView.apiPost("TripSocNetworks", data, function (r) {
                    id.remove();
                    var successful = (r === "");
                    if (successful) {
                        hd.create(v.t("TripShared", "jsTrip"));
                    }
                    else if (r === "HasUnnamed") {
                        hd.create(v.t("CannotShareUnnamed", "jsTrip"));
                    }
                });
            });
            this.$container.html($html);
        };
        TripMenu.prototype.createParticipantsContent = function (trip) {
            var _this = this;
            var $html = this.participantsTemplate();
            this.$container.html($html);
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
            $html.find(".delete").click(function (e) {
                var $btn = $(e.target);
                var id = $btn.data("id");
                var prms = [["tripId", trip.tripId], ["id", id]];
                Views.ViewBase.currentView.apiDelete("TripParticipants", prms, function (r) {
                    $table.find("#" + id).remove();
                    $table.find("#line_" + id).remove();
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
            $table.prepend($html);
        };
        TripMenu.prototype.getTextState = function (state) {
            var v = Views.ViewBase.currentView;
            if (state === ParticipantState.Invited) {
                return v.t("Invited", "jsTrip");
            }
            if (state === ParticipantState.Accepted) {
                return v.t("Accepted", "jsTrip");
            }
            if (state === ParticipantState.Maybe) {
                return v.t("Maybe", "jsTrip");
            }
            if (state === ParticipantState.Refused) {
                return v.t("Refused", "jsTrip");
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
        TripMenu.prototype.registerEvents = function () {
            var _this = this;
            var $btns = $(".menu-btn");
            $btns.click(function (e) {
                var $btn = $(e.target);
                $btns.not($btn).removeClass("active");
                var t = $btn.data("t");
                _this.displayContent(t);
            });
            this.$win.find(".close").click(function (e) {
                e.preventDefault();
                _this.$win.slideUp();
            });
        };
        TripMenu.prototype.displayContent = function (tmp) {
            this.$win.slideDown();
            var trip = Views.ViewBase.currentView["trip"];
            if (tmp === "menuPrivacy-template") {
                this.setDialogInfo("PrivacySettings", "PrivacyText");
                this.createPrivacyContent(trip);
            }
            if (tmp === "menuShare-template") {
                this.createShareContent();
            }
            if (tmp === "participants-template") {
                this.setDialogInfo("ParticipTitle", "ParticipText");
                this.createParticipantsContent(trip);
            }
        };
        TripMenu.prototype.setDialogInfo = function (title, txt) {
            var $cont = $("#menuItemContent");
            var v = Views.ViewBase.currentView;
            var titleTxt = v.t(title, "jsTrip");
            var txtTxt = v.t(txt, "jsTrip");
            $cont.find(".title").html(titleTxt);
            $cont.find(".txt").html(txtTxt);
        };
        return TripMenu;
    }());
    Views.TripMenu = TripMenu;
})(Views || (Views = {}));
//# sourceMappingURL=TripMenu.js.map