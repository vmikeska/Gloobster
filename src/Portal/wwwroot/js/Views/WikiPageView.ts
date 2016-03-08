﻿module Views {
	export class LinksAdmin {

		public articleId: string;

		private linksTemplate;
		private linkItemLinkTemplate;

	  private $form;

		constructor(articleId) {
			this.articleId = articleId;

			this.linksTemplate = ViewBase.currentView.registerTemplate("linkItem-template");
			this.linkItemLinkTemplate = ViewBase.currentView.registerTemplate("linkItemLink-template");
		}

		public createItemEditButtons(sectionId) {
			var $root = $(`#Links_${sectionId}`);
			var links = $root.find(".favItem").toArray();
			links.forEach((link) => {
				var $link = $(link);
				var id = $link.data("id");
				var name = $link.data("name");
				var $html = $(`<a href="#" class="editLink" data-id="${id}">Edit</a>`);
				$html.click((e) => {
					e.preventDefault();
					this.createItemEditForm(name, id, sectionId);
				});
				$link.append($html);
			});

			this.createAddNewItemButton(sectionId);
		}

		private createAddNewItemButton(sectionId) {
			var $cont = $(`#Links_${sectionId}`);
			var $html = $(`<a href="#" data-sectionid="${sectionId}">Add item</a>`);
			$html.click((e) => this.showNewItemForm(e, sectionId));
			$cont.append($html);
		}

		private showNewItemForm(e, sectionId) {
			e.preventDefault();
			this.createItemEditForm("NewItem", "Temp", sectionId);
		}

		private createItemEditForm(name, id, sectionId) {
		 if (this.$form) {
			this.$form.remove(); 
		 }
		 
		 var $root = $(`#Links_${sectionId}`);
		 var context = { name: name, id: id };
		 var $html = $(this.linksTemplate(context));

		 $html.find(".cancel").click((e) => this.cancelEdit(e, sectionId));
		 $html.find(".add").click((e) => this.addLinkToItem(e, $html));
		 $html.find(".save").click((e) => this.saveItem(e, sectionId));
		 $html.find(".delete").click((e) => this.itemDelete(e));

		 $root.before($html);
			this.$form = $html;

		 var $link = $(`#faviItem_${id}`);
		 var $socLinks = $link.find(".socLink");
		 var socLinks = $socLinks.toArray();
		 socLinks.forEach((socLink) => {
			var $socLink = $(socLink);
			var type = $socLink.data("type");
			var sid = $socLink.data("sid");
			var id = $socLink.data("id");
			var lContext = {
			 id: id,
			 selectedName: this.getSocNetName(type),
			 selectedValue: type,
			 sid: sid
			};
			this.createSingleLinkEdit($html.find(".links"), lContext);
		 });
		}

		private getSocNetName(val) {
			if (val === 0) {
				return "FB";
			}
			if (val === 1) {
				return "Foursquare";
			}
			if (val === 4) {
				return "Yelp";
			}
		}

		//private hideLinksAdmin(id, sectionId) {
		//	$(`#linksEdit_${id}`).remove();
		//	$(`#Links_${sectionId}`).find(".editLink").remove();
		//}

		private getLinkDataToUpdate(linkId, sectionId) {
		  var $cont = $(`#Links_${sectionId}`);
			var $adminRoot = $(`#linksEdit_${linkId}`);
			var $socLinks = $adminRoot.find(".links");

			var data = {
				linkId: linkId,
				articleId: this.articleId,
				name: $adminRoot.find("#name").val(),
				category: $cont.data("category"),
				socLinks: []
			};

			var soclinks = $socLinks.children().toArray();
			soclinks.forEach((socLink) => {
				var $socLink = $(socLink);
				var linkReq = {
					socNetType: $socLink.find(".selectedValue").val(),
					sid: $socLink.find(".sid").val(),
					id: $socLink.data("id")
				};
				data.socLinks.push(linkReq);
			});

			return data;
		}
	 
		private cancelEdit(e, sectionId) {
		 e.preventDefault();
			this.$form.remove();
		}

		private addLinkToItem(e, $html) {
		 e.preventDefault();

		 var lContext = {
			id: null,
			selectedName: "Choose",
			selectedValue: null,
			sid: null			
		 };
		 this.createSingleLinkEdit($html.find(".links"), lContext);

	  }

		private saveItem(e, sectionId) {
			e.preventDefault();
			var id = $(e.target).data("id");

			var data = this.getLinkDataToUpdate(id, sectionId);

			if (id === "Temp") {
				ViewBase.currentView.apiPost("WikiLink", data, (r) => {
					this.$form.remove();
				});
			} else {
				ViewBase.currentView.apiPut("WikiLink", data, (r) => {
					this.$form.remove();
				});
			}
		}

		private createSingleLinkEdit($cont, context) {
			var $lHtml = $(this.linkItemLinkTemplate(context));
			$lHtml.find(".delete").click((e) => this.linkDelete(e));

			$cont.append($lHtml);
		}

		private itemDelete(e) {
			e.preventDefault();
			var id = $(e.target).data("id");

			ViewBase.currentView.apiDelete("WikiLink", [["linkId", id], ["articleId", this.articleId]], (r) => {
			 $(`#faviItem_${id}`).remove();
			});
		}

		private linkDelete(e) {
			e.preventDefault();
			var id = $(e.target).data("id");
			$(`#linkItem_${id}`).remove();
		}

	}

	export class BlockAdmin {

	 private blockTemplate;
	 private articleId: string;
	 private langVersion: string;

		constructor(articleId, langVersion) {
			this.articleId = articleId;
			this.langVersion = langVersion;

			this.blockTemplate = ViewBase.currentView.registerTemplate("blockEdit-template");
		}
	 
		public createEditWindow(sectionId) {
		 var $p = $(`#text_${sectionId}`);

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

				ViewBase.currentView.apiPut("WikiUpdate", data, (r) => {
					$(`#edit_${id}`).remove();
					$(`#text_${id}`).text(data.newText);
					$(`#editSection_${id}`).show();
				});
			});

			$p.prepend($html);
		}

		public createAdminLink($block, id, adminType) {
		 var $html = $(`<a href="#" id="editSection_${id}" class="editSection" data-at="${adminType}" data-id="${id}">edit</a>`);

		 $html.click((e) => {
			e.preventDefault();
			var $edit = $(e.target);
			var id = $edit.data("id");
			var adminType = $edit.data("at");

			this.createEditWindow(id);
			
			$edit.hide();
		 });

		 $block.children().first().append($html);
		}
	 
	}

	export class WikiPageView extends ViewBase {

		public articleId: string;

		private $adminMode;
		private isAdminMode = false;
		private langVersion: string;

		private linksAdmin: LinksAdmin;
		private blockAdmin: BlockAdmin;

		constructor(articleId) {
			super();
			this.articleId = articleId;
			this.langVersion = this.getLangVersion();

			this.linksAdmin = new LinksAdmin(articleId);
			this.blockAdmin = new BlockAdmin(articleId, this.langVersion);

			this.$adminMode = $("#adminMode");
			this.regAdminMode();

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
			 this.generateBlocks();
			} else {
				this.destroyBlocks();
			}
		}

		private generateBlocks() {
		 var adminBlocks = $(".adminBlock").toArray();

		 adminBlocks.forEach((block) => {
			var $block = $(block);
			var id = $block.data("id");
			var adminType = $block.data("at");

			this.drawAdminBlocks($block, id, adminType);
		 });

		}

		private destroyBlocks() {
			$(".editSection").remove();
		}

		

		private drawAdminBlocks($block, id, adminType) {
			var adminTypes = adminType.split(",");
			if (_.contains(adminTypes, "standard")) {
			 this.blockAdmin.createAdminLink($block, id, adminType);
			}

			if (_.contains(adminTypes, "links")) {
			 this.linksAdmin.createItemEditButtons(id);
			}
		}
	 
	}
}