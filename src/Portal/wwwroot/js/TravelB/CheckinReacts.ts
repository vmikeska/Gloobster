module Views {
	export class CheckinReacts {

		public onStartChat: Function;

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

			var $content =
				$(`<div><a data-uid="${data.uid}" href="#">${data.name}</a><br/>Want's to start chat with you</div>`);

			var actions = [
				{
					name: "Start",
					callback: () => {
						this.changeNotifState(data.id, CheckinReactionState.Accepted, (r) => {

							if (this.onStartChat) {
								this.onStartChat(() => {
									$content.closest(".notif").remove();
								});
							}

						});
					}
				}
			];

			var $n = this.createNotifBase($content, data, actions);
			return $n;
		}

		private createNotifBase(content, data, actions) {

			var $base = $(`<div id="notif_${data.id}" data-id="${data.id}" class="notif"><div class="cont"></div><div class="acts"></div></div>`);
			$base.find(".cont").html(content);

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