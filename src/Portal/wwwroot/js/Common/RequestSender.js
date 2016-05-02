var Common;
(function (Common) {
    var RequestSender = (function () {
        function RequestSender(endPoint, data, addLocalAuthentication) {
            if (data === void 0) { data = null; }
            if (addLocalAuthentication === void 0) { addLocalAuthentication = false; }
            this.cookieManager = new Common.CookieManager();
            this.endPoint = endPoint;
            this.data = data;
            this.dataToSend = data;
            this.addLocalAuthentication = addLocalAuthentication;
        }
        RequestSender.prototype.addAuthentication = function (reqObj) {
            var cookieStr = this.cookieManager.getString(Constants.tokenCookieName);
            if (cookieStr) {
                var headers = {};
                headers["Authorization"] = cookieStr;
                reqObj.headers = headers;
            }
        };
        RequestSender.prototype.serializeData = function () {
            this.dataToSend = JSON.stringify(this.data);
        };
        RequestSender.prototype.sendPost = function () {
            var self = this;
            var callObj = {
                type: 'POST',
                url: this.endPoint,
                data: this.dataToSend,
                success: function (response) {
                    if (self.onSuccess) {
                        self.onSuccess(response);
                    }
                },
                error: function (response) {
                    if (self.onError) {
                        self.onError(response);
                    }
                },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8'
            };
            if (this.addLocalAuthentication) {
                this.addAuthentication(callObj);
            }
            $.ajax(callObj);
        };
        RequestSender.prototype.sendGet = function () {
            var urlQuery = "";
            if (this.params) {
                urlQuery = "?";
                this.params.forEach(function (param) {
                    urlQuery += param[0] + "=" + param[1] + "&";
                });
                urlQuery = urlQuery.substring(0, urlQuery.length - 1);
            }
            var self = this;
            var callObj = {
                type: 'GET',
                cache: false,
                url: this.endPoint + urlQuery,
                success: function (response) {
                    if (self.onSuccess) {
                        self.onSuccess(response);
                    }
                },
                error: function (response) {
                    if (self.onError) {
                        self.onError(response);
                    }
                }
            };
            if (this.addLocalAuthentication) {
                this.addAuthentication(callObj);
            }
            $.ajax(callObj);
        };
        RequestSender.prototype.sendDelete = function () {
            var urlQuery = "";
            if (this.params) {
                urlQuery = "?";
                this.params.forEach(function (param) {
                    urlQuery += param[0] + "=" + param[1] + "&";
                });
                urlQuery = urlQuery.substring(0, urlQuery.length - 1);
            }
            var self = this;
            var callObj = {
                type: 'DELETE',
                url: this.endPoint + urlQuery,
                success: function (response) {
                    if (self.onSuccess) {
                        self.onSuccess(response);
                    }
                },
                error: function (response) {
                    if (self.onError) {
                        self.onError(response);
                    }
                },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8'
            };
            if (this.addLocalAuthentication) {
                this.addAuthentication(callObj);
            }
            $.ajax(callObj);
        };
        RequestSender.prototype.sendPut = function () {
            var self = this;
            var callObj = {
                type: 'PUT',
                url: this.endPoint,
                data: this.dataToSend,
                success: function (response) {
                    if (self.onSuccess) {
                        self.onSuccess(response);
                    }
                },
                error: function (response) {
                    if (self.onError) {
                        self.onError(response);
                    }
                },
                dataType: 'json',
                contentType: 'application/json; charset=utf-8'
            };
            if (this.addLocalAuthentication) {
                this.addAuthentication(callObj);
            }
            $.ajax(callObj);
        };
        return RequestSender;
    }());
    Common.RequestSender = RequestSender;
})(Common || (Common = {}));
//# sourceMappingURL=RequestSender.js.map