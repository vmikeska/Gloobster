var Views;
(function (Views) {
    var CropImg = (function () {
        function CropImg(frameId, frameWidth, frameHeight, src) {
            this.$frame = $("#" + frameId);
            this.frameId = frameId;
            this.frameWidth = frameWidth;
            this.frameHeight = frameHeight;
            this.src = src;
            this.setFrame();
        }
        CropImg.prototype.setFrame = function () {
            this.$frame.addClass("ci-frame");
            this.$frame.css("width", this.frameWidth);
            this.$frame.css("height", this.frameHeight);
            var $img = $("<img src=\"" + this.src + "\" style=\"max-width: 100%\" />");
            this.$frame.append($img);
            $img.cropper({
                aspectRatio: 600 / 400,
                crop: function (e) {
                    console.log(e.x);
                    console.log(e.y);
                    console.log(e.width);
                    console.log(e.height);
                    console.log(e.rotate);
                    console.log(e.scaleX);
                    console.log(e.scaleY);
                }
            });
        };
        CropImg.prototype.mouseWheelHandler = function (e) {
            e.preventDefault();
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            console.log(delta);
        };
        return CropImg;
    }());
    Views.CropImg = CropImg;
})(Views || (Views = {}));
//# sourceMappingURL=CropImg.js.map