module TravelB {

	export enum CheckinReactionState { Created, Refused, Accepted, Finished, Rated, NotMet, Blocked, Reported, Met }

	export class Chat {

		private chatLayoutTmp = Views.ViewBase.currentView.registerTemplate("chat-layout-template");
		private chatTitleTagTmp = Views.ViewBase.currentView.registerTemplate("chat-person-title-template");
		private chatMsgLeftTmp = Views.ViewBase.currentView.registerTemplate("chat-msg-l-template");
		private chatMsgRightTmp = Views.ViewBase.currentView.registerTemplate("chat-msg-r-template");
		private chatActionTmp = Views.ViewBase.currentView.registerTemplate("chat-action-template");

			
		
		private stopWinTmp = Views.ViewBase.currentView.registerTemplate("stopWin-template");
		
		private dlg: Common.ConfirmDialog;

		private chatRefresh: ChatRefresh;
		private names = [];

		private v: Views.TravelBView;

		constructor(view) {

			this.v = view;

			this.chatRefresh = new ChatRefresh();
			this.chatRefresh.onRefresh = (responses) => {
				if (responses) {
					responses.forEach((resp) => {
						this.appPosts(resp.posts, resp.reactId);
					});
				}
			}

			this.dlg = new Common.ConfirmDialog();
		}
			
		public refreshAll(callback: Function = null) {
			var prms = [["type", "s"]];

			this.v.apiGet("CheckinReact", prms, (reacts) => {

				var anyReacts = reacts.length > 0;
				var $layout = $(".nchat-all");
				var hasLayout = $layout.length > 0;

				if (anyReacts) {
					if (!hasLayout) {
						this.createLayout(reacts);
						}

					this.addNewPersons(reacts, hasLayout);

					this.removeOldPersons(reacts);

					if (!this.chatRefresh.isStarted) {
							this.chatRefresh.startRefresh();
					}

				} else {
					this.destroyLayout();					
				}
					
				if (callback) {
					callback();
				}
			});
		}

		public static getUserTitleNameTag(rid) {
			var $i = $(`.nchat-all .people .person[data-rid="${rid}"]`);
			if ($i.length > 0) {
				return $i;
			}

			return null;
		}

