module Views {
	export class DetailView extends ViewBase {

		private itemTmp = ViewBase.currentView.registerTemplate("user-rating-template");

		constructor() {
			super();

			this.initRating();

			this.transLangs();
			this.transCharact();
		}

		private transCharact() {
				var $cs = $("#characts");

				if ($cs.length > 0) {
						var chars = TravelB.TravelBUtils.interestsDB();
						var csa = $cs.find(".tag").toArray();
						csa.forEach((l) => {
								var $l = $(l);
								var code = parseInt($l.html());

								var char = _.find(chars, (li) => {
										return li.id === code;
								});

								
								if (char) {
										$l.html(char.text);
								} else {
										$l.hide();
								}

						});
				}
		}

			private transLangs() {					
					var $ls = $("#langs");

					if ($ls.length > 0) {
							var langs = TravelB.TravelBUtils.langsDB();
							var lsa = $ls.find(".ltag").toArray();
						lsa.forEach((l) => {
								var $l = $(l);
							var code = $l.html();

							var lang = _.find(langs, (li) => {
								return li.id === code;
							});

							if (lang) {
									$l.html(lang.text);
							} else {
									$l.hide();
							}
						});
					}
			}

		private initRating() {

			$("#sendNewText").click((e) => {
				e.preventDefault();

				var data = {
					targetUserId: $("#userId").val(),
					text: $("#newText").val()
				};

				this.apiPost("UserRating", data, (r) => {
						$(".ratings .empty").hide();

						var context = {
							userId: r.userId,
							name: r.name,
							text: r.text
						};

						var $h = $(this.itemTmp(context));

						$(".ratings .items").append($h);

						$("#newText").val("");
					}
				);

				});

			$(".rating-delete").click((e) => {
					var $t = $(e.target);
					var $c = $t.closest(".item");
					var id = $c.data("id");
					
					var cd = new Common.ConfirmDialog();
					cd.create(this.t("RatingDelTitle", "jsUserDetail"), this.t("RatingDelBody", "jsUserDetail"), this.t("Cancel", "jsLayout"), this.t("Delete", "jsLayout"), () => {
						this.apiDelete("UserRating", [["id", id]], () => {
							$(`.item[data-id="${id}"]`).remove();
						});
					});
			});
		}
			
	}
}