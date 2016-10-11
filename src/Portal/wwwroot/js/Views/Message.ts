module Views {
	export class Messages extends ViewBase {

		private msgTmp = ViewBase.currentView.registerTemplate("msgPost-template");

		private otherUserId;

		constructor(otherUserId) {
			super();
			this.otherUserId = otherUserId;
			
			this.refresh();

			$("#commentSubmit").click((e) => {
				e.preventDefault();
				var msg = $("#commentInput").val();
				this.sendMessage(this.otherUserId, msg);
			});
		}
			
		public refresh() {
			var prms = [["userId", this.otherUserId]];
			this.apiGet("Message", prms, (rs) => {
					this.displayMessages(rs.messages);
			});
		}

		public sendMessage(userId, message) {

			var data = {
				userId: userId,
				message: message
			};

			this.apiPost("Message", data, (rs) => {
					this.displayMessages(rs.messages);
				$("#commentInput").val("");
			});
		}

		private displayMessages(messages) {

			var $cont = $("#msgsCont");
			$cont.html("");

			messages.forEach((r) => {

				var context = {
					dateFormatted: moment(r.date).format("lll"),
					message: r.message,
					name: r.name,
					userId: r.userId,
					showUnread: !r.read && (r.userId !== ViewBase.currentUserId)
				};
					
				var $m = $(this.msgTmp(context));
				$cont.prepend($m);
			});

		}

	}
}