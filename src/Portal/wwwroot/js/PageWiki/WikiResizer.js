var Wiki;
(function (Wiki) {
    var WikiResizer = (function () {
        function WikiResizer(v) {
            var _this = this;
            this.threshold = 830;
            this.$cont = $("#mainPageCont");
            this.$rightCont = $("#rightCont");
            this.imgRate = 350.0 / 1280.0;
            this.imageSize = 0;
            this.v = v;
            $(window).resize(function () {
                _this.set();
                _this.setImage();
            });
            this.setImage();
        }
        WikiResizer.prototype.setImage = function () {
            var width = this.getWidth();
            var newImgSize = 0;
            if (width <= 480) {
                newImgSize = 480;
            }
            else if (width <= 880) {
                newImgSize = 880;
            }
            else {
                newImgSize = 1280;
            }
            if ((newImgSize !== this.imageSize) && newImgSize > this.imageSize) {
                var height = Math.floor(newImgSize * this.imgRate);
                var url = "/picd/" + this.v.photoGID + "/wtn?maxWidth=" + newImgSize + "&maxHeight=" + height;
                $(".title-img").attr("src", url);
                this.imageSize = newImgSize;
            }
        };
        WikiResizer.prototype.set = function () {
            var width = this.getWidth();
            var layoutType = (width < this.threshold) ? Wiki.LayoutSize.Mobile : Wiki.LayoutSize.Web;
            if (this.layoutType !== layoutType) {
                if (layoutType === Wiki.LayoutSize.Web) {
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
            if (layoutType === Wiki.LayoutSize.Web) {
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
    Wiki.WikiResizer = WikiResizer;
})(Wiki || (Wiki = {}));
//# sourceMappingURL=WikiResizer.js.map