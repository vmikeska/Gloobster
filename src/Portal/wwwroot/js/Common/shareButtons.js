var Common;
(function (Common) {
    var ShareButtons = (function () {
        function ShareButtons($owner) {
            this.socNetworks = [
                { type: SocialNetworkType.Facebook, iconName: "facebook" },
                { type: SocialNetworkType.Twitter, iconName: "twitter" }
            ];
            this.activeTag = '<span class="icon-visited"></span>';
            this.$owner = $owner;
            this.createHtml();
        }
        ShareButtons.prototype.getSelectedNetworks = function () {
            var _this = this;
            var selected = [];
            this.$owner.find("div").toArray().forEach(function (div) {
                var $div = $(div);
                if (_this.isActive($div)) {
                    selected.push(parseInt($div.data("t")));
                }
            });
            return selected;
        };
        ShareButtons.prototype.createHtml = function () {
            var _this = this;
            var isFirst = true;
            this.socNetworks.forEach(function (net) {
                var $div = _this.getItemHtml(isFirst, true, net.type);
                _this.$owner.append($div);
                isFirst = false;
            });
        };
        ShareButtons.prototype.getByType = function (type) {
            return _.find(this.socNetworks, function (net) { return net.type === type; });
        };
        ShareButtons.prototype.getItemHtml = function (isFirst, active, type) {
            var _this = this;
            var pos = isFirst ? "" : " mleft10";
            var soc = this.getByType(type);
            var $itemDiv = $("<div data-t=\"" + type + "\" class=\"icon-holder minus\"><img class=\"opacity5 middle" + pos + "\" src=\"../../images/share-" + soc.iconName + ".png\">" + this.activeTag + "</div>");
            $itemDiv.click(function (e) {
                var active = _this.isActive($itemDiv);
                if (active) {
                    var span = $itemDiv.find(".icon-visited");
                    span.remove();
                }
                else {
                    $itemDiv.append(_this.activeTag);
                }
            });
            return $itemDiv;
        };
        ShareButtons.prototype.isActive = function ($div) {
            var visitedSpan = $div.find(".icon-visited");
            return visitedSpan.length === 1;
        };
        return ShareButtons;
    })();
    Common.ShareButtons = ShareButtons;
})(Common || (Common = {}));
//# sourceMappingURL=shareButtons.js.map