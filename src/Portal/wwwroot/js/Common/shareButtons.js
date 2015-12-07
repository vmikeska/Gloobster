var Common;
(function (Common) {
    var ShareButtons = (function () {
        function ShareButtons($owner, text) {
            this.socNetworks = [
                { type: SocialNetworkType.Facebook, iconName: "facebook" },
                { type: SocialNetworkType.Twitter, iconName: "twitter" }
            ];
            this.$owner = $owner;
            this.createHtml(text);
        }
        ShareButtons.prototype.getSelectedNetworks = function () {
            var selected = [];
            this.$owner.find("img").toArray().forEach(function (i) {
                var $i = $(i);
                if ($i.hasClass("active")) {
                    selected.push(parseInt($i.data("t")));
                }
            });
            return selected;
        };
        ShareButtons.prototype.createHtml = function (text) {
            var _this = this;
            var $p = $("<p class=\"color1\">" + text + "<br/></p>");
            var isFirst = true;
            this.socNetworks.forEach(function (net) {
                var $img = _this.getItemHtml(isFirst, true, net.type);
                $p.append($img);
                isFirst = false;
            });
            this.$owner.prepend($p);
        };
        ShareButtons.prototype.getByType = function (type) {
            return _.find(this.socNetworks, function (net) { return net.type === type; });
        };
        ShareButtons.prototype.getItemHtml = function (isFirst, active, type) {
            var pos = isFirst ? "" : " mleft10";
            var act = active ? "active " : "";
            var soc = this.getByType(type);
            var $img = $("<img data-t=\"" + type + "\" class=\"" + act + "opacity5 middle" + pos + "\" src= \"../../images/share/share-" + soc.iconName + ".png\">");
            $img.click(function (e) {
                var active = $img.hasClass("active");
                if (active) {
                    $img.removeClass("active");
                }
                else {
                    $img.addClass("active");
                }
            });
            return $img;
        };
        return ShareButtons;
    })();
    Common.ShareButtons = ShareButtons;
})(Common || (Common = {}));
//# sourceMappingURL=shareButtons.js.map