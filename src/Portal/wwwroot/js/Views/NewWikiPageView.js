var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
    (function (SectionType) {
        SectionType[SectionType["Header"] = 0] = "Header";
        SectionType[SectionType["Standard"] = 1] = "Standard";
        SectionType[SectionType["DosDonts"] = 2] = "DosDonts";
        SectionType[SectionType["Links"] = 3] = "Links";
    })(Views.SectionType || (Views.SectionType = {}));
    var SectionType = Views.SectionType;
    (function (LayoutSize) {
        LayoutSize[LayoutSize["Web"] = 0] = "Web";
        LayoutSize[LayoutSize["Mobile"] = 1] = "Mobile";
    })(Views.LayoutSize || (Views.LayoutSize = {}));
    var LayoutSize = Views.LayoutSize;
    ;
    var NewWikiPageView = (function (_super) {
        __extends(NewWikiPageView, _super);
        function NewWikiPageView(articleId, articleType) {
            _super.call(this);
            this.resizer = new WikiResizer();
            this.resizer.init();
            this.articleType = articleType;
            this.articleId = articleId;
            this.langVersion = this.getLangVersion();
            this.rating = new Rating(articleId, this.langVersion);
            this.articlePhotos = new ArticlePhotos(articleId);
            this.loadPhotos();
            this.reportWin = new ReportWindow(this.langVersion, this.articleId, this);
        }
        NewWikiPageView.prototype.loadPhotos = function () {
            this.articlePhotos.fillPhotos($("#photosCont"), 0, 9);
        };
        NewWikiPageView.prototype.getLangVersion = function () {
            var urlParams = window.location.pathname.split("/");
            return urlParams[2];
        };
        return NewWikiPageView;
    }(Views.ViewBase));
    Views.NewWikiPageView = NewWikiPageView;
    var WikiResizer = (function () {
        function WikiResizer() {
            var _this = this;
            this.threshold = 830;
            this.$cont = $("#mainPageCont");
            this.$rightCont = $("#rightCont");
            $(window).resize(function () {
                _this.set();
            });
        }
        WikiResizer.prototype.set = function () {
            var width = this.getWidth();
            var layoutType = (width < this.threshold) ? LayoutSize.Mobile : LayoutSize.Web;
            if (this.layoutType !== layoutType) {
                if (layoutType === LayoutSize.Web) {
                    this.$rightCont.append($("#lbInfoTable"));
                    this.$rightCont.append($("#lbPhotos"));
                    this.$rightCont.append($("#lbRestaurant"));
                    this.$rightCont.append($("#lbTransport"));
                    this.$rightCont.append($("#lbAccommodation"));
                    this.$rightCont.append($("#lbNightlife-Pub"));
                    this.$rightCont.append($("#lbNightlife-Bar"));
                    this.$rightCont.append($("#lbNightlife-Club"));
                }
                else {
                    var $about = this.getCatContByType("About");
                    $about.append($("#lbInfoTable"));
                    var $cPhotos = this.getCatContByType("Photos");
                    $cPhotos.append($("#lbPhotos"));
                    var $oPrices = this.getCatContByType("OtherPrices");
                    $oPrices.append($("#lbRestaurant"));
                    $oPrices.append($("#lbTransport"));
                    $oPrices.append($("#lbAccommodation"));
                    var $nPrices = this.getCatContByType("NightLifePrices");
                    $nPrices.append($("#lbNightlife-Pub"));
                    $nPrices.append($("#lbNightlife-Bar"));
                    $nPrices.append($("#lbNightlife-Club"));
                }
            }
            if (layoutType === LayoutSize.Web) {
                this.$cont.addClass("cont-wrap");
            }
            else {
                this.$cont.removeClass("cont-wrap");
            }
            this.layoutType = layoutType;
        };
        WikiResizer.prototype.getCatContByType = function (type) {
            var $cont = $(".block[data-c=\"" + type + "\"]");
            return $cont;
        };
        WikiResizer.prototype.init = function () {
            this.set();
            this.$rightCont.removeClass("hidden");
        };
        WikiResizer.prototype.getWidth = function () {
            var width = $(window).width();
            return width;
        };
        return WikiResizer;
    }());
    Views.WikiResizer = WikiResizer;
    var NewWikiAdminPageView = (function (_super) {
        __extends(NewWikiAdminPageView, _super);
        function NewWikiAdminPageView(articleId, articleType) {
            _super.call(this, articleId, articleType);
            this.$adminMode = $("#adminMode");
            this.isAdminMode = false;
            this.standardBlockAdmin = new BlockAdmin(articleId, this.langVersion);
            this.doDontAdmin = new DoDontAdmin(articleId, this.langVersion);
            this.priceAdmin = new PriceAdmin(articleId);
            this.linksAdmin = new LinksAdmin(articleId);
            this.regAdminMode();
        }
        NewWikiAdminPageView.prototype.regAdminMode = function () {
            var _this = this;
            this.$adminMode.change(function () {
                _this.isAdminMode = _this.$adminMode.prop("checked");
                _this.onAdminModeChanged();
            });
        };
        NewWikiAdminPageView.prototype.onAdminModeChanged = function () {
            if (this.isAdminMode) {
                this.generateBlocks();
            }
            else {
                this.destroyBlocks();
            }
        };
        NewWikiAdminPageView.prototype.generateBlocks = function () {
            this.standardBlockAdmin.generateAdmin();
            this.doDontAdmin.generateAdmin();
            this.priceAdmin.generateAdmin();
            this.linksAdmin.addLinks();
        };
        NewWikiAdminPageView.prototype.destroyBlocks = function () {
            this.linksAdmin.clean();
            this.priceAdmin.clean();
            this.doDontAdmin.clean();
            this.standardBlockAdmin.clean();
        };
        return NewWikiAdminPageView;
    }(NewWikiPageView));
    Views.NewWikiAdminPageView = NewWikiAdminPageView;
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
    var ArticlePhotos = (function () {
        function ArticlePhotos(articleId) {
            var _this = this;
            this.articleId = articleId;
            $("#openPhotoDialog").click(function (e) {
                _this.showPhotoUploadDialog(null);
            });
        }
        ArticlePhotos.prototype.getThumbs = function (layoutSize, photosLimit, callback) {
            var data = [["articleId", this.articleId], ["layoutSize", layoutSize.toString()], ["photosLimit", photosLimit.toString()]];
            Views.ViewBase.currentView.apiGet("WikiPhotoThumbnails", data, function (photos) {
                callback(photos);
            });
        };
        ArticlePhotos.prototype.fillPhotos = function ($cont, layoutSize, photosLimit) {
            var _this = this;
            this.getThumbs(layoutSize, photosLimit, function (photos) {
                photos.forEach(function (p) {
                    var link = "/Wiki/ArticlePhoto?photoId=" + p.photoId + "&articleId=" + _this.articleId;
                    var $img = $("<a class=\"photo-link\" href=\"" + link + "\" target=\"_blank\"><img src=\"data:image/jpeg;base64," + p.data + "\" /></a>");
                    $cont.append($img);
                });
            });
        };
        ArticlePhotos.prototype.showPhotoUploadDialog = function (sectionId) {
            var cd = new Common.CustomDialog();
            var t = Views.ViewBase.currentView.registerTemplate("photo-upload-dlg-template");
            var $t = $(t());
            cd.init($t, "Upload a photo");
            cd.addBtn("Close", "yellow-orange", function () {
                cd.close();
            });
            this.registerPhotoUpload(this.articleId, "addUserPhoto", sectionId, function () {
                cd.close();
            });
        };
        ArticlePhotos.prototype.registerPhotoUpload = function (articleId, inputId, sectionId, callback) {
            var config = new Common.FileUploadConfig();
            config.inputId = inputId;
            config.endpoint = "WikiPhotoGallery";
            var pu = new Common.FileUpload(config);
            pu.customId = articleId;
            if (sectionId) {
                pu.customId += "," + sectionId;
            }
            var ud = null;
            pu.onProgressChanged = function (percent) {
                if (ud === null) {
                    ud = new Common.UploadDialog();
                    ud.create();
                }
                ud.update(percent);
            };
            pu.onUploadFinished = function (file, fileId) {
                var $pb = $("#galleryProgress");
                $pb.hide();
                var id = new Common.InfoDialog();
                var v = Views.ViewBase.currentView;
                id.create(v.t("UploadTitle", "jsWiki"), v.t("UploadBody", "jsWiki"));
                if (ud) {
                    ud.destroy();
                }
                callback();
            };
        };
        return ArticlePhotos;
    }());
    Views.ArticlePhotos = ArticlePhotos;
    var ReportWindow = (function () {
        function ReportWindow(langVersion, articleId, v) {
            this.langVersion = langVersion;
            this.articleId = articleId;
            this.v = v;
            this.registerBtnEvent();
        }
        ReportWindow.prototype.registerBtnEvent = function () {
            var _this = this;
            $(".article-rating-all .report-btn").click(function (e) {
                e.preventDefault();
                var $t = $(e.target);
                var $p = $t.closest(".article-rating");
                var sectionId = $p.data("id");
                _this.createWindow(sectionId);
            });
        };
        ReportWindow.prototype.createWindow = function (sectionId) {
            var _this = this;
            var cd = new Common.CustomDialog();
            var t = this.v.registerTemplate("block-report-tmp");
            var $html = $(t());
            $html.find("#uploadSectionPhoto").click(function (e) {
                e.preventDefault();
                _this.v.articlePhotos.showPhotoUploadDialog(sectionId);
            });
            cd.init($html, this.v.t("ReportText", "jsWiki"));
            cd.addBtn(this.v.t("Cancel", "jsLayout"), "red-orange", function () {
                cd.close();
            });
            cd.addBtn(this.v.t("ReportSend", "jsWiki"), "green-orange", function () {
                var txt = $html.find(".txt-area").val();
                _this.sendReport(sectionId, txt, function () {
                    cd.close();
                });
            });
        };
        ReportWindow.prototype.sendReport = function (sectionId, txt, callback) {
            var _this = this;
            var data = {
                lang: this.langVersion,
                articleId: this.articleId,
                sectionId: sectionId,
                text: txt
            };
            this.v.apiPost("WikiReport", data, function (r) {
                var id = new Common.InfoDialog();
                id.create(_this.v.t("ContributionThanksTitle", "jsWiki"), _this.v.t("ContributionThanksBody", "jsWiki"));
                callback();
            });
        };
        return ReportWindow;
    }());
    Views.ReportWindow = ReportWindow;
    var Rating = (function () {
        function Rating(articleId, langVersion) {
            this.regRating();
            this.regRatingDD();
            this.regRatingPrice();
            this.articleId = articleId;
            this.langVersion = langVersion;
        }
        Rating.prototype.getRatingDesign = function (rating) {
            var res = {
                rstr: rating,
                cls: ""
            };
            if (rating > 0) {
                res.rstr = "+" + rating;
                res.cls = "plus";
            }
            else {
                res.cls = "minus";
            }
            return res;
        };
        Rating.prototype.regRatingDD = function () {
            var _this = this;
            this.regRatingBase("pmBtn", "item", "WikiRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, "pmBtn");
            });
        };
        Rating.prototype.regRatingPrice = function () {
            var _this = this;
            this.regRatingBase("priceBtn", "rate", "WikiPriceRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, "priceBtn");
                c.$cont.prev().find(".price").text(c.res.toFixed(2));
            });
        };
        Rating.prototype.regRatingBase = function (btnClass, contClass, endpoint, callback) {
            var _this = this;
            $("." + btnClass).click(function (e) {
                e.preventDefault();
                var $btn = $(e.target);
                var like = $btn.data("like");
                var $cont = $btn.closest("." + contClass);
                var id = $cont.data("id");
                var data = {
                    articleId: _this.articleId,
                    sectionId: id,
                    language: _this.langVersion,
                    like: like
                };
                if (Views.ViewBase.currentView.fullReg) {
                    Views.ViewBase.currentView.apiPut(endpoint, data, function (r) {
                        callback({ $cont: $cont, like: like, res: r });
                    });
                }
                else {
                    RegMessages.displayFullRegMessage();
                }
            });
        };
        Rating.prototype.regRating = function () {
            var _this = this;
            this.regRatingBase("ratingBtn", "article-rating", "WikiRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, "ratingBtn");
                if (c.res != null) {
                    var $r = c.$cont.find(".score");
                    $r.removeClass("plus").removeClass("minus");
                    var d = _this.getRatingDesign(c.res);
                    $r.text(d.rstr);
                    $r.addClass(d.cls);
                }
            });
        };
        Rating.prototype.setLikeDislike = function ($cont, state, btnClass) {
            var $btns = $cont.find("." + btnClass);
            var btns = $btns.toArray();
            $btns.removeClass("active");
            btns.forEach(function (btn) {
                var $btn = $(btn);
                var isLike = $btn.data("like");
                if (isLike && state) {
                    $btn.addClass("active");
                }
                if (!isLike && !state) {
                    $btn.addClass("active");
                }
            });
        };
        return Rating;
    }());
    Views.Rating = Rating;
    var RegMessages = (function () {
        function RegMessages() {
        }
        RegMessages.displayFullRegMessage = function () {
            var id = new Common.InfoDialog();
            var v = Views.ViewBase.currentView;
            id.create(v.t("FullRegTitle", "jsWiki"), v.t("FullRegBody", "jsWiki"));
        };
        return RegMessages;
    }());
    Views.RegMessages = RegMessages;
})(Views || (Views = {}));
//# sourceMappingURL=NewWikiPageView.js.map