module Views {
	export class CheckinReacts {

			public onStartChat: Function;

			public chatRequestBodyTmp = ViewBase.currentView.registerTemplate("chat-request-body-template");
			public notifBaseTmp = ViewBase.currentView.registerTemplate("notif-base-template");
			
		public refreshReacts(callback = null) {

			var prms = [["type", "a"]];

			ViewBase.currentView.apiGet("CheckinReact", prms, (reacts) => {					
					this.genRactNotifs(reacts);

					if (callback) {
						callback();
					}
			});
		}

		private genRactNotifs(reacts) {
			$("#notifCont").html("");

			reacts.forEach((r) => {

				var data = {
					uid: r.targetUserId,
					name: r.targetUserName,
					id: r.reactId
				};

				var $h = this.createReactNotif(data);
				$("#notifCont").append($h);
			});
		}


		private createReactNotif(data) {

			var context = {
					uid: data.uid,
					name: data.name
			};

			var $content = $(this.chatRequestBodyTmp(context));
				
			var startAction = {
				name: "Accept",
				icon: "icon-user-check",
				callback: () => {
					this.changeNotifState(data.id, CheckinReactionState.Accepted, (r) => {

						if (this.onStartChat) {
							this.onStartChat(() => {
								$content.closest(".notif").remove();
							});
						}

					});
				}
			};
				
			var actions = [startAction];
				
			var $n = this.createNotifBase($content, data, actions);
			return $n;
		}

		private createNotifBase($content, data, actions) {

			var context = {
				id: data.id
			};
				
			var $base = $(this.notifBaseTmp(context));
				
				var letBeAction = {
						name: "LetBe",
						icon: "icon-cross",
						callback: () => {
								this.changeNotifState(data.id, CheckinReactionState.Refused, (r) => {
										$base.remove();
								});
						}
				}
				actions.push(letBeAction);

			
			$base.find(".cont").html($content);

			var $acts = $base.find(".acts");

			actions.forEach((a) => {
				var $act = this.genAction(a.name, a.icon, a.callback);
				$acts.append($act);
			});

			return $base;
		}

		private changeNotifState(id, state: CheckinReactionState, callback) {

			var data = { id: id, state: state };

			ViewBase.currentView.apiPut("CheckinReact", data, (r) => {
				callback(r);
			});
		}

		private genAction(name, icon, callback) {
			var $btn = $(`<a href="#" class="act-btn ${icon}"><span class="lato"> ${name}</span></a><br/>`);
			$btn.click((e) => {
				e.preventDefault();
				callback();
			});
			return $btn;
		}

	}
}