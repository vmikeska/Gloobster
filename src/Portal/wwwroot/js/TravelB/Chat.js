var Views;
(function (Views) {
    (function (CheckinReactionState) {
        CheckinReactionState[CheckinReactionState["Created"] = 0] = "Created";
        CheckinReactionState[CheckinReactionState["Refused"] = 1] = "Refused";
        CheckinReactionState[CheckinReactionState["Accepted"] = 2] = "Accepted";
        CheckinReactionState[CheckinReactionState["Finished"] = 3] = "Finished";
    })(Views.CheckinReactionState || (Views.CheckinReactionState = {}));
    var CheckinReactionState = Views.CheckinReactionState;
    var Chat = (function () {
        function Chat() {
            this.names = [];
            this.loadedIds = [];
            this.refreshCycleFinished = true;
            this.lastRefreshDate = null;
            this.chatRowTmp = Views.ViewBase.currentView.registerTemplate("chatRow-template");
            this.chatWinTmp = Views.ViewBase.currentView.registerTemplate("chatWin-template");
        }
        Chat.prototype.startRefresh = function () {
            var _this = this;
            var i = setInterval(function () {
                if (!_this.refreshCycleFinished) {
                    return;
                }
                else {
                    _this.refreshCycleFinished = false;
                }
                if (_this.loadedIds.length === 0) {
                    clearInterval(i);
                }
                var prms = [];
                var lastDate = null;
                _this.loadedIds.forEach(function (rid) {
                    prms.push(["reactIds", rid]);
                    var ld = _this.getChatByRectId(rid).data("last");
                    if (lastDate === null) {
                        lastDate = ld;
                    }
                    else if (ld > lastDate) {
                        lastDate = ld;
                    }
                });
                if (lastDate) {
                    prms.push(["lastDate", lastDate.toString()]);
                }
                Views.ViewBase.currentView.apiGet("ReactChat", prms, function (responses) {
                    if (responses) {
                        responses.forEach(function (resp) {
                            _this.appPosts(resp.posts, resp.reactId);
                        });
                    }
                    _this.refreshCycleFinished = true;
                });
            }, 5000);
        };
        Chat.prototype.createAll = function () {
            var _this = this;
            var prms = [["state", CheckinReactionState.Accepted.toString()]];
            var $cont = this.getMainCont();
            Views.ViewBase.currentView.apiGet("CheckinReact", prms, function (reacts) {
                reacts.forEach(function (r) {
                    _this.loadedIds.push(r.reactId);
                    var $c = _this.createOneChat(r);
                    $cont.append($c);
                    _this.appPosts(r.chatPosts, r.reactId);
                    if (r.chatPosts.length > 0) {
                        var last = _.last(r.chatPosts);
                        _this.getChatByRectId(r.reactId).data("last", last.time);
                    }
                });
                _this.startRefresh();
            });
        };
        Chat.prototype.addNames = function (r) {
            this.addName(r.askingUserId, r.askingUserName);
            this.addName(r.targetUserId, r.targetUserName);
        };
        Chat.prototype.addName = function (id, name) {
            var f = this.genNameById(id);
            if (!f) {
                this.names.push({ id: id, name: name });
            }
        };
        Chat.prototype.genNameById = function (id) {
            var f = _.find(this.names, function (n) {
                return n.id === id;
            });
            if (!f) {
                return null;
            }
            return f.name;
        };
        Chat.prototype.getMainCont = function () {
            var $c = $(".chats");
            if ($c.length === 0) {
                $c = $("<div class=\"chats\"></div>");
                $("body").append($c);
            }
            return $c;
        };
        Chat.prototype.createOneChat = function (react) {
            var _this = this;
            this.addNames(react);
            var name = react.askingUserName;
            if (react.askingUserId === Views.ViewBase.currentUserId) {
                name = react.targetUserName;
            }
            var context = {
                reactId: react.reactId,
                name: name
            };
            var $c = $(this.chatWinTmp(context));
            $c.find(".send").click(function (e) {
                e.preventDefault();
                var txt = $c.find("textarea").val();
                _this.sendMessage(txt, react.reactId);
            });
            return $c;
        };
        Chat.prototype.getChatByRectId = function (reactId) {
            return $("#chat_" + reactId);
        };
        Chat.prototype.sendMessage = function (txt, reactId) {
            var _this = this;
            var data = {
                reactId: reactId,
                text: txt,
                lastDate: this.getChatByRectId(reactId).data("last")
            };
            Views.ViewBase.currentView.apiPost("ReactChat", data, function (newPosts) {
                _this.appPosts(newPosts, reactId);
                var chatWin = _this.getChatByRectId(reactId);
                chatWin.find("textarea").val("");
            });
        };
        Chat.prototype.appPosts = function (posts, reactId) {
            var _this = this;
            var chatWin = this.getChatByRectId(reactId);
            var $cont = chatWin.find(".chat-texts");
            var order = _.sortBy(posts, function (p) { return p.time; });
            order.forEach(function (p) {
                var name = _this.genNameById(p.userId);
                var $p = _this.genPost(p.userId, name, p.text);
                $cont.append($p);
            });
            if (order.length > 0) {
                var last = _.last(order);
                console.log("updating last.time: " + last.time);
                chatWin.data("last", last.time);
                setTimeout(function () {
                    var sh = $cont[0].scrollHeight;
                    $cont[0].scrollTop = sh;
                }, 100);
            }
        };
        Chat.prototype.genPost = function (userId, name, text) {
            var context = {
                userId: userId,
                name: name,
                text: text
            };
            var $c = $(this.chatRowTmp(context));
            return $c;
        };
        return Chat;
    }());
    Views.Chat = Chat;
    var CheckinReacts = (function () {
        function CheckinReacts() {
        }
        CheckinReacts.prototype.refreshReacts = function () {
            var _this = this;
            var prms = [["state", CheckinReactionState.Created.toString()]];
            Views.ViewBase.currentView.apiGet("CheckinReact", prms, function (reacts) {
                _this.genRactNotifs(reacts);
            });
        };
        CheckinReacts.prototype.genRactNotifs = function (reacts) {
            var _this = this;
            reacts.forEach(function (r) {
                var data = {
                    uid: r.targetUserId,
                    name: r.targetUserName,
                    id: r.checkinId
                };
                var $h = _this.createReactNotif(data);
                $("#notifCont").append($h);
            });
        };
        CheckinReacts.prototype.createReactNotif = function (data) {
            var _this = this;
            var $content = $("<a data-uid=\"" + data.uid + "\" href=\"#\">" + data.name + "</a> \n\t\t\t\t\t\t\t <br/>\n\t\t\t\t\t\t\t Want's to start chat with you");
            var actions = [
                {
                    name: "Start",
                    callback: function () {
                        _this.changeNotifState(data.id, CheckinReactionState.Accepted, function (r) {
                            $content.closest(".notif").remove();
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
                _this.changeNotifState(data.id, CheckinReactionState.Refused, function (r) {
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
//# sourceMappingURL=Chat.js.map