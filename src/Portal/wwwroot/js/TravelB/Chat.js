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
            this.chatLayoutTmp = Views.ViewBase.currentView.registerTemplate("chat-layout-template");
            this.chatTitleTagTmp = Views.ViewBase.currentView.registerTemplate("chat-person-title-template");
            this.chatMsgLeftTmp = Views.ViewBase.currentView.registerTemplate("chat-msg-l-template");
            this.chatMsgRightTmp = Views.ViewBase.currentView.registerTemplate("chat-msg-r-template");
            this.chatActionTmp = Views.ViewBase.currentView.registerTemplate("chat-action-template");
            this.stopWinTmp = Views.ViewBase.currentView.registerTemplate("stopWin-template");
            this.names = [];
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
            Views.ViewBase.currentView.apiGet("CheckinReact", prms, function (reacts) {
                var anyReacts = reacts.length > 0;
                var $layout = $(".nchat-all");
                var hasLayout = $layout.length > 0;
                if (anyReacts) {
                    if (!hasLayout) {
                        _this.createLayout(reacts);
                    }
                    _this.addNewPersons(reacts, hasLayout);
                    _this.removeOldPersons(reacts);
                    if (!_this.chatRefresh.isStarted) {
                        _this.chatRefresh.startRefresh();
                    }
                }
                else {
                    _this.destroyLayout();
                }
                if (callback) {
                    callback();
                }
            });
        };
        Chat.getUserTitleNameTag = function (rid) {
            var $i = $(".nchat-all .people .person[data-rid=\"" + rid + "\"]");
            if ($i.length > 0) {
                return $i;
            }
            return null;
        };
        Chat.prototype.appPosts = function (posts, reactId) {
            var _this = this;
            if (posts.length > 0) {
                var a = "t";
            }
            var $titleTag = Chat.getUserTitleNameTag(reactId);
            var $msgStorage = $titleTag.find(".msg-storage");
            var $txtCont = $(".nchat-all .messages");
            var oldPosts = $msgStorage.find(".message").toArray();
            var firstMsgUserId = oldPosts.length > 0 ? $(oldPosts[0]).data("uid") : null;
            var actRid = this.getActivePerson().data("rid");
            var ordered = _.sortBy(posts, function (p) { return p.time; });
            ordered.forEach(function (p) {
                var name = _this.genNameById(p.userId);
                if (!firstMsgUserId) {
                    firstMsgUserId = p.userId;
                }
                var leftTmp = firstMsgUserId === p.userId;
                var post = _this.genPost(leftTmp, p.userId, name, p.text, p.time);
                if (actRid === reactId) {
                    $txtCont.append(post);
                }
                $msgStorage.append(post);
            });
            if (ordered.length > 0) {
                var last = _.last(ordered);
                $titleTag.data("last", last.time);
                this.scrollToEnd();
            }
        };
        Chat.prototype.scrollToEnd = function () {
            setTimeout(function () {
                var $txtCont = $(".nchat-all .messages");
                var sh = $txtCont[0].scrollHeight;
                $txtCont[0].scrollTop = sh;
            }, 10);
        };
        Chat.prototype.genPost = function (leftTmp, userId, name, text, time) {
            var context = {
                userId: userId,
                name: name,
                text: text,
                time: moment(time).format("LT")
            };
            var tmp = leftTmp ? this.chatMsgLeftTmp : this.chatMsgRightTmp;
            var c = tmp(context);
            return c;
        };
        Chat.prototype.genUserTitleNameTag = function (react, isActive) {
            var _this = this;
            var isTarget = (react.targetUserId === Views.ViewBase.currentUserId);
            var name = isTarget ? react.askingUserName : react.targetUserName;
            var context = {
                name: name,
                rid: react.reactId
            };
            var $person = $(this.chatTitleTagTmp(context));
            if (isActive) {
                $person.addClass("active");
            }
            this.switchPersonStatus($person, isActive);
            var $people = $(".nchat-all .people");
            var $actionMenuCont = $person.find(".actions-cont");
            if (isTarget) {
                this.targetActions($actionMenuCont);
            }
            else {
                this.requestorActions($actionMenuCont);
            }
            $people.append($person);
            $person.find(".name-active").click(function (e) {
                e.preventDefault();
                var persons = $people.find(".person").toArray();
                persons.forEach(function (p) {
                    var $p = $(p);
                    _this.switchPersonStatus($p, false);
                });
                _this.switchPersonStatus($person, true);
                var $msgTmpCont = $person.find(".msg-storage");
                var $msgCont = $(".nchat-all .messages");
                $msgCont.empty();
                $msgCont.html($msgTmpCont.clone().html());
                $(".nchat-all .chat-with .name").html($person.find(".name-cont .name").html());
                _this.scrollToEnd();
            });
            $person.find(".actions").click(function (e) {
                e.preventDefault();
                $actionMenuCont.toggle();
            });
            $person.find(".stop").click(function (e) {
                e.preventDefault();
                var rid = $person.data("rid");
                _this.exeAct(rid, "stop");
            });
            return $person;
        };
        Chat.prototype.switchPersonStatus = function ($person, isActive) {
            var $cont = $person.find(".name-cont");
            var $name = $cont.find(".name");
            var $nameActive = $cont.find(".name-active");
            if (isActive) {
                $name.show();
                $nameActive.hide();
            }
            else {
                $name.hide();
                $nameActive.show();
            }
        };
        Chat.prototype.getActivePerson = function () {
            var $person = $(".person.active");
            return $person;
        };
        Chat.prototype.sendMessage = function () {
            var _this = this;
            var $person = this.getActivePerson();
            var rid = $person.data("rid");
            var last = $person.data("last");
            var $msgBox = $("#msgBox");
            var data = {
                reactId: rid,
                text: $msgBox.val(),
                lastDate: last
            };
            Views.ViewBase.currentView.apiPost("ReactChat", data, function (newPosts) {
                _this.appPosts(newPosts, rid);
                $msgBox.val("");
            });
        };
        Chat.prototype.createLayout = function (reacts) {
            var _this = this;
            var $layout = $(".nchat-all");
            var firstReact = reacts[0];
            var isTarget = (firstReact.targetUserId === Views.ViewBase.currentUserId);
            var name = isTarget ? firstReact.askingUserName : firstReact.targetUserName;
            var context = {
                initChatName: name
            };
            $layout = $(this.chatLayoutTmp(context));
            $("body").append($layout);
            $layout.find("#msgBox").keyup(function (e) {
                if (e.keyCode === 13) {
                    _this.sendMessage();
                }
            });
            $layout.find("#minimize").click(function (e) {
                $layout.find(".people").toggle();
                $layout.find(".messages").toggle();
                $layout.find(".new-message").toggle();
            });
        };
        Chat.prototype.destroyLayout = function () {
            var $layout = $(".nchat-all");
            $layout.remove();
        };
        Chat.prototype.addNewPersons = function (reacts, hasLayout) {
            var _this = this;
            var first = true;
            reacts.forEach(function (r, i) {
                _this.addNames(r);
                var $titleTag = Chat.getUserTitleNameTag(r.reactId);
                var exists = $titleTag != null;
                if (!exists) {
                    var isActive = !hasLayout && first;
                    var $person = _this.genUserTitleNameTag(r, isActive);
                    if (isActive) {
                        first = false;
                    }
                    _this.appPosts(r.chatPosts, r.reactId);
                    if (r.chatPosts.length > 0) {
                        var last = _.last(r.chatPosts);
                        Chat.getUserTitleNameTag(r.reactId).data("last", last.time);
                    }
                }
            });
        };
        Chat.prototype.removeOldPersons = function (reacts) {
            var persons = $(".nchat-all .persons .person").toArray();
            persons.forEach(function (person) {
                var $person = $(person);
                var reactId = $person.data("rid");
                var reactFound = _.find(reacts, function (r) {
                    return r.reactId === reactId;
                });
                var wasFound = reactFound != null;
                if (!wasFound) {
                    $person.remove();
                }
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
        Chat.prototype.actMenuItem = function (name, action) {
            var _this = this;
            var context = {
                action: action,
                name: name
            };
            var $i = $(this.chatActionTmp(context));
            var $a = $i.find("a");
            $a.click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var act = $target.data("act");
                var rid = $target.closest(".person").data("rid");
                _this.exeAct(rid, act);
            });
            return $i;
        };
        Chat.prototype.targetActions = function ($cont) {
            $cont.append(this.actMenuItem("We've already met", "met"));
            $cont.append(this.actMenuItem("We didn't meet", "didNotMeet"));
        };
        Chat.prototype.requestorActions = function ($cont) {
            $cont.append(this.actMenuItem("We didn't meet", "didNotMeet"));
        };
        Chat.prototype.createStopScreen = function (reactId) {
            var _this = this;
            var $cont = $(".nchat-all .messages");
            var $c = $(this.stopWinTmp());
            $cont.append($c);
            var blockPerson = $c.find("#cbBlockPerson").prop("checked");
            var reportPerson = $c.find("#cbReportPerson").prop("checked");
            $c.find(".exec").click(function (e) {
                e.preventDefault();
                if (blockPerson) {
                    _this.dlg.create("User blocking and reporting", "Do you really want to report this user ?", "Cancel", "Report", function () {
                        _this.changeRectState(reactId, CheckinReactionState.Blocked);
                    });
                }
                else if (reportPerson) {
                    _this.dlg.create("User blocking", "Do you really want to block this user ?", "Cancel", "Block", function () {
                        _this.changeRectState(reactId, CheckinReactionState.Blocked);
                    });
                }
                else {
                    _this.dlg.create("Stop conversation", "Do you really want to stop the conversation ?", "Cancel", "Stop", function () {
                        _this.changeRectState(reactId, CheckinReactionState.Refused);
                    });
                }
            });
            $c.find(".cancel").click(function (e) {
                e.preventDefault();
                $c.remove();
            });
        };
        Chat.prototype.changeRectState = function (reactId, state, extraVals) {
            var _this = this;
            if (extraVals === void 0) { extraVals = null; }
            var prms = { id: reactId, state: state };
            if (extraVals) {
                prms = $.extend(prms, extraVals);
            }
            Views.ViewBase.currentView.apiPut("CheckinReact", prms, function () {
                var $person = Chat.getUserTitleNameTag(reactId);
                $person.remove();
                var anyPersons = $(".nchat-all .persons .person").length > 0;
                if (!anyPersons) {
                    _this.destroyLayout();
                }
                var $actPerson = _this.getActivePerson();
                var isJustActive = $person.data("rid") === reactId;
                if (isJustActive) {
                    $(".nchat-all .messages").empty();
                }
            });
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
        return Chat;
    }());
    Views.Chat = Chat;
})(Views || (Views = {}));
//# sourceMappingURL=Chat.js.map