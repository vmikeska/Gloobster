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
        CheckinReactionState[CheckinReactionState["Met"] = 8] = "Met";
    })(Views.CheckinReactionState || (Views.CheckinReactionState = {}));
    var CheckinReactionState = Views.CheckinReactionState;
    var Chat = (function () {
        function Chat() {
            var _this = this;
            this.names = [];
            this.chatRowTmp = Views.ViewBase.currentView.registerTemplate("chatRow-template");
            this.chatWinTmp = Views.ViewBase.currentView.registerTemplate("chatWin-template");
            this.stopWinTmp = Views.ViewBase.currentView.registerTemplate("stopWin-template");
            this.chatRefresh = new Views.ChatRefresh();
            this.chatRefresh.onRefresh = function (responses) {
                if (responses) {
                    responses.forEach(function (resp) {
                        _this.appPosts(resp.posts, resp.reactId);
                    });
                }
            };
            this.dlg = new Common.ConfirmDialog();
        }
        Chat.prototype.refreshAll = function (callback) {
            var _this = this;
            if (callback === void 0) { callback = null; }
            var prms = [["type", "s"]];
            var $cont = $("body");
            Views.ViewBase.currentView.apiGet("CheckinReact", prms, function (reacts) {
                var chats = $(".chat-cont").toArray();
                chats.forEach(function (chat) {
                    var $chat = $(chat);
                    var reactId = $chat.data("id");
                    var reactFound = _.find(reacts, function (r) {
                        return r.reactId === reactId;
                    });
                    var wasFound = reactFound != null;
                    if (!wasFound) {
                        $chat.remove();
                    }
                });
                reacts.forEach(function (r, i) {
                    var $chat = Chat.getChatByRectId(r.reactId);
                    var cnt = $(".chat-cont").length;
                    if ($chat.length === 0) {
                        _this.createOneChatWindow($cont, r, cnt);
                    }
                });
                if (!_this.chatRefresh.isStarted) {
                    _this.chatRefresh.startRefresh();
                }
                if (callback) {
                    callback();
                }
            });
        };
        Chat.prototype.createOneChatWindow = function ($cont, react, count) {
            var $c = this.createOneChat(react);
            var left = (count * (250 + 15));
            $c.css("left", left + "px");
            $cont.append($c);
            this.appPosts(react.chatPosts, react.reactId);
            if (react.chatPosts.length > 0) {
                var last = _.last(react.chatPosts);
                Chat.getChatByRectId(react.reactId).data("last", last.time);
            }
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
            var _this = this;
            if (act === "stop") {
                this.createStopScreen(reactId);
            }
            if (act === "met") {
                this.dlg.create("Already met", "Have you really already met ?", "Cancel", "We have met", function () {
                    _this.changeRectState(reactId, CheckinReactionState.Met);
                });
            }
            if (act === "didNotMeet") {
                this.dlg.create("Didn't meet", "We didn't meet", "Cancel", "We didn't meet", function () {
                    _this.changeRectState(reactId, CheckinReactionState.NotMet);
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
                _this.dlg.create("Stop conversation", "Do you really want to stop the conversation ?", "Cancel", "Stop", function () {
                    _this.changeRectState(reactId, CheckinReactionState.Refused);
                });
            });
            $cont.find(".block").click(function (e) {
                e.preventDefault();
                _this.dlg.create("User blocking", "Do you really want to block this user ?", "Cancel", "Block", function () {
                    _this.changeRectState(reactId, CheckinReactionState.Blocked);
                });
            });
            $cont.find(".blockReport").click(function (e) {
                e.preventDefault();
                _this.dlg.create("User blocking and reporting", "Do you really want to report this user ?", "Cancel", "Report", function () {
                    _this.changeRectState(reactId, CheckinReactionState.Blocked);
                });
            });
        };
        Chat.prototype.changeRectState = function (reactId, state, extraVals) {
            if (extraVals === void 0) { extraVals = null; }
            var prms = { id: reactId, state: state };
            if (extraVals) {
                prms = $.extend(prms, extraVals);
            }
            Views.ViewBase.currentView.apiPut("CheckinReact", prms, function () {
                var $cont = Chat.getChatByRectId(reactId);
                $cont.remove();
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