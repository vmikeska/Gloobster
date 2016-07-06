module Views {

	export enum CheckinReactionState { Created, Refused, Accepted, Finished }

	export class Chat {
		private chatRowTmp;
		private chatWinTmp;

		constructor() {
				this.chatRowTmp = ViewBase.currentView.registerTemplate("chatRow-template");
				this.chatWinTmp = ViewBase.currentView.registerTemplate("chatWin-template");
		}

		private names = [];
	  private loadedIds = [];

		private refreshCycleFinished = true;

		public startRefresh() {
			var i = setInterval(() => {

				if (!this.refreshCycleFinished) {
					return;
				} else {
					this.refreshCycleFinished = false;
				}

				if (this.loadedIds.length === 0) {
					clearInterval(i);
				}

				var prms = [];
				var lastDate = null;
				this.loadedIds.forEach((rid) => {
						prms.push(["reactIds", rid]);
						var ld = this.getChatByRectId(rid).data("last");

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

					if (responses) {
						responses.forEach((resp) => {
							this.appPosts(resp.posts, resp.reactId);
						});
					}

					this.refreshCycleFinished = true;
				});

			}, 5000);
		}

		private lastRefreshDate = null;

		public createAll() {
			var prms = [["state", CheckinReactionState.Accepted.toString()]];

			var $cont = this.getMainCont();

			ViewBase.currentView.apiGet("CheckinReact", prms, (reacts) => {

				reacts.forEach((r) => {
					this.loadedIds.push(r.reactId);

					var $c = this.createOneChat(r);
					$cont.append($c);
					this.appPosts(r.chatPosts, r.reactId);

					if (r.chatPosts.length > 0) {
						var last = _.last(r.chatPosts);
						this.getChatByRectId(r.reactId).data("last", last.time);
					}
				});

				this.startRefresh();

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

		private getMainCont() {
			var $c = $(".chats");

			if ($c.length === 0) {
				$c = $(`<div class="chats"></div>`);
				$("body").append($c);
			}

			return $c;
		}

		public createOneChat(react) {
			this.addNames(react);
				
			var name = react.askingUserName;
			if (react.askingUserId === ViewBase.currentUserId) {
				name = react.targetUserName;
			}
				
			var context = {
					reactId: react.reactId,
					name: name
			};

			var $c = $(this.chatWinTmp(context));

			$c.find(".send").click((e) => {
				e.preventDefault();
				var txt = $c.find("textarea").val();

				this.sendMessage(txt, react.reactId);
			});

			return $c;
		}

		private getChatByRectId(reactId) {
			return $(`#chat_${reactId}`);
		}

		private sendMessage(txt, reactId) {

			var data = {
				reactId: reactId,
				text: txt,
				lastDate: this.getChatByRectId(reactId).data("last")
			}

			ViewBase.currentView.apiPost("ReactChat", data, (newPosts) => {
				this.appPosts(newPosts, reactId);

				var chatWin = this.getChatByRectId(reactId);
				chatWin.find("textarea").val("");
			});
		}

		private appPosts(posts, reactId) {
			var chatWin = this.getChatByRectId(reactId);
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

	export class CheckinReacts {

		public refreshReacts() {

			var prms = [["state", CheckinReactionState.Created.toString()]];

			ViewBase.currentView.apiGet("CheckinReact", prms, (reacts) => {
					
					this.genRactNotifs(reacts);
			});
		}

		private genRactNotifs(reacts) {
			reacts.forEach((r) => {

				var data = {
					uid: r.targetUserId,
					name: r.targetUserName,
					id: r.checkinId
				};

				var $h = this.createReactNotif(data);
				$("#notifCont").append($h);
			});
		}

		private createReactNotif(data) {

			var $content =
				$(`<a data-uid="${data.uid}" href="#">${data.name}</a> 
							 <br/>
							 Want's to start chat with you`);

			var actions = [
				{
					name: "Start",
					callback: () => {
						this.changeNotifState(data.id, CheckinReactionState.Accepted, (r) => {
							//todo: display chate
							$content.closest(".notif").remove();
						});
					}
				}
			];

			var $n = this.createNotifBase($content, data, actions);
			return $n;
		}

		private createNotifBase(content, data, actions) {

			var $base = $(`<div id="notif_${data.id}" data-id="${data.id}" class="notif"><div class="acts"></div></div>`);
			$base.append(content);

			var $acts = $base.find(".acts");

			var hideTxt = "Let be";
			var $hideAct = this.genAction(hideTxt, () => {
				this.changeNotifState(data.id, CheckinReactionState.Refused, (r) => {
					$hideAct.closest(".notif").remove();
				});
			});
			$acts.append($hideAct);

			actions.forEach((a) => {
				var $act = this.genAction(a.name, a.callback);
				$acts.prepend($act);
			});

			return $base;
		}

		private changeNotifState(id, state: CheckinReactionState, callback) {

			var data = { id: id, state: state };

			ViewBase.currentView.apiPut("CheckinReact", data, (r) => {
				callback(r);
			});
		}

		private genAction(name, callback) {
			var $btn = $(`<button>${name}</button>`);
			$btn.click((e) => {
				e.preventDefault();
				callback();
			});
			return $btn;
		}

	}

}