		private appPosts(posts, reactId) {
				
			var $titleTag = Chat.getUserTitleNameTag(reactId);
			var $msgStorage = $titleTag.find(".msg-storage");
			var $txtCont = $(".nchat-all .messages");

			var oldPosts = $msgStorage.find(".message").toArray();
			var firstMsgUserId = oldPosts.length > 0 ? $(oldPosts[0]).data("uid") : null;

			var actRid = this.getActivePerson().data("rid");

			var ordered = _.sortBy(posts, (p) => { return p.time });

			ordered.forEach((p) => {
				var name = this.genNameById(p.userId);

				if (!firstMsgUserId) {				
					firstMsgUserId = p.userId;
				}

				var leftTmp = firstMsgUserId === p.userId;

				var post = this.genPost(leftTmp, p.userId, name, p.text, p.time);

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
		}

		private scrollToEnd() {
				setTimeout(() => {
						var $txtCont = $(".nchat-all .messages");
						var sh = $txtCont[0].scrollHeight;
						$txtCont[0].scrollTop = sh;
				}, 10);						
		}

		private genPost(leftTmp, userId, name, text, time) {

			var context = {
				userId: userId,
				name: name,
				text: text,
				time: moment(time).format("LT")
			};

			var tmp = leftTmp ? this.chatMsgLeftTmp : this.chatMsgRightTmp;

			var c = tmp(context);
			return c;
		}


		private genUserTitleNameTag(react, isActive: boolean) {
			var isTarget = (react.targetUserId === Views.ViewBase.currentUserId);
			var name = isTarget ? react.askingUserName : react.targetUserName;
			var uid = isTarget ? react.askingUserId : react.targetUserId;

			var context = {
				name: name,
				rid: react.reactId,
				uid: uid
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
			} else {
					this.requestorActions($actionMenuCont);					
			}

			$people.append($person);

			$person.find(".name-active").click((e) => {
				e.preventDefault();

				var persons = $people.find(".person").toArray();
				persons.forEach((p) => {
					var $p = $(p);
					this.switchPersonStatus($p, false);
				});

				this.switchPersonStatus($person, true);

				var $msgTmpCont = $person.find(".msg-storage");
				var $msgCont = $(".nchat-all .messages");
				$msgCont.empty();
				$msgCont.html($msgTmpCont.clone().html());

				$(".nchat-all .chat-with .name").html($person.find(".name-cont .name").html());
					
				this.scrollToEnd();				
			});

			$person.find(".actions").click((e) => {
					e.preventDefault();					
					$actionMenuCont.toggle();					
			});

			$person.find(".stop").click((e) => {
					e.preventDefault();
					var rid = $person.data("rid");
				this.exeAct(rid, "stop");
			});
			

			return $person;
		}

		private switchPersonStatus($person, isActive) {
			var $cont = $person.find(".name-cont");
			var $name = $cont.find(".name");
			var $nameActive = $cont.find(".name-active");

			if (isActive) {
				$name.show();
				$nameActive.hide();
			} else {
				$name.hide();
				$nameActive.show();
			}
		}

		private getActivePerson() {
			var $person = $(".person.active");
			return $person;
		}

		private sendMessage() {

			var $person = this.getActivePerson();
			var rid = $person.data("rid");
			var last = $person.data("last");

			var $msgBox = $("#msgBox");

			var data = {
				reactId: rid,
				text: $msgBox.val(),
				lastDate: last
			}

			Views.ViewBase.currentView.apiPost("ReactChat", data, (newPosts) => {
				this.appPosts(newPosts, rid);

				$msgBox.val("");
			});
		}

		private createLayout(reacts) {
			var $layout = $(".nchat-all");

			var firstReact = reacts[0];
			var isTarget = (firstReact.targetUserId === Views.ViewBase.currentUserId);
			var name = isTarget ? firstReact.askingUserName : firstReact.targetUserName;

			var context = {
				initChatName: name
			};

			$layout = $(this.chatLayoutTmp(context));
			$("body").append($layout);

			$layout.find("#msgBox").keyup((e) => {
				if (e.keyCode === 13) {
					this.sendMessage();
				}
			});

			$layout.find("#minimize").click((e) => {
				$layout.find(".people").toggle();
				$layout.find(".messages").toggle();
				$layout.find(".new-message").toggle();
			});
		}

			private destroyLayout() {
					var $layout = $(".nchat-all");
					$layout.remove();
			}

		private addNewPersons(reacts, hasLayout) {
			var first = true;
			reacts.forEach((r, i) => {
				this.addNames(r);

				var $titleTag = Chat.getUserTitleNameTag(r.reactId);
				var exists = $titleTag != null;
				if (!exists) {
					var isActive = !hasLayout && first;
					var $person = this.genUserTitleNameTag(r, isActive);

					if (isActive) {
						first = false;
					}
					this.appPosts(r.chatPosts, r.reactId);
					if (r.chatPosts.length > 0) {
						var last = _.last(r.chatPosts);
						Chat.getUserTitleNameTag(r.reactId).data("last", last.time);
					}

				}
			});
		}

		private removeOldPersons(reacts) {
			var persons = $(".nchat-all .persons .person").toArray();
			persons.forEach((person) => {
				var $person = $(person);
				var reactId = $person.data("rid");
				var reactFound = _.find(reacts, (r) => {
					return r.reactId === reactId;
				});
				var wasFound = reactFound != null;
				if (!wasFound) {
					$person.remove();
				}
			});				
		}

		private addNames(r) {
			this.addName(r.askingUserId, r.askingUserName);
			this.addName(r.targetUserId, r.targetUserName);
		}

		private addName(id, name) {

			var f = this.genNameById(id);

			if (!f) {
				this.names.push({ id: id, name: name });
			}
		}

		private genNameById(id) {
			var f = _.find(this.names, (n) => {
				return n.id === id;
			});

			if (!f) {
				return null;
			}

			return f.name;
		}


		private actMenuItem(name, action) {
			var context = {
				action: action,
				name: name
			};

			var $i = $(this.chatActionTmp(context));

			var $a = $i.find("a");

			$a.click((e) => {
				e.preventDefault();
				var $target = $(e.target);
				var act = $target.data("act");
				var rid = $target.closest(".person").data("rid");
				this.exeAct(rid, act);
			});

			return $i;
		}
			
		private targetActions($cont) {				
				$cont.append(this.actMenuItem(this.v.t("AlreadyMet", "jsTravelB"), "met"));
				$cont.append(this.actMenuItem(this.v.t("DidntMeet", "jsTravelB"), "didNotMeet"));			
		}

		private requestorActions($cont) {				
				$cont.append(this.actMenuItem(this.v.t("DidntMeet", "jsTravelB"), "didNotMeet"));				
		}

		private createStopScreen(reactId) {
				var $cont = $(".nchat-all .messages");

			var $c = $(this.stopWinTmp());

			$cont.append($c);
				
			var blockPerson = $c.find("#cbBlockPerson").prop("checked");
			var reportPerson = $c.find("#cbReportPerson").prop("checked");

			$c.find(".exec").click((e) => {
					e.preventDefault();

					if (blockPerson) {
							this.dlg.create(this.v.t("UserBlockingTitle", "jsTravelB"), this.v.t("UserBlockingBody", "jsTravelB"), this.v.t("Cancel", "jsLayout"), this.v.t("UserBlockingReport", "jsTravelB"), () => {
									this.changeRectState(reactId, CheckinReactionState.Blocked);
							});	
					}
					else if (reportPerson) {
							this.dlg.create(this.v.t("UserReportingTitle", "jsTravelB"), this.v.t("UserReportingBody", "jsTravelB"), this.v.t("Cancel", "jsLayout"), this.v.t("UserReportingBlock", "jsTravelB"), () => {
									this.changeRectState(reactId, CheckinReactionState.Blocked);
							});
					}
					else {
							this.dlg.create(this.v.t("StopConversationTitle", "jsTravelB"), this.v.t("StopConversationBody", "jsTravelB"), this.v.t("Cancel", "jsLayout"), this.v.t("StopConversationStop", "jsTravelB"), () => {
									this.changeRectState(reactId, CheckinReactionState.Refused);
							});		
					}
			});

			$c.find(".cancel").click((e) => {
					e.preventDefault();

				$c.remove();
			});
				
		}

		private changeRectState(reactId, state: CheckinReactionState, extraVals = null) {
			var prms = { id: reactId, state: state };
			if (extraVals) {
				prms = $.extend(prms, extraVals);
			}
			this.v.apiPut("CheckinReact", prms, () => {
					var $person = Chat.getUserTitleNameTag(reactId);
					$person.remove();

					var anyPersons = $(".nchat-all .persons .person").length > 0;
					if (!anyPersons) {
						this.destroyLayout();
					}

					var $actPerson = this.getActivePerson();
					var isJustActive = $person.data("rid") === reactId;
					if (isJustActive) {
						$(".nchat-all .messages").empty();
					}
			});
		}
			
		private exeAct(reactId, act) {
			if (act === "stop") {
				this.createStopScreen(reactId);
			}
			if (act === "met") {

					this.dlg.create(this.v.t("AlreadyMetTitle", "jsTravelB"), this.v.t("AlreadyMetBody", "jsTravelB"), this.v.t("Cancel", "jsLayout"), this.v.t("AlreadyMetConfirm", "jsTravelB"), () => {
					this.changeRectState(reactId, CheckinReactionState.Met);
				});
			}
			if (act === "didNotMeet") {

					this.dlg.create(this.v.t("DidntMeetTitle", "jsTravelB"), this.v.t("DidntMeetBody", "jsTravelB"), this.v.t("Cancel", "jsLayout"), this.v.t("DidntMeetConfirm", "jsTravelB"), () => {
					this.changeRectState(reactId, CheckinReactionState.NotMet);
				});
			}

		}
	}
}