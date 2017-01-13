module Views {

		

		export class IssuesView extends ViewBase {

				constructor() {
						super();
						this.init();						
				}

				private init() {

						$(".set-act").click((e) => {
								e.preventDefault();

								var $t = $(e.target);
								var $i = $t.closest(".issue");

								var isActive = $i.hasClass("active");

								$(".issue").removeClass("active");
								$(".issue-body").addClass("hidden");

								if (isActive) {
										return;
								}

								$i.addClass("active");

								$i.find(".issue-body").removeClass("hidden");

						});

				}

	}
}