var __extends=this&&this.__extends||function(t,e){function i(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)},Views;!function(t){!function(t){t[t.Continent=0]="Continent",t[t.Country=1]="Country",t[t.City=2]="City"}(t.ArticleType||(t.ArticleType={}));var e=(t.ArticleType,function(t){function e(e,n){t.call(this),this.articleType=n,this.articleId=e,this.langVersion=this.getLangVersion(),this.photos=new o(e),this.rating=new r(e,this.langVersion),this.report=new i(e,this.langVersion),this.regContribute()}return __extends(e,t),e.prototype.regContribute=function(){$(".contrib-link").click(function(t){t.preventDefault();var e=$(t.target),i=e.closest(".empty-cont");if(i.length>0){var n=i.data("sid");$('.article_rating[data-id="'+n+'"]').find(".bubble").toggle()}})},e.prototype.getLangVersion=function(){var t=window.location.pathname.split("/");return t[2]},e}(t.ViewBase));t.WikiPageView=e;var i=function(){function e(t,e){var i=this;this.regToggleButton(),this.articleId=t,this.langVersion=e,this.$bubble=$(".bubble"),this.$bubble.find(".cancel").click(function(t){t.preventDefault();var e=$(t.target);i.toggleForm(e)}),this.regSend()}return e.prototype.toggleForm=function(t){t.closest(".article_rating").find(".bubble").toggle()},e.prototype.regSend=function(){var e=this;this.$bubble.find(".send").click(function(i){i.preventDefault();var n=$(i.target),r=n.closest(".article_rating"),o=n.closest(".bubble"),a={lang:e.langVersion,articleId:e.articleId,sectionId:r.data("id"),text:o.find(".txt").val()};t.ViewBase.currentView.apiPost("WikiReport",a,function(t){e.toggleForm(n)})})},e.prototype.regToggleButton=function(){var e=this;$(".icon-edit-pencil").click(function(i){if(i.preventDefault(),t.ViewBase.currentView.fullReg){var r=$(i.target);e.toggleForm(r)}else n.displayFullRegMessage()})},e}();t.Report=i;var n=function(){function e(){}return e.displayFullRegMessage=function(){var e=new Common.InfoDialog,i=t.ViewBase.currentView;e.create(i.t("FullRegTitle","jsWiki"),i.t("FullRegBody","jsWiki"))},e}();t.RegMessages=n;var r=function(){function e(t,e){this.regRating(),this.regRatingDD(),this.regRatingPrice(),this.articleId=t,this.langVersion=e}return e.prototype.getRatingDesign=function(t){var e={rstr:t,cls:""};return t>0?(e.rstr="+"+t,e.cls="plus"):e.cls="minus",e},e.prototype.regRatingDD=function(){var t=this;this.regRatingBase("pmBtn","item","WikiRating",function(e){t.setLikeDislike(e.$cont,e.like,"pmBtn")})},e.prototype.regRatingPrice=function(){var t=this;this.regRatingBase("priceBtn","rate","WikiPriceRating",function(e){t.setLikeDislike(e.$cont,e.like,"priceBtn"),e.$cont.prev().find(".price").text(e.res.toFixed(2))})},e.prototype.regRatingBase=function(e,i,r,o){var a=this;$("."+e).click(function(e){e.preventDefault();var s=$(e.target),l=s.data("like"),c=s.closest("."+i),g=c.data("id"),u={articleId:a.articleId,sectionId:g,language:a.langVersion,like:l};t.ViewBase.currentView.fullReg?t.ViewBase.currentView.apiPut(r,u,function(t){o({$cont:c,like:l,res:t})}):n.displayFullRegMessage()})},e.prototype.regRating=function(){var t=this;this.regRatingBase("ratingBtn","article_rating","WikiRating",function(e){if(t.setLikeDislike(e.$cont,e.like,"ratingBtn"),null!=e.res){var i=e.$cont.find(".score");i.removeClass("plus").removeClass("minus");var n=t.getRatingDesign(e.res);i.text(n.rstr),i.addClass(n.cls)}})},e.prototype.setLikeDislike=function(t,e,i){var n=t.find("."+i),r=n.toArray();n.removeClass("active"),r.forEach(function(t){var i=$(t),n=i.data("like");n&&e&&i.addClass("active"),n||e||i.addClass("active")})},e}();t.Rating=r;var o=function(){function e(e){this.articleId=e,$("#recommendPhoto").click(function(e){e.preventDefault(),t.ViewBase.currentView.fullReg?($("#photosForm").show(),$("#recommendPhoto").hide()):n.displayFullRegMessage()}),$("#photosForm .cancel").click(function(t){t.preventDefault(),$("#photosForm").hide(),$("#recommendPhoto").show()});var i=$("#photosForm #cid");i.change(function(t){t.preventDefault();var e=i.prop("checked");e?$(".photoButton").show():$(".photoButton").hide()}),this.registerPhotoUpload(this.articleId,"galleryInput")}return e.prototype.registerPhotoUpload=function(e,i){var n=new Common.FileUploadConfig;n.inputId=i,n.endpoint="WikiPhotoGallery";var r=new Common.FileUpload(n);r.customId=e,r.onProgressChanged=function(t){var e=$("#galleryProgress");e.show();var i=t+"%";$(".progress").css("width",i),e.find("span").text(i)},r.onUploadFinished=function(e,i){var n=$("#galleryProgress");n.hide();var r=new Common.InfoDialog,o=t.ViewBase.currentView;r.create(o.t("UploadTitle","jsWiki"),o.t("UploadBody","jsWiki"))}},e}();t.WikiPhotosUser=o}(Views||(Views={}));