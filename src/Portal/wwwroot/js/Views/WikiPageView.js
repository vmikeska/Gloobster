var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var LinksAdmin = (function () {
        function LinksAdmin(articleId) {
            this.articleId = articleId;
            this.linksTemplate = Views.ViewBase.currentView.registerTemplate("linkItem-template");
            this.linkItemLinkTemplate = Views.ViewBase.currentView.registerTemplate("linkItemLink-template");
        }
        LinksAdmin.prototype.createItemEditButtons = function (sectionId) {
            var _this = this;
            var $root = $("#Links_" + sectionId);
            var links = $root.find(".favItem").toArray();
            links.forEach(function (link) {
                var $link = $(link);
                var id = $link.data("id");
                var name = $link.data("name");
                var $html = $("<a href=\"#\" class=\"editLink\" data-id=\"" + id + "\">Edit</a>");
                $html.click(function (e) {
                    e.preventDefault();
                    _this.createItemEditForm(name, id, sectionId);
                });
                $link.append($html);
            });
            this.createAddNewItemButton(sectionId);
        };
        LinksAdmin.prototype.createAddNewItemButton = function (sectionId) {
            var _this = this;
            var $cont = $("#Links_" + sectionId);
            var $html = $("<a href=\"#\" data-sectionid=\"" + sectionId + "\">Add item</a>");
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
            var $root = $("#Links_" + sectionId);
            var context = { name: name, id: id };
            var $html = $(this.linksTemplate(context));
            $html.find(".cancel").click(function (e) { return _this.cancelEdit(e, sectionId); });
            $html.find(".add").click(function (e) { return _this.addLinkToItem(e, $html); });
            $html.find(".save").click(function (e) { return _this.saveItem(e, sectionId); });
            $html.find(".delete").click(function (e) { return _this.itemDelete(e); });
            $root.before($html);
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
        //private hideLinksAdmin(id, sectionId) {
        //	$(`#linksEdit_${id}`).remove();
        //	$(`#Links_${sectionId}`).find(".editLink").remove();
        //}
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
                });
            }
            else {
                Views.ViewBase.currentView.apiPut("WikiLink", data, function (r) {
                    _this.$form.remove();
                });
            }
        };
        LinksAdmin.prototype.createSingleLinkEdit = function ($cont, context) {
            var _this = this;
            var $lHtml = $(this.linkItemLinkTemplate(context));
            $lHtml.find(".delete").click(function (e) { return _this.linkDelete(e); });
            $cont.append($lHtml);
        };
        LinksAdmin.prototype.itemDelete = function (e) {
            e.preventDefault();
            var id = $(e.target).data("id");
            Views.ViewBase.currentView.apiDelete("WikiLink", [["linkId", id], ["articleId", this.articleId]], function (r) {
                $("#faviItem_" + id).remove();
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
            $html.find(".cancel").click(function (e) {
                var $btn = $(e.target);
                var id = $btn.data("id");
                $("#edit_" + id).remove();
                $("#editSection_" + id).show();
            });
            $html.find(".save").click(function (e) {
                var $btn = $(e.target);
                var id = $btn.data("id");
                var data = {
                    articleId: _this.articleId,
                    sectionId: id,
                    language: _this.langVersion,
                    newText: $("#edit_" + id).find(".editTxt").val()
                };
                Views.ViewBase.currentView.apiPut("WikiUpdate", data, function (r) {
                    $("#edit_" + id).remove();
                    $("#text_" + id).text(data.newText);
                    $("#editSection_" + id).show();
                });
            });
            $p.prepend($html);
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
    var WikiPageView = (function (_super) {
        __extends(WikiPageView, _super);
        function WikiPageView(articleId) {
            _super.call(this);
            this.isAdminMode = false;
            this.articleId = articleId;
            this.langVersion = this.getLangVersion();
            this.linksAdmin = new LinksAdmin(articleId);
            this.blockAdmin = new BlockAdmin(articleId, this.langVersion);
            this.$adminMode = $("#adminMode");
            this.regAdminMode();
            this.regRating();
        }
        WikiPageView.prototype.regRating = function () {
            var _this = this;
            $(".icon-flag").click(function (e) {
                e.preventDefault();
                $(e.target).closest('.evaluate').toggleClass('evaluate-open');
            });
            $(".icon-heart").click(function (e) {
                e.preventDefault();
                var $btn = $(e.target);
                var $cont = $btn.closest(".evaluate");
                var id = $cont.data("id");
                var data = {
                    articleId: _this.articleId,
                    sectionId: id,
                    language: _this.langVersion,
                    like: true
                };
                _this.apiPut("WikiRating", data, function (r) {
                    //$(`#edit_${id}`).remove();
                    //$(`#text_${id}`).text(data.newText);
                    //$(`#editSection_${id}`).show();
                });
            });
        };
        WikiPageView.prototype.regAdminMode = function () {
            var _this = this;
            this.$adminMode.change(function () {
                _this.isAdminMode = _this.$adminMode.prop("checked");
                _this.onAdminModeChanged();
            });
        };
        WikiPageView.prototype.getLangVersion = function () {
            var urlParams = window.location.pathname.split("/");
            return urlParams[2];
        };
        WikiPageView.prototype.onAdminModeChanged = function () {
            if (this.isAdminMode) {
                this.generateBlocks();
            }
            else {
                this.destroyBlocks();
            }
        };
        WikiPageView.prototype.generateBlocks = function () {
            var _this = this;
            var adminBlocks = $(".adminBlock").toArray();
            adminBlocks.forEach(function (block) {
                var $block = $(block);
                var id = $block.data("id");
                var adminType = $block.data("at");
                _this.drawAdminBlocks($block, id, adminType);
            });
        };
        WikiPageView.prototype.destroyBlocks = function () {
            $(".editSection").remove();
        };
        WikiPageView.prototype.drawAdminBlocks = function ($block, id, adminType) {
            var adminTypes = adminType.split(",");
            if (_.contains(adminTypes, "standard")) {
                this.blockAdmin.createAdminLink($block, id, adminType);
            }
            if (_.contains(adminTypes, "links")) {
                this.linksAdmin.createItemEditButtons(id);
            }
        };
        return WikiPageView;
    })(Views.ViewBase);
    Views.WikiPageView = WikiPageView;
})(Views || (Views = {}));
//# sourceMappingURL=WikiPageView.js.map