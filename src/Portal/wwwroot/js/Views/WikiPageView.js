var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Views;
(function (Views) {
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
                    _this.$edited.find(".price").text(parsedVal);
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
    var Rating = (function () {
        function Rating(articleId, langVersion) {
            this.regReport();
            this.regRating();
            this.regRatingDD();
            this.regRatingPrice();
            this.articleId = articleId;
            this.langVersion = langVersion;
        }
        Rating.prototype.regReport = function () {
            $(".icon-flag").click(function (e) {
                e.preventDefault();
                $(e.target).closest('.evaluate').toggleClass('evaluate-open');
            });
        };
        Rating.prototype.regRatingDD = function () {
            var _this = this;
            this.regRatingBase("pmBtn", "place", "WikiRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, !c.like, "pmBtn", "icon-plus", "icon-minus");
            });
        };
        Rating.prototype.regRatingPrice = function () {
            var _this = this;
            this.regRatingBase("priceBtn", "priceItemAdmin", "WikiPriceRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, !c.like, "priceBtn", "icon-plus", "icon-minus");
                c.$cont.find(".price").text(c.res);
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
                Views.ViewBase.currentView.apiPut(endpoint, data, function (r) {
                    callback({ $cont: $cont, like: like, res: r });
                });
            });
        };
        Rating.prototype.regRating = function () {
            var _this = this;
            this.regRatingBase("ratingBtn", "evaluate", "WikiRating", function (c) {
                _this.setLikeDislike(c.$cont, c.like, !c.like, "ratingBtn", "icon-heart", "icon-nosmile");
            });
        };
        Rating.prototype.setLikeDislike = function ($cont, like, dislike, btnClass, likeClass, dislikeClass) {
            var $btns = $cont.find("." + btnClass);
            var btns = $btns.toArray();
            btns.forEach(function (btn) {
                var $btn = $(btn);
                var isLike = $btn.data("like");
                if (isLike) {
                    var lc = likeClass + "Red";
                    $btn.removeClass(likeClass);
                    $btn.removeClass(lc);
                    $btn.addClass(like ? lc : likeClass);
                }
                else {
                    var dc = dislikeClass + "Red";
                    $btn.removeClass(dislikeClass);
                    $btn.removeClass(dc);
                    $btn.addClass(dislike ? dc : dislikeClass);
                }
            });
        };
        return Rating;
    })();
    Views.Rating = Rating;
    var PhotosAdmin = (function () {
        function PhotosAdmin(articleId) {
            this.articleId = articleId;
            this.adminTemplate = Views.ViewBase.currentView.registerTemplate("photosAdmin-template");
            this.$cont = $("#photos");
        }
        PhotosAdmin.prototype.createAdmin = function () {
            this.$cont.before(this.adminTemplate());
            this.registerPhotoUpload(this.articleId, "galleryPhotoInput");
            this.showPhotos(true);
            this.addActions();
        };
        PhotosAdmin.prototype.clean = function () {
            this.$cont.find(".delete").remove();
            this.$cont.find(".confirm").remove();
        };
        PhotosAdmin.prototype.addActions = function () {
            var _this = this;
            var $photos = this.$cont.find(".cell");
            var photos = $photos.toArray();
            photos.forEach(function (photo) {
                var $photo = $(photo);
                var $del = $("<a href=\"#\" class=\"delete\">Delete</a> &nbsp;&nbsp;");
                $del.click(function (e) {
                    e.preventDefault();
                    var confirmDialog = new Common.ConfirmDialog();
                    confirmDialog.create("Delete", "Do you want to permanently delete this photo ?", "Cancel", "Ok", function ($dialog) {
                        var photoId = $photo.attr("id");
                        Views.ViewBase.currentView.apiDelete("WikiPhotoGallery", [["articleId", _this.articleId], ["photoId", photoId]], function (r) {
                            $dialog.remove();
                            $photo.remove();
                        });
                    });
                });
                $photo.prepend($del);
                if ($photo.hasClass("unconfirmedPhoto")) {
                    var $conf = $("<a href=\"#\" class=\"confirm\">Confirm</a> &nbsp;&nbsp;");
                    $conf.click(function (e) {
                        e.preventDefault();
                        var photoId = $photo.attr("id");
                        var data = {
                            articleId: _this.articleId,
                            photoId: photoId
                        };
                        Views.ViewBase.currentView.apiPut("WikiPhotoGallery", data, function (r) {
                            $conf.remove();
                        });
                    });
                    $photo.prepend($conf);
                }
            });
        };
        PhotosAdmin.prototype.showPhotos = function (show) {
            var ps = $(".unconfirmedPhoto");
            if (show) {
                ps.show();
            }
            else {
                ps.hide();
            }
        };
        PhotosAdmin.prototype.registerPhotoUpload = function (articleId, inputId) {
            var _this = this;
            var config = new Common.FileUploadConfig();
            config.inputId = inputId;
            config.endpoint = "WikiPhotoGallery";
            var picUpload = new Common.FileUpload(config);
            picUpload.customId = articleId;
            picUpload.onProgressChanged = function (percent) {
            };
            picUpload.onUploadFinished = function (file, fileId) {
                _this.addPhotoToPage(fileId, articleId);
            };
        };
        PhotosAdmin.prototype.addPhotoToPage = function (photoId, articleId) {
            var thumbLink = "/Wiki/ArticlePhotoThumb?photoId=" + photoId + "&articleId=" + articleId;
            var link = "/Wiki/ArticlePhoto?photoId=" + photoId + "&articleId=" + articleId;
            var photo = "<div class=\"cell\"><a href=\"" + link + "\" target=\"_blank\"> <img class=\"radius mhalf\" src=\"" + thumbLink + "\"></a></div>";
            var lastFrame = $("#photos").find(".table").last();
            var cellsCnt = lastFrame.find(".cell").length;
            if (cellsCnt < 3) {
                lastFrame.append(photo);
            }
            else {
                var $frame = $("<div class=\"table row col3 margin\">" + photo + "</div>");
                lastFrame.after($frame);
            }
        };
        return PhotosAdmin;
    })();
    Views.PhotosAdmin = PhotosAdmin;
    var WikiPhotosUser = (function () {
        function WikiPhotosUser(articleId) {
            this.articleId = articleId;
            $("#recommendPhoto").click(function (e) {
                e.preventDefault();
                $("#photosForm").show();
                $("#recommendPhoto").hide();
            });
            $("#photosForm .cancel").click(function (e) {
                e.preventDefault();
                $("#photosForm").hide();
                $("#recommendPhoto").show();
            });
            var $terms = $("#photosForm #cid");
            $terms.change(function (e) {
                e.preventDefault();
                var checked = $terms.prop("checked");
                if (checked) {
                    $(".photoButton").show();
                }
                else {
                    $(".photoButton").hide();
                }
            });
            this.registerPhotoUpload(this.articleId, "galleryInput");
        }
        WikiPhotosUser.prototype.registerPhotoUpload = function (articleId, inputId) {
            var config = new Common.FileUploadConfig();
            config.inputId = inputId;
            config.endpoint = "WikiPhotoGallery";
            var picUpload = new Common.FileUpload(config);
            picUpload.customId = articleId;
            picUpload.onProgressChanged = function (percent) {
            };
            picUpload.onUploadFinished = function (file, fileId) {
                alert("Thank you, photo was uploaded! Will be displayed when one of our Admins validate the photo.");
            };
        };
        return WikiPhotosUser;
    })();
    Views.WikiPhotosUser = WikiPhotosUser;
    var WikiPageView = (function (_super) {
        __extends(WikiPageView, _super);
        function WikiPageView(articleId) {
            _super.call(this);
            this.isAdminMode = false;
            this.articleId = articleId;
            this.langVersion = this.getLangVersion();
            this.linksAdmin = new LinksAdmin(articleId);
            this.blockAdmin = new BlockAdmin(articleId, this.langVersion);
            this.doDontAdmin = new DoDontAdmin(articleId, this.langVersion);
            this.priceAdmin = new PriceAdmin(articleId);
            this.photoAdmin = new PhotoAdmin(articleId);
            this.photosAdmin = new PhotosAdmin(articleId);
            this.photos = new WikiPhotosUser(articleId);
            this.rating = new Rating(articleId, this.langVersion);
            this.$adminMode = $("#adminMode");
            this.regAdminMode();
        }
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
            this.doDontAdmin.generateAdmin();
            this.priceAdmin.generateAdmin();
            this.photoAdmin.generateAdmin();
            this.photosAdmin.createAdmin();
        };
        WikiPageView.prototype.destroyBlocks = function () {
            $(".editSection").remove();
            this.linksAdmin.removeAdminLinks();
            this.priceAdmin.clean();
            this.doDontAdmin.clean();
            this.photoAdmin.clean();
            this.photosAdmin.clean();
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