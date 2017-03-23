var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    var WikiAdminPageView = (function (_super) {
        __extends(WikiAdminPageView, _super);
        function WikiAdminPageView(articleId, articleType, photoGID) {
            _super.call(this, articleId, articleType, photoGID);
            this.$adminMode = $("#adminMode");
            this.isAdminMode = false;
            this.standardBlockAdmin = new BlockAdmin(articleId, this.langVersion);
            this.doDontAdmin = new DoDontAdmin(articleId, this.langVersion);
            this.priceAdmin = new PriceAdmin(articleId);
            this.linksAdmin = new LinksAdmin(articleId);
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
            this.standardBlockAdmin.generateAdmin();
            this.doDontAdmin.generateAdmin();
            this.priceAdmin.generateAdmin();
            this.linksAdmin.addLinks();
        };
        WikiAdminPageView.prototype.destroyBlocks = function () {
            this.linksAdmin.clean();
            this.priceAdmin.clean();
            this.doDontAdmin.clean();
            this.standardBlockAdmin.clean();
        };
        return WikiAdminPageView;
    }(Views.WikiPageView));
    Views.WikiAdminPageView = WikiAdminPageView;
    var LinksAdmin = (function () {
        function LinksAdmin(articleId) {
            this.articleId = articleId;
        }
        Object.defineProperty(LinksAdmin.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        LinksAdmin.prototype.clean = function () {
            $(".links-admin-btn").remove();
            this.removeEditLinks();
        };
        LinksAdmin.prototype.addLinks = function () {
            var _this = this;
            var $links = $(".adminable-links");
            $links.each(function (i, linkBlock) {
                var $lb = $(linkBlock);
                _this.addAdminBtn($lb);
            });
            this.refreshEditButtons();
        };
        LinksAdmin.prototype.addAdminBtn = function ($linkBlock) {
            var _this = this;
            var $cont = $linkBlock.find(".admin-btn-cont");
            var $btn = $("<a class=\"lbtn2 red-orange links-admin-btn\" href=\"#\"> Add item</a>");
            $cont.append($btn);
            $btn.click(function (e) {
                e.preventDefault();
                var category = $linkBlock.data("c");
                _this.createMainWindow(null, category);
            });
        };
        LinksAdmin.prototype.createMainWindow = function (id, category) {
            var _this = this;
            var isEdit = id !== null;
            var t = this.v.registerTemplate("links-item-admin-template");
            var $t = $(t());
            var cd = new Common.CustomDialog();
            cd.init($t, "Add link item");
            $t.find("#addSocLink").click(function (e) {
                e.preventDefault();
                _this.createSocLinkWindow($t);
            });
            cd.addBtn("Cancel", "yellow-orange", function () {
                cd.close();
            });
            if (isEdit) {
                cd.addBtn("Delete", "red-orange", function () {
                    _this.itemDelete(id, function () {
                        var $fid = $("#faviItem_" + id);
                        $fid.remove();
                        cd.close();
                    });
                });
                var $fi = $("#faviItem_" + id);
                $t.find("#linkName").val($fi.data("name"));
                var $icoLinks = $fi.find(".ico-link");
                $icoLinks.each(function (i, socLink) {
                    var $socLink = $(socLink);
                    var t = $socLink.data("t");
                    var sid = $socLink.data("sid");
                    _this.addSocLink(t, sid, $t);
                });
            }
            cd.addBtn("Save", "green-orange", function () {
                _this.save($t, id, category, function () {
                    cd.close();
                });
            });
        };
        LinksAdmin.prototype.showInvalid = function () {
            var id = new Common.InfoDialog();
            id.create("Incomplete", "Name and at least one link has to be created");
        };
        LinksAdmin.prototype.save = function ($t, id, category, callback) {
            var _this = this;
            var name = $t.find("#linkName").val();
            if (name.length === 0) {
                this.showInvalid();
                return;
            }
            var data = {
                linkId: id,
                articleId: this.articleId,
                name: name,
                category: category,
                socLinks: []
            };
            var $socLinksRoot = $t.find(".soc-links-list");
            var $socLinks = $socLinksRoot.find(".soc-link-admin");
            $socLinks.each(function (i, socLink) {
                var $socLink = $(socLink);
                var linkReq = {
                    socNetType: $socLink.data("value"),
                    sid: $socLink.data("sid"),
                    id: $socLink.data("id")
                };
                data.socLinks.push(linkReq);
            });
            if (data.socLinks.length === 0) {
                this.showInvalid();
                return;
            }
            if (id === null) {
                Views.ViewBase.currentView.apiPost("WikiLink", data, function (newItem) {
                    var sls = _this.mapsSocLinks(data.socLinks);
                    _this.createNewItem(newItem.id, name, sls, category);
                    _this.refreshEditButtons();
                    callback();
                });
            }
            else {
                Views.ViewBase.currentView.apiPut("WikiLink", data, function (newItem) {
                    var sls = _this.mapsSocLinks(data.socLinks);
                    $("#faviItem_" + id).remove();
                    _this.createNewItem(id, name, sls, category);
                    _this.refreshEditButtons();
                    callback();
                });
            }
        };
        LinksAdmin.prototype.mapsSocLinks = function (socLinks) {
            var _this = this;
            var sls = _.map(socLinks, function (sl) {
                return {
                    link: _this.getLink(sl.socNetType, sl.sid),
                    ico: _this.getLinkIco(sl.socNetType),
                    sid: sl.sid,
                    type: sl.socNetType
                };
            });
            return sls;
        };
        LinksAdmin.prototype.createSocLinkWindow = function ($mainWin) {
            var _this = this;
            var t = this.v.registerTemplate("links-soc-link-admin-template");
            var $t = $(t());
            Common.DropDown.registerDropDown($t.find(".dropdown"));
            var cd = new Common.CustomDialog();
            cd.init($t, "Add social link");
            cd.addBtn("Add", "green-orange", function () {
                var val = parseInt($t.find(".selectedValue").val());
                var sid = $t.find(".linkId").val();
                _this.addSocLink(val, sid, $mainWin);
                cd.close();
            });
            cd.addBtn("Cancel", "yellow-orange", function () {
                cd.close();
            });
        };
        LinksAdmin.prototype.addSocLink = function (val, sid, $mainWin) {
            var _this = this;
            var t = this.v.registerTemplate("soc-link-item-template");
            var context = {
                val: val,
                sid: sid,
                icon: this.getLinkIco(val),
                link: this.getLink(val, sid)
            };
            var $t = $(t(context));
            $t.find(".del").click(function (e) {
                e.preventDefault();
                $t.remove();
                _this.linksChanged($mainWin);
            });
            var $cont = $mainWin.find(".soc-links-list");
            $cont.append($t);
            this.linksChanged($mainWin);
        };
        LinksAdmin.prototype.linksChanged = function ($mainWin) {
            var $cont = $mainWin.find(".soc-links-list");
            var visible = $cont.find(".soc-link-admin").length === 0;
            $mainWin.find(".no-links").toggle(visible);
        };
        LinksAdmin.prototype.getLinkIco = function (t) {
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
        LinksAdmin.prototype.createNewItem = function (id, name, socLinks, category) {
            var context = {
                id: id,
                name: name,
                socLinks: socLinks,
            };
            var t = this.v.registerTemplate("new-link-template");
            var $t = $(t(context));
            var $cont = $(".links-cont[data-category=\"" + category + "\"]");
            $cont.find(".empty-cont").remove();
            $cont.append($t);
        };
        LinksAdmin.prototype.removeEditLinks = function () {
            var $favItems = $(".block-links .fav-item");
            $favItems.find(".editLink").remove();
        };
        LinksAdmin.prototype.refreshEditButtons = function () {
            var _this = this;
            this.removeEditLinks();
            var $favItems = $(".block-links .fav-item");
            $favItems.each(function (i, item) {
                var $item = $(item);
                var id = $item.data("id");
                var $btn = $("<a href=\"#\" class=\"lbtn2 yellow-orange editLink\" data-id=\"" + id + "\">Edit</a>");
                $item.find(".name").before($btn);
                $btn.click(function (e) {
                    e.preventDefault();
                    var category = $item.closest(".block-links").data("c");
                    _this.createMainWindow(id, category);
                });
            });
        };
        LinksAdmin.prototype.itemDelete = function (linkId, callback) {
            Views.ViewBase.currentView.apiDelete("WikiLink", [["linkId", linkId], ["articleId", this.articleId]], function (r) {
                callback();
            });
        };
        return LinksAdmin;
    }());
    Views.LinksAdmin = LinksAdmin;
    var PriceAdmin = (function () {
        function PriceAdmin(articleId) {
            this.articleId = articleId;
        }
        Object.defineProperty(PriceAdmin.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        PriceAdmin.prototype.generateAdmin = function () {
            var _this = this;
            var $tds = $(".price-item-admin");
            var tds = $tds.toArray();
            tds.forEach(function (td) { return _this.generateAdminItem(td); });
        };
        PriceAdmin.prototype.clean = function () {
            $(".price-edit").remove();
        };
        PriceAdmin.prototype.generateAdminItem = function (td) {
            var $td = $(td);
            var id = $td.data("id");
            $td.append(this.getEditButton(id));
        };
        PriceAdmin.prototype.getEditButton = function (id) {
            var _this = this;
            var $edit = $("<a href=\"#\" class=\"lbtn2 red-orange price-edit\" data-id=\"" + id + "\">Edit</a>");
            $edit.click(function (e) {
                e.preventDefault();
                var $target = $(e.target);
                _this.$edited = $target.closest(".price-item-admin");
                var price = _this.$edited.find(".price").text();
                _this.edit(id, price);
            });
            return $edit;
        };
        PriceAdmin.prototype.edit = function (id, price) {
            var _this = this;
            var context = {
                id: id,
                price: price
            };
            var t = this.v.registerTemplate("price-edit-template");
            var $t = $(t(context));
            var cd = new Common.CustomDialog();
            cd.init($t, "Reset price");
            cd.addBtn("Reset price", "green-orange", function () {
                var newPrice = $t.find("input").val();
                _this.save(id, newPrice, function () {
                    _this.$edited.find(".price").text(newPrice);
                    cd.close();
                });
            });
        };
        PriceAdmin.prototype.save = function (id, price, callback) {
            var parsedVal = parseFloat(price);
            if (parsedVal) {
                var data = {
                    articleId: this.articleId,
                    price: parsedVal,
                    priceId: id
                };
                Views.ViewBase.currentView.apiPut("WikiPrice", data, function (r) {
                    callback();
                });
            }
            else {
                var ind = new Common.InfoDialog();
                ind.create("Invalid float", "must be an int or float");
            }
        };
        return PriceAdmin;
    }());
    Views.PriceAdmin = PriceAdmin;
    var DoDontAdmin = (function () {
        function DoDontAdmin(articleId, lang) {
            this.articleId = articleId;
            this.language = lang;
            this.$cont = $(".doDont");
            this.itemTemplate = Views.ViewBase.currentView.registerTemplate("doDontItem-template");
        }
        Object.defineProperty(DoDontAdmin.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        DoDontAdmin.prototype.clean = function () {
            $(".ddEditButton").remove();
            $(".doDontAdder").remove();
        };
        DoDontAdmin.prototype.generateAdmin = function () {
            var _this = this;
            var $items = this.$cont.find(".item");
            var items = $items.toArray();
            items.forEach(function (item) {
                var $item = $(item);
                var id = $item.data("id");
                var $html = _this.editButton(id);
                $item.append($html);
            });
            $(".admindo").after(this.generateAdder("do"));
            $(".admindont").after(this.generateAdder("dont"));
        };
        DoDontAdmin.prototype.generateDialog = function (id) {
            var _this = this;
            var isEdit = id !== null;
            var t = this.v.registerTemplate("do-dont-admin-tmp");
            var context = {
                txt: ""
            };
            var $t = $(t(context));
            var cd = new Common.CustomDialog();
            cd.init($t, "Do/Dont's management");
            this.$lastTextarea = $t.find("#doDontTxt");
            if (isEdit) {
                var curTxt = $("#ddi_" + id).find(".txt").html();
                this.$lastTextarea.val(curTxt);
            }
            cd.addBtn("Save", "green-orange", function () {
                var txt = _this.$lastTextarea.val();
                if (isEdit) {
                    _this.save(id, txt, function () {
                        cd.close();
                    });
                }
                else {
                    _this.saveNew(txt, function () {
                        cd.close();
                    });
                }
            });
            cd.addBtn("Cancel", "yellow-orange", function () {
                cd.close();
            });
            if (isEdit) {
                cd.addBtn("Delete", "red-orange", function () {
                    _this.delete(id);
                    cd.close();
                });
            }
        };
        DoDontAdmin.prototype.editButton = function (id) {
            var _this = this;
            var $html = $("<a class=\"lbtn2 red-orange ddEditButton\" href=\"#\" data-id=\"" + id + "\">edit</a>");
            $html.click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var $block = $t.closest(".dd-block");
                _this.lastType = $block.data("t");
                _this.generateDialog(id);
            });
            return $html;
        };
        DoDontAdmin.prototype.generateAdder = function (type) {
            var _this = this;
            var $html = $("<a href=\"#\" class=\"lbtn2 red-orange doDontAdder\" data-type=\"" + type + "\">Add new</a>");
            $html.click(function (e) {
                e.preventDefault();
                _this.lastType = type;
                _this.generateDialog(null);
            });
            return $html;
        };
        DoDontAdmin.prototype.saveNew = function (txt, callback) {
            var _this = this;
            var data = {
                articleId: this.articleId,
                language: this.language,
                text: txt,
                type: this.lastType
            };
            Views.ViewBase.currentView.apiPost("WikiDoDont", data, function (r) {
                var plusMinus = _this.lastType === "do" ? "plus" : "minus";
                var context = { id: r, text: txt, plusMinus: plusMinus };
                var $i = $(_this.itemTemplate(context));
                var $editBtn = _this.editButton(context.id);
                $i.append($editBtn);
                var $cont = $(".dd-block[data-t=\"" + _this.lastType + "\"]").find(".inner");
                $cont.find(".empty-block").remove();
                $cont.append($i);
                callback();
            });
        };
        DoDontAdmin.prototype.delete = function (id) {
            var data = [["articleId", this.articleId], ["id", id], ["type", this.lastType]];
            Views.ViewBase.currentView.apiDelete("WikiDoDont", data, function (r) {
                $("#ddi_" + id).remove();
            });
        };
        DoDontAdmin.prototype.save = function (id, txt, callback) {
            var data = {
                articleId: this.articleId,
                language: this.language,
                id: id,
                text: txt,
                type: this.lastType
            };
            Views.ViewBase.currentView.apiPut("WikiDoDont", data, function (r) {
                $("#ddi_" + id).find(".txt").html(txt);
                callback();
            });
        };
        return DoDontAdmin;
    }());
    Views.DoDontAdmin = DoDontAdmin;
    var BlockAdmin = (function () {
        function BlockAdmin(articleId, langVersion) {
            this.lastPosition = 0;
            this.articleId = articleId;
            this.langVersion = langVersion;
        }
        Object.defineProperty(BlockAdmin.prototype, "v", {
            get: function () {
                return Views.ViewBase.currentView;
            },
            enumerable: true,
            configurable: true
        });
        BlockAdmin.prototype.clean = function () {
            $(".edit-section").remove();
        };
        BlockAdmin.prototype.generateAdmin = function () {
            var _this = this;
            var adminBlocks = $(".adminable-block").toArray();
            adminBlocks.forEach(function (block) {
                var $block = $(block);
                var id = $block.data("id");
                var sectionType = $block.data("at");
                _this.createAdminLink($block, id);
            });
        };
        BlockAdmin.prototype.createEditWindow = function (sectionId) {
            var _this = this;
            this.lastPosition = 0;
            var $block = $(".block[data-id=\"" + sectionId + "\"]");
            this.$lastSectionTxt = $block.find(".text");
            var origTxt = this.$lastSectionTxt.html();
            var cd = new Common.CustomDialog();
            var context = {
                txt: origTxt
            };
            var t = this.v.registerTemplate("block-report-admin-tmp");
            var $tmp = $(t(context));
            cd.init($tmp, "Paragraph administration edit");
            this.$lastTextEdit = $("#newSectText");
            cd.addBtn("Cancel", "red-orange", function () {
                cd.close();
            });
            cd.addBtn("Save", "green-orange", function () {
                var newText = _this.$lastTextEdit.val();
                _this.save(sectionId, newText, function () {
                    _this.$lastSectionTxt.html(newText);
                    cd.close();
                });
            });
            cd.addBtn("<<", "blue-yellow", function () {
                _this.moveVersion(sectionId, +1);
            });
            cd.addBtn(">>", "blue-yellow", function () {
                _this.moveVersion(sectionId, -1);
            });
        };
        BlockAdmin.prototype.moveVersion = function (sectionId, direction) {
            var _this = this;
            this.lastPosition += direction;
            this.getVersion(sectionId, this.lastPosition, function (txt) {
                _this.$lastTextEdit.val(txt.value);
            });
        };
        BlockAdmin.prototype.getVersion = function (id, position, callback) {
            var data = [["articleId", this.articleId], ["lang", this.langVersion], ["addId", id], ["position", position]];
            Views.ViewBase.currentView.apiGet("WikiVersion", data, function (r) {
                callback(r);
            });
        };
        BlockAdmin.prototype.save = function (sectionId, newText, callback) {
            var data = {
                articleId: this.articleId,
                sectionId: sectionId,
                language: this.langVersion,
                newText: newText
            };
            Views.ViewBase.currentView.apiPut("WikiUpdate", data, function (r) {
                callback();
            });
        };
        BlockAdmin.prototype.createAdminLink = function ($block, id) {
            var _this = this;
            var $html = $("<a href=\"#\" id=\"editSection_" + id + "\" class=\"lbtn2 red-orange edit-section\" data-id=\"" + id + "\">edit</a>");
            $html.click(function (e) {
                e.preventDefault();
                var $edit = $(e.target);
                var id = $edit.data("id");
                _this.createEditWindow(id);
            });
            $block.find(".admin-btn-cont").html($html);
        };
        return BlockAdmin;
    }());
    Views.BlockAdmin = BlockAdmin;
})(Views || (Views = {}));
//# sourceMappingURL=WikiAdminPageView.js.map