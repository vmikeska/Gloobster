module Planning {
		export class ImagesCache {
				private static execBy = 4;

				private static dret = new Common.DelayedReturn();

				private static get v(): Views.ViewBase {
						return Views.ViewBase.currentView;
				}

				private static images: IImageRecord[] = [];
				private static queue: IQueueItem[] = [];
				
				public static getImageById(id, type: FlightCacheRecordType, size: ListSize, $group) {
						console.log(`QQ:GettingImg: ${id}`);

						var image = _.find(this.images, { id: id });
						if (!image) {
								var queueItem = _.find(this.queue, { id: id });
								if (!queueItem) {
										var qi: IQueueItem = {
												id: id,
												type: type,
												size: size
										};
										this.queue.push(qi);

									this.exeQueueSafe();
								}
						} else {								
								console.log(`QQ:Applaying: ${id}`);
								this.applyImage($group, image);
						}						
				}

				private static isRunning = false;

				private static exeQueueSafe() {
						this.dret.receive(() => {
								console.log(`QQ:ExecutingCache`);
								this.exeQueue();
					});
				}

				private static exeQueue() {

						if (this.isRunning) {
							return;
						}

						this.isRunning = true;

						var items = _.take(this.queue, this.execBy);
						var data = [];
						items.forEach((i: IQueueItem) => {
								data.push(["items", `${i.id}-${i.type}-${i.size}`]);
						});

						this.v.apiGet("PlaceImage", data, (images) => {

								console.log(`QQ:Received: ${images.length}`);
								images.forEach((image: IImageRecord) => {
										
										this.images.push(image);
										_.remove(this.queue, { id: image.id, type: image.type, size: image.size });
										
										var $group = $(`.group_${image.id}`);

										console.log(`QQ:Applaying-get: ${image.id}`);
										this.applyImage($group, image);
									
								});

								this.isRunning = false;
								if (any(this.queue)) {
									this.exeQueue();
								} 
								
						});
				}
				

			private static applyImage($group, image: IImageRecord) {
				if (image.data) {
					if (image.type === FlightCacheRecordType.City) {
						var $img = $group.find(".img");
						$img.attr("src", `data:image/jpeg;base64,${image.data}`);
					}
					if (image.type === FlightCacheRecordType.Country) {
						var $cont = $group.find(".img-wrap");
						$cont.html(image.data);
					}
				}
			}

		}

		export interface IImageRecord {
				id: string;
				type: FlightCacheRecordType;
				size: ListSize;
				data: string;
		}

		export interface IQueueItem {
				id: string;
				type: FlightCacheRecordType;
				size: ListSize;
		}
}