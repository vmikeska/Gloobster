module Views {
	export class WikiAdminPageView extends WikiPageView {	 
		private $adminMode;
		private isAdminMode = false;

		private linksAdmin: LinksAdmin;
		private blockAdmin: BlockAdmin;
		private doDontAdmin: DoDontAdmin;
		private priceAdmin: PriceAdmin;
		private photoAdmin: PhotoAdmin;
		private photosAdmin: PhotosAdmin;

		constructor(articleId, articleType) {
			super(articleId, articleType);
			
			this.linksAdmin = new LinksAdmin(articleId);
			this.blockAdmin = new BlockAdmin(articleId, this.langVersion);
			this.doDontAdmin = new DoDontAdmin(articleId, this.langVersion);
			this.priceAdmin = new PriceAdmin(articleId);
			this.photoAdmin = new PhotoAdmin(articleId);
			this.photosAdmin = new PhotosAdmin(articleId);

			this.$adminMode = $("#adminMode");
			this.regAdminMode();
		}

		private regAdminMode() {
			this.$adminMode.change(() => {
				this.isAdminMode = this.$adminMode.prop("checked");
				this.onAdminModeChanged();
			});
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

			this.doDontAdmin.generateAdmin();
			this.priceAdmin.generateAdmin();
			this.photoAdmin.generateAdmin();

			if (this.articleType === Views.ArticleType.City) {
			 this.photosAdmin.createAdmin();
			}		 
		}

		private destroyBlocks() {
			$(".editSection").remove();
			this.linksAdmin.removeAdminLinks();
			this.priceAdmin.clean();
			this.doDontAdmin.clean();
			this.photoAdmin.clean();

			if (this.articleType === Views.ArticleType.City) {
				this.photosAdmin.clean();
			}
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

	export class PhotosAdmin {
		private articleId;
	 
		private $cont;

		constructor(articleId) {
			this.articleId = articleId;
		 
			this.$cont = $("#photos");			
		}

		public createAdmin() {						
			this.refreshPhotos(this.articleId, true);			
		}

		public clean() {
		 this.refreshPhotos(this.articleId, false);		 
		}
	 
		private regDelPhoto() {
			this.$cont.find(".delete").click((e) => {
				e.preventDefault();
				var $target = $(e.target);

				var confirmDialog = new Common.ConfirmDialog();
				confirmDialog.create("Delete", "Do you want to permanently delete this photo ?", "Cancel", "Ok", ($dialog) => {
				 
					ViewBase.currentView.apiDelete("WikiPhotoGallery", [["articleId", $target.data("ai")], ["photoId", $target.data("pi")]], (r) => {
						$dialog.remove();
						this.refreshPhotos(this.articleId, true);

					});
				});
			});
		}

		private regConfPhoto() {
		 this.$cont.find(".confirm").click((e) => {
			e.preventDefault();
			var $target = $(e.target);
				
				var data = {
				 articleId: $target.data("ai"),
				 photoId: $target.data("pi")
				};
				ViewBase.currentView.apiPut("WikiPhotoGallery", data, (r) => {		
				 this.refreshPhotos(this.articleId, true);
				});
			});
		}
	 
		private refreshPhotos(id: string, admin: boolean) {
			var request = new Common.RequestSender("/Wiki/ArticlePhotos", null, false);
			request.params = [["id", id], ["admin", admin.toString()]];
			request.onSuccess = (html) => {
			 this.$cont.html(html);
				var $photoBtn = $("#duCont");
				if (admin) {
					this.regConfPhoto();
					this.regDelPhoto();
					this.registerPhotoUpload(this.articleId, "galleryPhotoInput");

					$photoBtn.show();
				}
				//else {
				//	$photoBtn.hide();
				//}
			};
			request.onError = (response) => { $("#photos").html("Error") };
			request.sendGet();		 
		}

		private registerPhotoUpload(articleId, inputId) {
			
			var config = new Common.FileUploadConfig();
			config.inputId = inputId;
			config.endpoint = "WikiPhotoGallery";

			var picUpload = new Common.FileUpload(config);
			picUpload.customId = articleId;

			picUpload.onProgressChanged = (percent) => {				
				var $pb = $("#galleryProgress");
				$pb.show();
				var pt = `${percent}%`;
				$(".progress").css("width", pt);
				$pb.find("span").text(pt);
			}

			picUpload.onUploadFinished = (file, fileId) => {			 
				this.refreshPhotos(this.articleId, true);
			}
		}

	}

	export class PhotoAdmin {
		private buttonTemplate;

		private articleId;

		constructor(articleId) {
			this.articleId = articleId;
			this.buttonTemplate = ViewBase.currentView.registerTemplate("photoEdit-template");
		}

		public generateAdmin() {
			var $html = $(this.buttonTemplate());
			$(".titlePhoto").before($html);

			this.registerPhotoUpload(this.articleId, "titlePhotoInput");
		}

		public clean() {
				$(".photo-button").remove();
		}

		private registerPhotoUpload(articleId, inputId) {
			var config = new Common.FileUploadConfig();
			config.inputId = inputId;
			config.endpoint = "WikiTitlePhoto";

			var picUpload = new Common.FileUpload(config);
			picUpload.customId = articleId;

			picUpload.onProgressChanged = (percent) => {
			}

			picUpload.onUploadFinished = (file, files) => {
				var d = new Date();

				$(".titlePhoto img").attr("src", `/wiki/ArticleTitlePhoto/${this.articleId}?d=${d.getDate()}`);

			}
		}
	}

	export class PriceAdmin {

		private priceEditTemplate;
		private articleId;
		private $form;
		private $edited;

		constructor(articleId) {
			this.articleId = articleId;
			this.priceEditTemplate = ViewBase.currentView.registerTemplate("priceEdit-template");
		}

		public generateAdmin() {
			var $tds = $(".priceItemAdmin");
			var tds = $tds.toArray();
			tds.forEach((td) => this.generateAdminItem(td));
		}

		public clean() {
			$(".priceEdit").remove();
		}

		private generateAdminItem(td) {
			var $td = $(td);
			var id = $td.data("id");
			$td.append(this.getEditButton(id));
		}

		private getEditButton(id) {
			var $edit = $(`<a href="#" class="priceEdit" data-id="${id}">Edit</a>`);
			$edit.click((e) => this.edit(e));
			return $edit;
		}

		private edit(e) {
			e.preventDefault();
			var $target = $(e.target);
			this.$edited = $target.parent();

			if (this.$form) {
				this.$form.remove();
			}

			var context = {
				id: this.$edited.data("id"),
				value: this.$edited.find(".price").text()
			};
			this.$form = $(this.priceEditTemplate(context));
			this.$form.find("button").click((e) => this.save(e));

			this.$edited.parent().before(this.$form);
		}

		private save(e) {
			var $target = $(e.target);

			var val = this.$form.find("input").val();
			var parsedVal = parseFloat(val);
			if (parsedVal) {
				var data = {
					articleId: this.articleId,
					price: parsedVal,
					priceId: this.$edited.data("id")
				};
				ViewBase.currentView.apiPut("WikiPrice", data, (r) => {
					this.$form.remove();
					this.$edited.find(".price").text(parsedVal.toFixed(2));
				});
			} else {
				alert("Incorret format, make it 0.0 format");
			}
		}
	}

	export class DoDontAdmin {

		private articleId;
		private language;
		private $edited;
		private $cont;
		private $form;

		private editTemplate;
		private itemTemplate;

		constructor(articleId, lang) {
			this.articleId = articleId;
			this.language = lang;
			this.$cont = $(".doDont");
			this.editTemplate = ViewBase.currentView.registerTemplate("doDontAdmin-template");
			this.itemTemplate = ViewBase.currentView.registerTemplate("doDontItem-template");
		}

		public clean() {
			$(".ddEditButton").remove();
			$(".doDontAdder").remove();
		}

		public generateAdmin() {
			var $items = this.$cont.find(".item");
			var items = $items.toArray();
			items.forEach((item) => {
				var $item = $(item);
				var id = $item.data("id");
				var $html = this.editButton(id);
				$item.append($html);
			});

			$(".admindo").after(this.generateAdder("do"));
			$(".admindont").after(this.generateAdder("dont"));
		}

		private editButton(id) {
			var $html = $(`<a class="ddEditButton" href="#" data-id="${id}">edit</a>`);
			$html.click((e) => this.edit(e));
			return $html;
		}

		private generateAdder(type) {
			var $html = $(`<button class="doDontAdder" data-type="${type}">Add new</button>`);
			$html.click((e) => this.setToCreatingNew(e));
			return $html;
		}

		private setToCreatingNew(e) {
			e.preventDefault();

			if (this.$form) {
				this.$form.empty();
			}

			var $target = $(e.target);
			var type = $target.data("type");

			var context = {
				text: ""
			};
			var $html = $(this.editTemplate(context));
			this.$form = this.$cont.find(".admin" + type);
			this.$form.html($html);
			this.$form.find(".cancel").click((e) => this.cancel(e));
			this.$form.find(".save").click((e) => this.saveNew(e, type));
			this.$form.find(".delete").hide();
		}

		private saveNew(e, type) {
			e.preventDefault();

			var text = this.$form.find("textarea").val();

			var data = {
				articleId: this.articleId,
				language: this.language,
				text: text,
				type: type
			};

			ViewBase.currentView.apiPost("WikiDoDont", data, (r) => {
				var context = {
					id: r,
					text: this.$form.find("textarea").val(),
					type: type
				};
				var $newItem = $(this.itemTemplate(context));
				var $editBtn = this.editButton(context.id);
				$newItem.append($editBtn);
				$(".admin" + type).before($newItem);
				this.$form.empty();
			});
		}

		private edit(e) {
			e.preventDefault();
			var $target = $(e.target);
			var $parent = $target.parent();
			this.$edited = $parent;
			var type = $parent.data("t");
			if (this.$form) {
				this.$form.empty();
			}

			var context = {
				text: $parent.find("span").text()
			};
			var $html = $(this.editTemplate(context));
			this.$form = this.$cont.find(".admin" + type);
			this.$form.html($html);
			this.$form.find(".cancel").click((e) => this.cancel(e));
			this.$form.find(".save").click((e) => this.save(e));
			this.$form.find(".delete").click((e) => this.delete(e));
		}

		private delete(e) {
			e.preventDefault();

			var data = [["articleId", this.articleId], ["id", this.$edited.data("id")], ["type", this.$edited.data("t")]];

			ViewBase.currentView.apiDelete("WikiDoDont", data, (r) => {
				this.$form.empty();
				this.$edited.remove();
				this.$edited = null;
			});

		}

		private cancel(e) {
			e.preventDefault();
			this.$form.empty();
			this.$edited = null;
		}

		private save(e) {
			e.preventDefault();

			var data = {
				articleId: this.articleId,
				language: this.language,
				id: this.$edited.data("id"),
				text: this.$form.find("textarea").val(),
				type: this.$edited.data("t")
			};

			ViewBase.currentView.apiPut("WikiDoDont", data, (r) => {
				this.$form.empty();
				this.$edited.find("span").text(data.text);
			});
		}
	}

	export class LinksAdmin {

		public articleId: string;

		private linksTemplate;
		private linkItemLinkTemplate;
		private favLink;
		private favLinkLink;

		private $form;

		constructor(articleId) {
			this.articleId = articleId;

			this.linksTemplate = ViewBase.currentView.registerTemplate("linkItem-template");
			this.linkItemLinkTemplate = ViewBase.currentView.registerTemplate("linkItemLink-template");
			this.favLink = ViewBase.currentView.registerTemplate("favLink-template");
			this.favLinkLink = ViewBase.currentView.registerTemplate("favLinkLink-template");
		}

		public removeAdminLinks() {
			$(".editLink").remove();
			$(".adminAdder").remove();
		}

		public createItemEditButtons(sectionId) {
			var $cont = $(`#Links_${sectionId}`);
			var links = $cont.find(".favItem").toArray();
			links.forEach((link) => {
				var $link = $(link);
				this.createItemEditButton($link, sectionId);
			});

			this.createAddNewItemButton(sectionId);
		}

		private createItemEditButton($link, sectionId) {
			var id = $link.data("id");
			var name = $link.data("name");
			var $html = $(`<a href="#" class="editLink" data-id="${id}">Edit</a>`);
			$html.click((e) => {
				e.preventDefault();
				this.createItemEditForm(name, id, sectionId);
			});
			$link.append($html);
		}

		private createAddNewItemButton(sectionId) {
			var $cont = $(`#Links_${sectionId}`);
			var $html = $(`<a class="adminAdder" id="addNew_${sectionId}" href="#" data-sectionid="${sectionId}">Add item</a>`);
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

			var $cont = $(`#Links_${sectionId}`);
			var context = { name: name, id: id };
			var $html = $(this.linksTemplate(context));

			$html.find(".cancel").click((e) => this.cancelEdit(e, sectionId));
			$html.find(".add").click((e) => this.addLinkToItem(e, $html));
			$html.find(".save").click((e) => this.saveItem(e, sectionId));
			$html.find(".delete").click((e) => this.itemDelete(e, sectionId));

			$cont.before($html);
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
					this.addNewTag(r, sectionId);
				});
			} else {
				ViewBase.currentView.apiPut("WikiLink", data, (r) => {
					this.$form.remove();
					this.removeTag(id, sectionId);
					this.addNewTag(r, sectionId);
				});
			}
		}

		private getLinkIco(t) {
			if (t === SourceType.S4) {
				return "icon-foursquare";
			}
			if (t === SourceType.FB) {
				return "icon-facebook2";
			}
			
			if (t === SourceType.Yelp) {
				return "icon-yelp";
			}
			return "";
		}

		private getLink(t, sid) {
			if (t === SourceType.S4) {
				return `https://foursquare.com/v/${sid}`;
			}
			if (t === SourceType.FB) {
				return `https://www.facebook.com/${sid}`;
			}
			if (t === SourceType.Yelp) {
				return `https://www.yelp.com/biz/${sid}`;
			}
		}

		private removeTag(id, sectionId) {
			var $cont = $(`#Links_${sectionId}`);
			$cont.find(`#faviItem_${id}`).remove();
		}

		private addNewTag(r, sectionId) {
			var context = {
				id: r.id,
				name: r.name
			};
			var $html = $(this.favLink(context));

			r.links.forEach((l) => {
				var cx = {
					link: this.getLink(l.type, l.sourceId),
					type: l.type,
					id: l.id,
					sid: l.sourceId,
					ico: this.getLinkIco(l.type)
				};
				var $h = $(this.favLinkLink(cx));
				$html.append($h);
			});

			this.createItemEditButton($html, sectionId);

			$(`#addNew_${sectionId}`).before($html);
		}


		private createSingleLinkEdit($cont, context) {
			var $l = $(this.linkItemLinkTemplate(context));
			$l.find(".delete").click((e) => {
				this.linkDelete(e);
			});
            
		  Common.DropDown.registerDropDown($l.find(".dropdown"));		    
			$cont.append($l);
		}

		private itemDelete(e, sectionId) {
			e.preventDefault();
			var id = $(e.target).data("id");

			ViewBase.currentView.apiDelete("WikiLink", [["linkId", id], ["articleId", this.articleId]], (r) => {
				this.removeTag(id, sectionId);
				this.$form.remove();
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

			$html.find(".cancel").click((e) => this.cancel(e));
			$html.find(".save").click((e) => this.save(e));

			$html.find(".back").click((e) => this.moveVersion(e, +1));
			$html.find(".forward").click((e) => this.moveVersion(e, -1));

			$p.prepend($html);
		}

		private moveVersion(e, direction) {
			var $btn = $(e.target);
			var id = $btn.data("id");
			var $cont = $(`#edit_${id}`);
			var $pos = $cont.find(".position");
			var position = parseInt($pos.val());
			position += direction;
			$pos.val(position);

			this.getVersion(id, position, (version) => {
				$cont.find(".editTxt").val(version.value);
			});
		}

		private getVersion(id, position, callback) {
			var data = [["articleId", this.articleId], ["lang", this.langVersion], ["addId", id], ["position", position]];
			ViewBase.currentView.apiGet("WikiVersion", data, (r) => {
				callback(r);
			});
		}

		private cancel(e) {
			var $btn = $(e.target);
			var id = $btn.data("id");

			$(`#edit_${id}`).remove();
			$(`#editSection_${id}`).show();
		}

		private save(e) {
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
				$(`.empty-cont[data-sid="${id}"]`).remove();

			});
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

}