module Views {
	export class Messages extends ViewBase {

		private msgTmp;

		private otherUserId;

		constructor(otherUserId) {
			super();
			this.otherUserId = otherUserId;
			this.msgTmp = this.registerTemplate("msgPost-template");

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
			});
		}

		private displayMessages(messages) {

			var $cont = $("#msgsCont");
			$cont.html("");

			messages.forEach((r) => {
				var $m = $(this.msgTmp(r));
				$cont.prepend($m);
			});

		}

	}
}