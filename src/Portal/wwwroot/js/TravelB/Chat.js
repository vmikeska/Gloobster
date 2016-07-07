var Views;
(function (Views) {
    (function (CheckinReactionState) {
        CheckinReactionState[CheckinReactionState["Created"] = 0] = "Created";
        CheckinReactionState[CheckinReactionState["Refused"] = 1] = "Refused";
        CheckinReactionState[CheckinReactionState["Accepted"] = 2] = "Accepted";
        CheckinReactionState[CheckinReactionState["Finished"] = 3] = "Finished";
        CheckinReactionState[CheckinReactionState["Rated"] = 4] = "Rated";
        CheckinReactionState[CheckinReactionState["NotMet"] = 5] = "NotMet";
        CheckinReactionState[CheckinReactionState["Blocked"] = 6] = "Blocked";
        CheckinReactionState[CheckinReactionState["Reported"] = 7] = "Reported";
    })(Views.CheckinReactionState || (Views.CheckinReactionState = {}));
    var CheckinReactionState = Views.CheckinReactionState;
    var ChatRefresh = (function () {
        function ChatRefresh() {
            this.refreshCycleFinished = true;
            this.lastRefreshDate = null;
        }
        ChatRefresh.prototype.startRefresh = function () {
            var _this = this;
            var i = setInterval(function () {
                if (!_this.refreshCycleFinished) {
                    return;
                }
                else {
                    _this.refreshCycleFinished = false;
                }
                var chatWins = $(".chat-cont").toArray();
                if (chatWins.length === 0) {
                    clearInterval(i);
                }
                var loadedIds = _.map(chatWins, function (w) { return $(w).data("id"); });
                var prms = [];
                var lastDate = null;
                loadedIds.forEach(function (rid) {
                    prms.push(["reactIds", rid]);
                    var ld = Chat.getChatByRectId(rid).data("last");
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
                    _this.onRefresh(responses);
                    _this.refreshCycleFinished = true;
                });
            }, 5000);
        };
        return ChatRefresh;
    }());
    Views.ChatRefresh = ChatRefresh;
    var Chat = (function () {
        function Chat() {
            var _this = this;
            this.names = [];
            this.chatRowTmp = Views.ViewBase.currentView.registerTemplate("chatRow-template");
            this.chatWinTmp = Views.ViewBase.currentView.registerTemplate("chatWin-template");
            this.stopWinTmp = Views.ViewBase.currentView.registerTemplate("stopWin-template");
            this.metWin = Views.ViewBase.currentView.registerTemplate("metWin-template");
            this.chatRefresh = new ChatRefresh();
            this.chatRefresh.onRefresh = function (responses) {
                if (responses) {
                    responses.forEach(function (resp) {
                        _this.appPosts(resp.posts, resp.reactId);
                    });
                }
            };
        }
        Chat.prototype.createAll = function () {
            var _this = this;
            var prms = [["state", CheckinReactionState.Accepted.toString()]];
            var $cont = $("body");
            Views.ViewBase.currentView.apiGet("CheckinReact", prms, function (reacts) {
                reacts.forEach(function (r, i) {
                    var $c = _this.createOneChat(r);
                    var left = (i * (250 + 15));
                    $c.css("left", left + "px");
                    $cont.append($c);
                    _this.appPosts(r.chatPosts, r.reactId);
                    if (r.chatPosts.length > 0) {
                        var last = _.last(r.chatPosts);
                        Chat.getChatByRectId(r.reactId).data("last", last.time);
                    }
                });
                _this.chatRefresh.startRefresh();
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
        Chat.prototype.createOneChat = function (react) {
            var _this = this;
            this.addNames(react);
            var isTarget = (react.targetUserId === Views.ViewBase.currentUserId);
            var name = isTarget ? react.askingUserName : react.targetUserName;
            var context = {
                reactId: react.reactId,
                name: name
            };
            var $c = $(this.chatWinTmp(context));
            var $combo = $c.find(".actions");
            Common.DropDown.registerDropDown($combo);
            if (isTarget) {
                this.targetActions($combo);
            }
            else {
                this.requestorActions($combo);
            }
            $combo.find("a").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var act = $target.data("act");
                _this.exeAct(react.reactId, act);
            });
            $c.find(".send").click(function (e) {
                e.preventDefault();
                var txt = $c.find("textarea").val();
                _this.sendMessage(txt, react.reactId);
            });
            return $c;
        };
        Chat.prototype.exeAct = function (reactId, act) {
            if (act === "stop") {
                this.createStopScreen(reactId);
            }
            if (act === "met") {
                this.createMetScreen(reactId);
            }
            if (act === "didNotMeet") {
                var prms = { id: reactId, state: CheckinReactionState.NotMet };
                Views.ViewBase.currentView.apiPut("CheckinReact", prms, function () {
                    var $cont = Chat.getChatByRectId(reactId);
                    $cont.remove();
                });
            }
        };
        Chat.prototype.createStopScreen = function (reactId) {
            var _this = this;
            var $cont = Chat.getChatByRectId(reactId);
            var $c = $(this.stopWinTmp());
            $cont.html($c);
            $cont.find(".notInt").click(function (e) {
                e.preventDefault();
                var dlg = new Common.ConfirmDialog();
                dlg.create("Stop conversation", "Do you really want to stop the conversation ?", "Cancel", "Stop", function () {
                    var prms = { id: reactId, state: CheckinReactionState.Refused, message: "" };
                    Views.ViewBase.currentView.apiPut("CheckinReact", prms, function () {
                        var $cont = Chat.getChatByRectId(reactId);
                        $cont.remove();
                    });
                });
            });
            $cont.find(".block").click(function (e) {
                e.preventDefault();
                _this.block(reactId, CheckinReactionState.Blocked);
            });
            $cont.find(".blockReport").click(function (e) {
                e.preventDefault();
                _this.block(reactId, CheckinReactionState.Reported);
            });
        };
        Chat.prototype.block = function (reactId, state) {
            var dlg = new Common.ConfirmDialog();
            dlg.create("User blocking", "Do you really want to block this user ?", "Cancel", "Block", function () {
                var prms = { id: reactId, state: state, message: "" };
                Views.ViewBase.currentView.apiPut("CheckinReact", prms, function () {
                    var $cont = Chat.getChatByRectId(reactId);
                    $cont.remove();
                });
            });
        };
        Chat.prototype.createMetScreen = function (reactId) {
            var $cont = Chat.getChatByRectId(reactId);
            var context = {
                rid: reactId
            };
            var $c = $(this.metWin(context));
            $cont.html($c);
            $cont.find(".showComm").change(function (e) {
                $cont.find(".comment").toggle();
            });
        };
        Chat.prototype.targetActions = function ($combo) {
            $combo.find("ul").append(this.actMenuItem("Stop conversation", "stop"));
            $combo.find("ul").append(this.actMenuItem("We've already met", "met"));
            $combo.find("ul").append(this.actMenuItem("We didn't meet", "didNotMeet"));
        };
        Chat.prototype.requestorActions = function ($combo) {
            $combo.find("ul").append(this.actMenuItem("Stop conversation", "stop"));
            $combo.find("ul").append(this.actMenuItem("We didn't meet", "didNotMeet"));
        };
        Chat.prototype.actMenuItem = function (name, action) {
            return $("<li><a data-act=\"" + action + "\" href=\"#\">" + name + "</a></li>");
        };
        Chat.getChatByRectId = function (reactId) {
            return $("#chat_" + reactId);
        };
        Chat.prototype.sendMessage = function (txt, reactId) {
            var _this = this;
            var data = {
                reactId: reactId,
                text: txt,
                lastDate: Chat.getChatByRectId(reactId).data("last")
            };
            Views.ViewBase.currentView.apiPost("ReactChat", data, function (newPosts) {
                _this.appPosts(newPosts, reactId);
                var chatWin = Chat.getChatByRectId(reactId);
                chatWin.find("textarea").val("");
            });
        };
        Chat.prototype.appPosts = function (posts, reactId) {
            var _this = this;
            var chatWin = Chat.getChatByRectId(reactId);
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
})(Views || (Views = {}));
//# sourceMappingURL=Chat.js.map