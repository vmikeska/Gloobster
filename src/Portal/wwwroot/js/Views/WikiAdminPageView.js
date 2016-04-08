var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiAdminPageView = (function (_super) {
        __extends(WikiAdminPageView, _super);
        function WikiAdminPageView(articleId, articleType) {
            _super.call(this, articleId, articleType);
            this.isAdminMode = false;
            this.linksAdmin = new LinksAdmin(articleId);
            this.blockAdmin = new BlockAdmin(articleId, this.langVersion);
            this.doDontAdmin = new DoDontAdmin(articleId, this.langVersion);
            this.priceAdmin = new PriceAdmin(articleId);
            this.photoAdmin = new PhotoAdmin(articleId);
            this.photosAdmin = new PhotosAdmin(articleId);
            this.$adminMode = $("#adminMode");
            this.regAdminMode();
        }
        WikiAdminPageView.prototype.regAdminMode = function () {
            var _this = this;
            this.$adminMode.change(function () {
                _this.isAdminMode = _this.$adminMode.prop("checked");
                _this.onAdminModeChanged();
            });
        };
        WikiAdminPageView.prototype.onAdminModeChanged = function () {
            if (this.isAdminMode) {
                this.generateBlocks();
            }
            else {
                this.destroyBlocks();
            }
        };
        WikiAdminPageView.prototype.generateBlocks = function () {
            var _this = this;
            var adminBlocks = $(".adminBlock").toArray();
            adminBlocks.forEach(function (block) {
                var $block = $(block);
                var id = $block.data("id");
                var adminType = $block.data("at");
                _this.drawAdminBlocks($block, id, adminType);
            });
            this.doDontAdmin.generateAdmin();
            this.priceAdmin.generateAdmin();
            this.photoAdmin.generateAdmin();
            if (this.articleType === Views.ArticleType.City) {
                this.photosAdmin.createAdmin();
            }
        };
        WikiAdminPageView.prototype.destroyBlocks = function () {
            $(".editSection").remove();
            this.linksAdmin.removeAdminLinks();
            this.priceAdmin.clean();
            this.doDontAdmin.clean();
            this.photoAdmin.clean();
            if (this.articleType === Views.ArticleType.City) {
                this.photosAdmin.clean();
            }
        };
        WikiAdminPageView.prototype.drawAdminBlocks = function ($block, id, adminType) {
            var adminTypes = adminType.split(",");
            if (_.contains(adminTypes, "standard")) {
                this.blockAdmin.createAdminLink($block, id, adminType);
            }
            if (_.contains(adminTypes, "links")) {
                this.linksAdmin.createItemEditButtons(id);
            }
        };
        return WikiAdminPageView;
    })(Views.WikiPageView);
    Views.WikiAdminPageView = WikiAdminPageView;
    var PhotosAdmin = (function () {
        function PhotosAdmin(articleId) {
            this.articleId = articleId;
            this.$cont = $("#photos");
        }
        PhotosAdmin.prototype.createAdmin = function () {
            this.refreshPhotos(this.articleId, true);
        };
        PhotosAdmin.prototype.clean = function () {
            this.refreshPhotos(this.articleId, false);
        };
        PhotosAdmin.prototype.regDelPhoto = function () {
            var _this = this;
            this.$cont.find(".delete").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var confirmDialog = new Common.ConfirmDialog();
                confirmDialog.create("Delete", "Do you want to permanently delete this photo ?", "Cancel", "Ok", function ($dialog) {
                    Views.ViewBase.currentView.apiDelete("WikiPhotoGallery", [["articleId", $target.data("ai")], ["photoId", $target.data("pi")]], function (r) {
                        $dialog.remove();
                        _this.refreshPhotos(_this.articleId, true);
                    });
                });
            });
        };
        PhotosAdmin.prototype.regConfPhoto = function () {
            var _this = this;
            this.$cont.find(".confirm").click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                var data = {
                    articleId: $target.data("ai"),
                    photoId: $target.data("pi")
                };
                Views.ViewBase.currentView.apiPut("WikiPhotoGallery", data, function (r) {
                    _this.refreshPhotos(_this.articleId, true);
                });
            });
        };
        PhotosAdmin.prototype.refreshPhotos = function (id, admin) {
            var _this = this;
            var request = new Common.RequestSender("/Wiki/ArticlePhotos", null, false);
            request.params = [["id", id], ["admin", admin.toString()]];
            request.onSuccess = function (html) {
                _this.$cont.html(html);
                var $photoBtn = $("#duCont");
                if (admin) {
                    _this.regConfPhoto();
                    _this.regDelPhoto();
                    _this.registerPhotoUpload(_this.articleId, "galleryPhotoInput");
                    $photoBtn.show();
                }
                //else {
                //	$photoBtn.hide();
                //}
            };
            request.onError = function (response) { $("#photos").html("Error"); };
            request.sendGet();
        };
        PhotosAdmin.prototype.registerPhotoUpload = function (articleId, inputId) {
            var _this = this;
            var config = new Common.FileUploadConfig();
            config.inputId = inputId;
            config.endpoint = "WikiPhotoGallery";
            var picUpload = new Common.FileUpload(config);
            picUpload.customId = articleId;
            picUpload.onProgressChanged = function (percent) {
                var $pb = $("#galleryProgress");
                $pb.show();
                var pt = percent + "%";
                $(".progress").css("width", pt);
                $pb.find("span").text(pt);
            };
            picUpload.onUploadFinished = function (file, fileId) {
                _this.refreshPhotos(_this.articleId, true);
            };
        };
        return PhotosAdmin;
    })();
    Views.PhotosAdmin = PhotosAdmin;
    var PhotoAdmin = (function () {
        function PhotoAdmin(articleId) {
            this.articleId = articleId;
            this.buttonTemplate = Views.ViewBase.currentView.registerTemplate("photoEdit-template");
        }
        PhotoAdmin.prototype.generateAdmin = function () {
            var $html = $(this.buttonTemplate());
            $(".titlePhoto").prepend($html);
            this.registerPhotoUpload(this.articleId, "titlePhotoInput");
        };
        PhotoAdmin.prototype.clean = function () {
            $(".photoButton").remove();
        };
        PhotoAdmin.prototype.registerPhotoUpload = function (articleId, inputId) {
            var _this = this;
            var config = new Common.FileUploadConfig();
            config.inputId = inputId;
            config.endpoint = "WikiTitlePhoto";
            var picUpload = new Common.FileUpload(config);
            picUpload.customId = articleId;
            picUpload.onProgressChanged = function (percent) {
            };
            picUpload.onUploadFinished = function (file, files) {
                var d = new Date();
                $(".titlePhoto img").attr("src", "/wiki/ArticleTitlePhoto/" + _this.articleId + "?d=" + d.getDate());
            };
        };
        return PhotoAdmin;
    })();
    Views.PhotoAdmin = PhotoAdmin;
    var PriceAdmin = (function () {
        function PriceAdmin(articleId) {
            this.articleId = articleId;
            this.priceEditTemplate = Views.ViewBase.currentView.registerTemplate("priceEdit-template");
        }
        PriceAdmin.prototype.generateAdmin = function () {
            var _this = this;
            var $tds = $(".priceItemAdmin");
            var tds = $tds.toArray();
            tds.forEach(function (td) { return _this.generateAdminItem(td); });
        };
        PriceAdmin.prototype.clean = function () {
            $(".priceEdit").remove();
        };
        PriceAdmin.prototype.generateAdminItem = function (td) {
            var $td = $(td);
            var id = $td.data("id");
            $td.append(this.getEditButton(id));
        };
        PriceAdmin.prototype.getEditButton = function (id) {
            var _this = this;
            var $edit = $("<a href=\"#\" class=\"priceEdit\" data-id=\"" + id + "\">Edit</a>");
            $edit.click(function (e) { return _this.edit(e); });
            return $edit;
        };
        PriceAdmin.prototype.edit = function (e) {
            var _this = this;
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
            this.$form.find("button").click(function (e) { return _this.save(e); });
            this.$edited.parent().before(this.$form);
        };
        PriceAdmin.prototype.save = function (e) {
            var _this = this;
            var $target = $(e.target);
            var val = this.$form.find("input").val();
            var parsedVal = parseFloat(val);
            if (parsedVal) {
                var data = {
                    articleId: this.articleId,
                    price: parsedVal,
                    priceId: this.$edited.data("id")
                };
                Views.ViewBase.currentView.apiPut("WikiPrice", data, function (r) {
                    _this.$form.remove();
                    _this.$edited.find(".price").text(parsedVal.toFixed(2));
                });
            }
            else {
                alert("Incorret format, make it 0.0 format");
            }
        };
        return PriceAdmin;
    })();
    Views.PriceAdmin = PriceAdmin;
    var DoDontAdmin = (function () {
        function DoDontAdmin(articleId, lang) {
            this.articleId = articleId;
            this.language = lang;
            this.$cont = $(".doDont");
            this.editTemplate = Views.ViewBase.currentView.registerTemplate("doDontAdmin-template");
            this.itemTemplate = Views.ViewBase.currentView.registerTemplate("doDontItem-template");
        }
        DoDontAdmin.prototype.clean = function () {
            $(".ddEditButton").remove();
            $(".doDontAdder").remove();
        };
        DoDontAdmin.prototype.generateAdmin = function () {
            var _this = this;
            var $places = this.$cont.find(".place");
            var places = $places.toArray();
            places.forEach(function (place) {
                var $place = $(place);
                var id = $place.data("id");
                var $html = _this.editButton(id);
                $place.append($html);
            });
            $(".admindo").after(this.generateAdder("do"));
            $(".admindont").after(this.generateAdder("dont"));
        };
        DoDontAdmin.prototype.editButton = function (id) {
            var _this = this;
            var $html = $("<a class=\"ddEditButton\" href=\"#\" data-id=\"" + id + "\">edit</a>");
            $html.click(function (e) { return _this.edit(e); });
            return $html;
        };
        DoDontAdmin.prototype.generateAdder = function (type) {
            var _this = this;
            var $html = $("<button class=\"doDontAdder\" data-type=\"" + type + "\">Add new</button>");
            $html.click(function (e) { return _this.setToCreatingNew(e); });
            return $html;
        };
        DoDontAdmin.prototype.setToCreatingNew = function (e) {
            var _this = this;
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
            this.$form.find(".cancel").click(function (e) { return _this.cancel(e); });
            this.$form.find(".save").click(function (e) { return _this.saveNew(e, type); });
            this.$form.find(".delete").hide();
        };
        DoDontAdmin.prototype.saveNew = function (e, type) {
            var _this = this;
            e.preventDefault();
            var text = this.$form.find("textarea").val();
            var data = {
                articleId: this.articleId,
                language: this.language,
                text: text,
                type: type
            };
            Views.ViewBase.currentView.apiPost("WikiDoDont", data, function (r) {
                var context = {
                    id: r,
                    text: _this.$form.find("textarea").val(),
                    type: type
                };
                var $newItem = $(_this.itemTemplate(context));
                var $editBtn = _this.editButton(context.id);
                $newItem.append($editBtn);
                $(".admin" + type).before($newItem);
                _this.$form.empty();
            });
        };
        DoDontAdmin.prototype.edit = function (e) {
            var _this = this;
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
            this.$form.find(".cancel").click(function (e) { return _this.cancel(e); });
            this.$form.find(".save").click(function (e) { return _this.save(e); });
            this.$form.find(".delete").click(function (e) { return _this.delete(e); });
        };
        DoDontAdmin.prototype.delete = function (e) {
            var _this = this;
            e.preventDefault();
            var data = [["articleId", this.articleId], ["id", this.$edited.data("id")], ["type", this.$edited.data("t")]];
            Views.ViewBase.currentView.apiDelete("WikiDoDont", data, function (r) {
                _this.$form.empty();
                _this.$edited.remove();
                _this.$edited = null;
            });
        };
        DoDontAdmin.prototype.cancel = function (e) {
            e.preventDefault();
            this.$form.empty();
            this.$edited = null;
        };
        DoDontAdmin.prototype.save = function (e) {
            var _this = this;
            e.preventDefault();
            var data = {
                articleId: this.articleId,
                language: this.language,
                id: this.$edited.data("id"),
                text: this.$form.find("textarea").val(),
                type: this.$edited.data("t")
            };
            Views.ViewBase.currentView.apiPut("WikiDoDont", data, function (r) {
                _this.$form.empty();
                _this.$edited.find("span").text(data.text);
            });
        };
        return DoDontAdmin;
    })();
    Views.DoDontAdmin = DoDontAdmin;
    var LinksAdmin = (function () {
        function LinksAdmin(articleId) {
            this.articleId = articleId;
            this.linksTemplate = Views.ViewBase.currentView.registerTemplate("linkItem-template");
            this.linkItemLinkTemplate = Views.ViewBase.currentView.registerTemplate("linkItemLink-template");
            this.favLink = Views.ViewBase.currentView.registerTemplate("favLink-template");
            this.favLinkLink = Views.ViewBase.currentView.registerTemplate("favLinkLink-template");
        }
        LinksAdmin.prototype.removeAdminLinks = function () {
            $(".editLink").remove();
            $(".adminAdder").remove();
        };
        LinksAdmin.prototype.createItemEditButtons = function (sectionId) {
            var _this = this;
            var $cont = $("#Links_" + sectionId);
            var links = $cont.find(".favItem").toArray();
            links.forEach(function (link) {
                var $link = $(link);
                _this.createItemEditButton($link, sectionId);
            });
            this.createAddNewItemButton(sectionId);
        };
        LinksAdmin.prototype.createItemEditButton = function ($link, sectionId) {
            var _this = this;
            var id = $link.data("id");
            var name = $link.data("name");
            var $html = $("<a href=\"#\" class=\"editLink\" data-id=\"" + id + "\">Edit</a>");
            $html.click(function (e) {
                e.preventDefault();
                _this.createItemEditForm(name, id, sectionId);
            });
            $link.append($html);
        };
        LinksAdmin.prototype.createAddNewItemButton = function (sectionId) {
            var _this = this;
            var $cont = $("#Links_" + sectionId);
            var $html = $("<a class=\"adminAdder\" id=\"addNew_" + sectionId + "\" href=\"#\" data-sectionid=\"" + sectionId + "\">Add item</a>");
            $html.click(function (e) { return _this.showNewItemForm(e, sectionId); });
            $cont.append($html);
        };
        LinksAdmin.prototype.showNewItemForm = function (e, sectionId) {
            e.preventDefault();
            this.createItemEditForm("NewItem", "Temp", sectionId);
        };
        LinksAdmin.prototype.createItemEditForm = function (name, id, sectionId) {
            var _this = this;
            if (this.$form) {
                this.$form.remove();
            }
            var $cont = $("#Links_" + sectionId);
            var context = { name: name, id: id };
            var $html = $(this.linksTemplate(context));
            $html.find(".cancel").click(function (e) { return _this.cancelEdit(e, sectionId); });
            $html.find(".add").click(function (e) { return _this.addLinkToItem(e, $html); });
            $html.find(".save").click(function (e) { return _this.saveItem(e, sectionId); });
            $html.find(".delete").click(function (e) { return _this.itemDelete(e, sectionId); });
            $cont.before($html);
            this.$form = $html;
            var $link = $("#faviItem_" + id);
            var $socLinks = $link.find(".socLink");
            var socLinks = $socLinks.toArray();
            socLinks.forEach(function (socLink) {
                var $socLink = $(socLink);
                var type = $socLink.data("type");
                var sid = $socLink.data("sid");
                var id = $socLink.data("id");
                var lContext = {
                    id: id,
                    selectedName: _this.getSocNetName(type),
                    selectedValue: type,
                    sid: sid
                };
                _this.createSingleLinkEdit($html.find(".links"), lContext);
            });
        };
        LinksAdmin.prototype.getSocNetName = function (val) {
            if (val === 0) {
                return "FB";
            }
            if (val === 1) {
                return "Foursquare";
            }
            if (val === 4) {
                return "Yelp";
            }
        };
        LinksAdmin.prototype.getLinkDataToUpdate = function (linkId, sectionId) {
            var $cont = $("#Links_" + sectionId);
            var $adminRoot = $("#linksEdit_" + linkId);
            var $socLinks = $adminRoot.find(".links");
            var data = {
                linkId: linkId,
                articleId: this.articleId,
                name: $adminRoot.find("#name").val(),
                category: $cont.data("category"),
                socLinks: []
            };
            var soclinks = $socLinks.children().toArray();
            soclinks.forEach(function (socLink) {
                var $socLink = $(socLink);
                var linkReq = {
                    socNetType: $socLink.find(".selectedValue").val(),
                    sid: $socLink.find(".sid").val(),
                    id: $socLink.data("id")
                };
                data.socLinks.push(linkReq);
            });
            return data;
        };
        LinksAdmin.prototype.cancelEdit = function (e, sectionId) {
            e.preventDefault();
            this.$form.remove();
        };
        LinksAdmin.prototype.addLinkToItem = function (e, $html) {
            e.preventDefault();
            var lContext = {
                id: null,
                selectedName: "Choose",
                selectedValue: null,
                sid: null
            };
            this.createSingleLinkEdit($html.find(".links"), lContext);
        };
        LinksAdmin.prototype.saveItem = function (e, sectionId) {
            var _this = this;
            e.preventDefault();
            var id = $(e.target).data("id");
            var data = this.getLinkDataToUpdate(id, sectionId);
            if (id === "Temp") {
                Views.ViewBase.currentView.apiPost("WikiLink", data, function (r) {
                    _this.$form.remove();
                    _this.addNewTag(r, sectionId);
                });
            }
            else {
                Views.ViewBase.currentView.apiPut("WikiLink", data, function (r) {
                    _this.$form.remove();
                    _this.removeTag(id, sectionId);
                    _this.addNewTag(r, sectionId);
                });
            }
        };
        LinksAdmin.prototype.getLinkIco = function (t) {
            if (t === SourceType.S4) {
                return "disc-foursquare";
            }
            if (t === SourceType.FB) {
                return "disc-facebook";
            }
            //todo: change
            if (t === SourceType.Yelp) {
                return "disc-google";
            }
        };
        LinksAdmin.prototype.getLink = function (t, sid) {
            if (t === SourceType.S4) {
                return "https://foursquare.com/v/" + sid;
            }
            if (t === SourceType.FB) {
                return "https://www.facebook.com/" + sid;
            }
            if (t === SourceType.Yelp) {
                return "https://www.yelp.com/biz/" + sid;
            }
        };
        LinksAdmin.prototype.removeTag = function (id, sectionId) {
            var $cont = $("#Links_" + sectionId);
            $cont.find("#faviItem_" + id).remove();
        };
        LinksAdmin.prototype.addNewTag = function (r, sectionId) {
            var _this = this;
            var context = {
                id: r.id,
                name: r.name
            };
            var $html = $(this.favLink(context));
            r.links.forEach(function (l) {
                var cx = {
                    link: _this.getLink(l.type, l.sourceId),
                    type: l.type,
                    id: l.id,
                    sid: l.sourceId,
                    ico: _this.getLinkIco(l.type)
                };
                var $h = $(_this.favLinkLink(cx));
                $html.find(".txt").after($h);
            });
            this.createItemEditButton($html, sectionId);
            $("#addNew_" + sectionId).before($html);
        };
        LinksAdmin.prototype.createSingleLinkEdit = function ($cont, context) {
            var _this = this;
            var $lHtml = $(this.linkItemLinkTemplate(context));
            $lHtml.find(".delete").click(function (e) { return _this.linkDelete(e); });
            $cont.append($lHtml);
        };
        LinksAdmin.prototype.itemDelete = function (e, sectionId) {
            var _this = this;
            e.preventDefault();
            var id = $(e.target).data("id");
            Views.ViewBase.currentView.apiDelete("WikiLink", [["linkId", id], ["articleId", this.articleId]], function (r) {
                _this.removeTag(id, sectionId);
                _this.$form.remove();
            });
        };
        LinksAdmin.prototype.linkDelete = function (e) {
            e.preventDefault();
            var id = $(e.target).data("id");
            $("#linkItem_" + id).remove();
        };
        return LinksAdmin;
    })();
    Views.LinksAdmin = LinksAdmin;
    var BlockAdmin = (function () {
        function BlockAdmin(articleId, langVersion) {
            this.articleId = articleId;
            this.langVersion = langVersion;
            this.blockTemplate = Views.ViewBase.currentView.registerTemplate("blockEdit-template");
        }
        BlockAdmin.prototype.createEditWindow = function (sectionId) {
            var _this = this;
            var $p = $("#text_" + sectionId);
            var scope = {
                text: $p.html(),
                id: sectionId
            };
            var $html = $(this.blockTemplate(scope));
            $html.find(".cancel").click(function (e) { return _this.cancel(e); });
            $html.find(".save").click(function (e) { return _this.save(e); });
            $html.find(".back").click(function (e) { return _this.moveVersion(e, +1); });
            $html.find(".forward").click(function (e) { return _this.moveVersion(e, -1); });
            $p.prepend($html);
        };
        BlockAdmin.prototype.moveVersion = function (e, direction) {
            var $btn = $(e.target);
            var id = $btn.data("id");
            var $cont = $("#edit_" + id);
            var $pos = $cont.find(".position");
            var position = parseInt($pos.val());
            position += direction;
            $pos.val(position);
            this.getVersion(id, position, function (version) {
                $cont.find(".editTxt").val(version.value);
            });
        };
        BlockAdmin.prototype.getVersion = function (id, position, callback) {
            var data = [["articleId", this.articleId], ["lang", this.langVersion], ["addId", id], ["position", position]];
            Views.ViewBase.currentView.apiGet("WikiVersion", data, function (r) {
                callback(r);
            });
        };
        BlockAdmin.prototype.cancel = function (e) {
            var $btn = $(e.target);
            var id = $btn.data("id");
            $("#edit_" + id).remove();
            $("#editSection_" + id).show();
        };
        BlockAdmin.prototype.save = function (e) {
            var $btn = $(e.target);
            var id = $btn.data("id");
            var data = {
                articleId: this.articleId,
                sectionId: id,
                language: this.langVersion,
                newText: $("#edit_" + id).find(".editTxt").val()
            };
            Views.ViewBase.currentView.apiPut("WikiUpdate", data, function (r) {
                $("#edit_" + id).remove();
                $("#text_" + id).text(data.newText);
                $("#editSection_" + id).show();
            });
        };
        BlockAdmin.prototype.createAdminLink = function ($block, id, adminType) {
            var _this = this;
            var $html = $("<a href=\"#\" id=\"editSection_" + id + "\" class=\"editSection\" data-at=\"" + adminType + "\" data-id=\"" + id + "\">edit</a>");
            $html.click(function (e) {
                e.preventDefault();
                var $edit = $(e.target);
                var id = $edit.data("id");
                var adminType = $edit.data("at");
                _this.createEditWindow(id);
                $edit.hide();
            });
            $block.children().first().append($html);
        };
        return BlockAdmin;
    })();
    Views.BlockAdmin = BlockAdmin;
})(Views || (Views = {}));
//# sourceMappingURL=WikiAdminPageView.js.map