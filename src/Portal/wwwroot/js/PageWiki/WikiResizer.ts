module Wiki {

		export class WikiResizer {
				private threshold = 830;
				private layoutType: LayoutSize;
				private $cont = $("#mainPageCont");
				private $rightCont = $("#rightCont");

				private imgRate = 350.0 / 1280.0;

				private imageSize = 0;

				private $collapsers = $(".block .collapser");

				private v: Views.WikiPageView;

				constructor(v: Views.WikiPageView) {
						this.v = v;

						$(window).resize(() => {
								this.set();
								this.setImage();
						});

						this.setImage();
				}

				private setImage() {
						var width = this.getWidth();

						var newImgSize = 0;
						if (width <= 480) {
								newImgSize = 480;
						} else if (width <= 880) {
								newImgSize = 880;
						} else {
								newImgSize = 1280;
						}

						if ((newImgSize !== this.imageSize) && newImgSize > this.imageSize) {

								var height = Math.floor(newImgSize * this.imgRate);

								var url = `/picd/${this.v.photoGID}/wtn?maxWidth=${newImgSize}&maxHeight=${height}`;
								$(".title-img").attr("src", url);

								this.imageSize = newImgSize;
						}


				}

				private set() {
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
								} else {
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
								this.$collapsers.addClass("hidden");

								$(".block .text").show();
								this.$collapsers.addClass("opened");

						} else {
								this.$cont.removeClass("cont-wrap");
								this.$collapsers.removeClass("hidden");
						}

						this.layoutType = layoutType;
				}

				private getCatContByType(type) {
						var $cont = $(`.block[data-c="${type}"]`);
						return $cont;
				}

				public init() {
						this.set();

						if (this.layoutType === LayoutSize.Mobile) {
								$(".block .text").hide();
								this.$collapsers.removeClass("opened");
						}

						this.$collapsers.click((e) => {
								var $t = $(e.target);
								var $b = $t.closest(".block");
								var $text = $b.find(".text");
								$text.slideToggle(() => {

										//setTimeout(() => {
										var opened = !($text.css('display') === "none");
										$t.toggleClass("opened", opened);
										//},
										//200);
								});
						});

						this.$rightCont.removeClass("hidden");
				}



				private getWidth() {
						var width = $(window).width();
						return width;
				}
		}

}