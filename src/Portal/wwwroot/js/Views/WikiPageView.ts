module Views {
	export class WikiPageView extends ViewBase {
	 
	 public articleId: string;

	  private $adminMode;
		private isAdminMode = false;
		private langVersion: string;
	  private blockTemplate;

		constructor() {
		 super();

			this.$adminMode = $("#adminMode");
			this.regAdminMode();
			this.langVersion = this.getLangVersion();

			this.blockTemplate = this.registerTemplate("blockEdit-template");

			this.regRating();
		}

	 private regRating() {
		 $(".icon-flag").click((e) => {
			e.preventDefault();
      $(e.target).closest('.evaluate').toggleClass('evaluate-open');
		});

		 $(".icon-heart").click((e) => {
			e.preventDefault();
			var $btn = $(e.target);
			 var $cont = $btn.closest(".evaluate");
			 var id = $cont.data("id");

			var data = {
			 articleId: this.articleId,
			 sectionId: id,
			 language: this.langVersion,

			 like: true			 
			};

			this.apiPut("WikiRating", data, (r) => {
			 //$(`#edit_${id}`).remove();
			 //$(`#text_${id}`).text(data.newText);
			 //$(`#editSection_${id}`).show();
			});	
		 });
	 }

	 private regAdminMode() {
		 this.$adminMode.change(() => {
			this.isAdminMode = this.$adminMode.prop("checked");
			 this.onAdminModeChanged();
		 });
		}

	 private getLangVersion() {
		 var urlParams = window.location.pathname.split("/");
		 return urlParams[2];		 
	 }

	 private onAdminModeChanged() {
		if (this.isAdminMode) {
			this.generateEdits();
		} else {
			this.destroyEdits();
		}		
	 }

	 private destroyEdits() {
		 $(".editSection").remove();
	 }

	 private generateEdits() {
		var adminCases = $(".adminCase").toArray();

		 adminCases.forEach((item) => {
			 var $case = $(item);
			 var id = $case.data("id");

			 var html = `<a href="#" id="editSection_${id}" class="editSection" data-id="${id}">edit</a>`;
			 $case.append(html);
		});

		 $(".editSection").click((e) => {
			 e.preventDefault();
			 var id = $(e.target).data("id");
			 var $p = $(`#text_${id}`);
			 this.createEditWindow($p, id);
			 $(e.target).hide();
		 });
	 }

	 private createEditWindow($p, sectionId) {
		 var scope = {			 
			text: $p.html(),
			id: sectionId 
		 };

		 var $html = $(this.blockTemplate(scope));
		 $html.find(".cancel").click((e) => {			
			 var $btn = $(e.target);
			 var id = $btn.data("id");

			 $(`#edit_${id}`).remove();
			 $(`#editSection_${id}`).show();
		 });
		 $html.find(".save").click((e) => {
			var $btn = $(e.target);
			var id = $btn.data("id");

			var data = {
			 articleId: this.articleId,
			 sectionId: id,
			 language: this.langVersion,

			 newText: $(`#edit_${id}`).find(".editTxt").val()
			};

			this.apiPut("WikiUpdate", data, (r) => {
			 $(`#edit_${id}`).remove();
			 $(`#text_${id}`).text(data.newText);
			 $(`#editSection_${id}`).show();
			});			
		 });
		
		 $p.prepend($html);
	 }

	}
}