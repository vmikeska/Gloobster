module Views {

		export enum CheckinReactionState { Created, Refused, Accepted, Finished, Rated, NotMet, Blocked, Reported, Met }

	export class Chat {
		private chatRowTmp;
		private chatWinTmp;
		private stopWinTmp;
		private metWin;

		private dlg: Common.ConfirmDialog;

		private chatRefresh: ChatRefresh;

		constructor() {
			this.chatRowTmp = ViewBase.currentView.registerTemplate("chatRow-template");
			this.chatWinTmp = ViewBase.currentView.registerTemplate("chatWin-template");

			this.stopWinTmp = ViewBase.currentView.registerTemplate("stopWin-template");
			//this.metWin = ViewBase.currentView.registerTemplate("metWin-template");

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

		private names = [];

		public refreshAll(callback = null) {
			var prms = [["type", "s"]];

			var $cont = $("body");

			ViewBase.currentView.apiGet("CheckinReact", prms, (reacts) => {

				var chats = $(".chat-cont").toArray();
				chats.forEach((chat) => {
					var $chat = $(chat);
					var reactId = $chat.data("id");
					var reactFound = _.find(reacts, (r) => {
						return r.reactId === reactId;
					});
					var wasFound = reactFound != null;
					if (!wasFound) {
						$chat.remove();
					}

				});

				reacts.forEach((r, i) => {

					var $chat = Chat.getChatByRectId(r.reactId);
					var cnt = $(".chat-cont").length;

					if ($chat.length === 0) {
						this.createOneChatWindow($cont, r, cnt);
					}
				});

				if (!this.chatRefresh.isStarted) {
					this.chatRefresh.startRefresh();
				}

				if (callback) {
					callback();
				}
			});
		}

		private createOneChatWindow($cont, react, count) {
				var $c = this.createOneChat(react);
					var left = (count * (250 + 15));
					$c.css("left", `${left}px`);

					$cont.append($c);
					this.appPosts(react.chatPosts, react.reactId);

					if (react.chatPosts.length > 0) {
						var last = _.last(react.chatPosts);
						Chat.getChatByRectId(react.reactId).data("last", last.time);
					}
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

		public createOneChat(react) {
			this.addNames(react);
			
			var isTarget = (react.targetUserId === ViewBase.currentUserId);

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
			} else {
					this.requestorActions($combo);
			}

			$combo.find("a").click((e) => {
					e.preventDefault();
					var $target = $(e.target);
					var act = $target.data("act");
					this.exeAct(react.reactId, act);
			});

			$c.find(".send").click((e) => {
				e.preventDefault();
				var txt = $c.find("textarea").val();

				this.sendMessage(txt, react.reactId);
			});

			return $c;
		}

		private exeAct(reactId, act) {
			if (act === "stop") {
				this.createStopScreen(reactId);
			}
			if (act === "met") {

					this.dlg.create("Already met", "Have you really already met ?", "Cancel", "We have met", () => {
							this.changeRectState(reactId, CheckinReactionState.Met);
					});
			}
			if (act === "didNotMeet") {

					this.dlg.create("Didn't meet", "We didn't meet", "Cancel", "We didn't meet", () => {
							this.changeRectState(reactId, CheckinReactionState.NotMet);
					});					
			}
		}

		private createStopScreen(reactId) {
				var $cont = Chat.getChatByRectId(reactId);

			var $c = $(this.stopWinTmp());

			$cont.html($c);

			$cont.find(".notInt").click((e) => {
					e.preventDefault();
					
					this.dlg.create("Stop conversation", "Do you really want to stop the conversation ?", "Cancel", "Stop", () => {
						this.changeRectState(reactId, CheckinReactionState.Refused);
					});					
			});
			
			$cont.find(".block").click((e) => {
					e.preventDefault();

					this.dlg.create("User blocking", "Do you really want to block this user ?", "Cancel", "Block", () => {
							this.changeRectState(reactId, CheckinReactionState.Blocked);							
					});
					
			});

			$cont.find(".blockReport").click((e) => {
					e.preventDefault();

				this.dlg.create("User blocking and reporting", "Do you really want to report this user ?", "Cancel", "Report", () => {
						this.changeRectState(reactId, CheckinReactionState.Blocked);
				});
			});
		}
		
		private changeRectState(reactId, state: CheckinReactionState, extraVals = null) {
			var prms = { id: reactId, state: state };
			if (extraVals) {
				prms = $.extend(prms, extraVals);
			}
			ViewBase.currentView.apiPut("CheckinReact", prms, () => {
				var $cont = Chat.getChatByRectId(reactId);
				$cont.remove();
			});
		}

		private targetActions($combo) {
				$combo.find("ul").append(this.actMenuItem("Stop conversation", "stop"));
				$combo.find("ul").append(this.actMenuItem("We've already met", "met"));
				$combo.find("ul").append(this.actMenuItem("We didn't meet", "didNotMeet"));				
		}

		private requestorActions($combo) {
				$combo.find("ul").append(this.actMenuItem("Stop conversation", "stop"));
				$combo.find("ul").append(this.actMenuItem("We didn't meet", "didNotMeet"));				
		}

		private actMenuItem(name, action) {
			return $(`<li><a data-act="${action}" href="#">${name}</a></li>`);
		}

		public static getChatByRectId(reactId) {
			return $(`#chat_${reactId}`);
		}
			
		private sendMessage(txt, reactId) {

			var data = {
				reactId: reactId,
				text: txt,
				lastDate: Chat.getChatByRectId(reactId).data("last")
			}

			ViewBase.currentView.apiPost("ReactChat", data, (newPosts) => {
				this.appPosts(newPosts, reactId);

				var chatWin = Chat.getChatByRectId(reactId);
				chatWin.find("textarea").val("");
			});
		}

		private appPosts(posts, reactId) {
				var chatWin = Chat.getChatByRectId(reactId);
			var $cont = chatWin.find(".chat-texts");

			var order = _.sortBy(posts, (p) => { return p.time });
			order.forEach((p) => {
				var name = this.genNameById(p.userId);
				var $p = this.genPost(p.userId, name, p.text);
				$cont.append($p);
			});

			if (order.length > 0) {
				var last = _.last(order);

				console.log(`updating last.time: ${last.time}`);

				chatWin.data("last", last.time);

				//wait until images are loaded - full height known
				setTimeout(() => {
					var sh = $cont[0].scrollHeight;
					$cont[0].scrollTop = sh;
				}, 100);
				
			}
		}

		private genPost(userId, name, text) {

			var context = {
					userId: userId,
					name: name,
					text: text
			};

			var $c = $(this.chatRowTmp(context));				
			return $c;
		}
	}
}