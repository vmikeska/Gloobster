var Views;
(function (Views) {
    var CheckinReacts = (function () {
        function CheckinReacts() {
        }
        CheckinReacts.prototype.refreshReacts = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            var prms = [["type", "a"]];
            Views.ViewBase.currentView.apiGet("CheckinReact", prms, function (reacts) {
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
            var $content = $("<a data-uid=\"" + data.uid + "\" href=\"#\">" + data.name + "</a><br/>Want's to start chat with you");
            var actions = [
                {
                    name: "Start",
                    callback: function () {
                        _this.changeNotifState(data.id, Views.CheckinReactionState.Accepted, function (r) {
                            if (_this.onStartChat) {
                                _this.onStartChat(function () {
                                    $content.closest(".notif").remove();
                                });
                            }
                        });
                    }
                }
            ];
            var $n = this.createNotifBase($content, data, actions);
            return $n;
        };
        CheckinReacts.prototype.createNotifBase = function (content, data, actions) {
            var _this = this;
            var $base = $("<div id=\"notif_" + data.id + "\" data-id=\"" + data.id + "\" class=\"notif\"><div class=\"acts\"></div></div>");
            $base.append(content);
            var $acts = $base.find(".acts");
            var hideTxt = "Let be";
            var $hideAct = this.genAction(hideTxt, function () {
                _this.changeNotifState(data.id, Views.CheckinReactionState.Refused, function (r) {
                    $hideAct.closest(".notif").remove();
                });
            });
            $acts.append($hideAct);
            actions.forEach(function (a) {
                var $act = _this.genAction(a.name, a.callback);
                $acts.prepend($act);
            });
            return $base;
        };
        CheckinReacts.prototype.changeNotifState = function (id, state, callback) {
            var data = { id: id, state: state };
            Views.ViewBase.currentView.apiPut("CheckinReact", data, function (r) {
                callback(r);
            });
        };
        CheckinReacts.prototype.genAction = function (name, callback) {
            var $btn = $("<button>" + name + "</button>");
            $btn.click(function (e) {
                e.preventDefault();
                callback();
            });
            return $btn;
        };
        return CheckinReacts;
    }());
    Views.CheckinReacts = CheckinReacts;
})(Views || (Views = {}));
//# sourceMappingURL=CheckinReacts.js.map