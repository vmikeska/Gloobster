module Views {
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
					id: r.reactId
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