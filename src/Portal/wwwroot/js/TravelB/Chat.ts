module Views {

		export enum CheckinReactionState { Created, Refused, Accepted, Finished, Rated, NotMet, Blocked, Reported }


	export class ChatRefresh {

		public onRefresh: Function;

		//public loadedIds = [];

		private refreshCycleFinished = true;
		private lastRefreshDate = null;

		public startRefresh() {
			var i = setInterval(() => {

				if (!this.refreshCycleFinished) {
					return;
				} else {
					this.refreshCycleFinished = false;
				}

				var chatWins = $(".chat-cont").toArray();

				if (chatWins.length === 0) {
						clearInterval(i);
				}

				var loadedIds = _.map(chatWins, (w) => { return $(w).data("id"); });
						

				

				var prms = [];
				var lastDate = null;
				loadedIds.forEach((rid) => {
					prms.push(["reactIds", rid]);
					var ld = Chat.getChatByRectId(rid).data("last");

					if (lastDate === null) {
						lastDate = ld;
					} else if (ld > lastDate) {
						lastDate = ld;
					}
				});
				if (lastDate) {
					prms.push(["lastDate", lastDate.toString()]);
				}

				ViewBase.currentView.apiGet("ReactChat", prms, (responses) => {

					this.onRefresh(responses);

					this.refreshCycleFinished = true;
				});

			}, 5000);
		}
	}

	export class Chat {
		private chatRowTmp;
		private chatWinTmp;
		private stopWinTmp;
		private metWin;

		private chatRefresh: ChatRefresh;

		constructor() {
				this.chatRowTmp = ViewBase.currentView.registerTemplate("chatRow-template");
				this.chatWinTmp = ViewBase.currentView.registerTemplate("chatWin-template");

				this.stopWinTmp = ViewBase.currentView.registerTemplate("stopWin-template");
				this.metWin = ViewBase.currentView.registerTemplate("metWin-template");

				this.chatRefresh = new ChatRefresh();
				this.chatRefresh.onRefresh = (responses) => {
				if (responses) {
					responses.forEach((resp) => {
						this.appPosts(resp.posts, resp.reactId);
					});
				}
			}
		}

		private names = [];


		public createAll() {
			var prms = [["state", CheckinReactionState.Accepted.toString()]];

			var $cont = $("body");
			//this.getMainCont();

			ViewBase.currentView.apiGet("CheckinReact", prms, (reacts) => {

				reacts.forEach((r, i) => {
					//this.chatRefresh.loadedIds.push(r.reactId);

					var $c = this.createOneChat(r);
					var left = (i * (250 + 15));
					$c.css("left", `${left}px`);

					$cont.append($c);
					this.appPosts(r.chatPosts, r.reactId);

					if (r.chatPosts.length > 0) {
						var last = _.last(r.chatPosts);
						Chat.getChatByRectId(r.reactId).data("last", last.time);
					}
				});

				this.chatRefresh.startRefresh();

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

		//private getMainCont() {
		//	var $c = $(".chats");

		//	if ($c.length === 0) {
		//		$c = $(`<div class="chats"></div>`);
		//		$("body").append($c);
		//	}

		//	return $c;
		//}

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
				this.createMetScreen(reactId);
			}
			if (act === "didNotMeet") {

				var prms = { id: reactId, state: CheckinReactionState.NotMet };
				ViewBase.currentView.apiPut("CheckinReact", prms, () => {
						var $cont = Chat.getChatByRectId(reactId);
					$cont.remove();
				});

			}
		}

		private createStopScreen(reactId) {
				var $cont = Chat.getChatByRectId(reactId);

			var $c = $(this.stopWinTmp());

			$cont.html($c);

			$cont.find(".notInt").click((e) => {
					e.preventDefault();
					var dlg = new Common.ConfirmDialog();
					dlg.create("Stop conversation", "Do you really want to stop the conversation ?", "Cancel", "Stop", () => {

							var prms = { id: reactId, state: CheckinReactionState.Refused, message: "" };
							ViewBase.currentView.apiPut("CheckinReact", prms, () => {
									var $cont = Chat.getChatByRectId(reactId);
									$cont.remove();
							});

					});					
			});
			
			$cont.find(".block").click((e) => {
					e.preventDefault();
					this.block(reactId, CheckinReactionState.Blocked);
			});

			$cont.find(".blockReport").click((e) => {
				e.preventDefault();
				this.block(reactId, CheckinReactionState.Reported);
			});
		}

		private block(reactId, state) {
			var dlg = new Common.ConfirmDialog();
			dlg.create("User blocking", "Do you really want to block this user ?", "Cancel", "Block", () => {

				var prms = { id: reactId, state: state, message: "" };
				ViewBase.currentView.apiPut("CheckinReact", prms, () => {
						var $cont = Chat.getChatByRectId(reactId);
					$cont.remove();
				});

			});
		}

		private createMetScreen(reactId) {
				var $cont = Chat.getChatByRectId(reactId);

			var context = {
				rid: reactId
			};

			var $c = $(this.metWin(context));
			$cont.html($c);
			$cont.find(".showComm").change((e) => {				
				$cont.find(".comment").toggle();
			});


			/ notRating
			$cont.find("./liked")
		}

			//todo: change it all
		private changeRectState() {
				var prms = { id: reactId, state: CheckinReactionState.Refused, message: "" };
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