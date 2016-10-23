var TravelB;
(function (TravelB) {
    var CheckinReacts = (function () {
        function CheckinReacts(view) {
            this.chatRequestBodyTmp = Views.ViewBase.currentView.registerTemplate("chat-request-body-template");
            this.notifBaseTmp = Views.ViewBase.currentView.registerTemplate("notif-base-template");
            this.v = view;
        }
        CheckinReacts.prototype.refreshReacts = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            var prms = [["type", "a"]];
            this.v.apiGet("CheckinReact", prms, function (reacts) {
                _this.genRactNotifs(reacts);
                if (callback) {
                    callback();
                }
            });
        };
        CheckinReacts.prototype.genRactNotifs = function (reacts) {
            var _this = this;
            $("#notifCont").html("");
            reacts.forEach(function (r) {
                var data = {
                    uid: r.targetUserId,
                    name: r.targetUserName,
                    id: r.reactId
                };
                var $h = _this.createReactNotif(data);
                $("#notifCont").append($h);
            });
        };
        CheckinReacts.prototype.createReactNotif = function (data) {
            var _this = this;
            var context = {
                uid: data.uid,
                name: data.name
            };
            var $content = $(this.chatRequestBodyTmp(context));
            var startAction = {
                name: this.v.t("AcceptBtn", "jsTravelB"),
                icon: "icon-user-check",
                callback: function () {
                    _this.changeNotifState(data.id, TravelB.CheckinReactionState.Accepted, function (r) {
                        if (_this.onStartChat) {
                            _this.onStartChat(function () {
                                $content.closest(".notif").remove();
                            });
                        }
                    });
                }
            };
            var actions = [startAction];
            var $n = this.createNotifBase($content, data, actions);
            return $n;
        };
        CheckinReacts.prototype.createNotifBase = function ($content, data, actions) {
            var _this = this;
            var context = {
                id: data.id
            };
            var $base = $(this.notifBaseTmp(context));
            var letBeAction = {
                name: this.v.t("LetBeBtn", "jsTravelB"),
                icon: "icon-cross",
                callback: function () {
                    _this.changeNotifState(data.id, TravelB.CheckinReactionState.Refused, function (r) {
                        $base.remove();
                    });
                }
            };
            actions.push(letBeAction);
            $base.find(".cont").html($content);
            var $acts = $base.find(".acts");
            actions.forEach(function (a) {
                var $act = _this.genAction(a.name, a.icon, a.callback);
                $acts.append($act);
            });
            return $base;
        };
        CheckinReacts.prototype.changeNotifState = function (id, state, callback) {
            var data = { id: id, state: state };
            Views.ViewBase.currentView.apiPut("CheckinReact", data, function (r) {
                callback(r);
            });
        };
        CheckinReacts.prototype.genAction = function (name, icon, callback) {
            var $btn = $("<a href=\"#\" class=\"act-btn " + icon + "\"><span class=\"lato\"> " + name + "</span></a><br/>");
            $btn.click(function (e) {
                e.preventDefault();
                callback();
            });
            return $btn;
        };
        return CheckinReacts;
    }());
    TravelB.CheckinReacts = CheckinReacts;
})(TravelB || (TravelB = {}));
//# sourceMappingURL=CheckinReacts.js.map