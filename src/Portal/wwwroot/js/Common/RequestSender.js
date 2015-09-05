var RequestSender = (function () {
    function RequestSender(endPoint, data, addLocalAuthentication) {
        if (data === void 0) { data = null; }
        if (addLocalAuthentication === void 0) { addLocalAuthentication = false; }
        this.endPoint = endPoint;
        this.data = data;
        this.dataToSend = data;
        this.addLocalAuthentication = addLocalAuthentication;
    }
    RequestSender.prototype.addAuthentication = function (reqObj) {
        var cookieToken = $.cookie("token");
        if (cookieToken) {
            var headers = {};
            headers["Authorization"] = cookieToken;
            reqObj.headers = headers;
        }
        else {
            //todo: handle error message
            alert("no token found in cookies");
        }
    };
    RequestSender.prototype.serializeData = function () {
        this.dataToSend = JSON.stringify(this.data);
    };
    RequestSender.prototype.sentPost = function () {
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
    return RequestSender;
})();
//# sourceMappingURL=RequestSender.js.map