
interface ICreateUser {		
		sendUserRegistrationData: Function;
}

class PortalUser {
		displayName: string;
    password: string;
    mail: string;
    facebookUser: FacebookUser;
}

class FacebookUser {				
		constructor(accessToken: string, userId: string, expiresIn: number, signedRequest: string) {
				this.accessToken = accessToken;
				this.userId = userId;
				this.expiresIn = expiresIn;
				this.signedRequest = signedRequest;
		}

		accessToken: string;
    userId: string;
    expiresIn: number;
    signedRequest: string;
}

class CreateUserBase implements ICreateUser {

		createUserEndpoint = '/api/user';
		
		onSuccess(response) {

		}

		onError(response) {

		}

		sendUserRegistrationData(newUser: PortalUser) {
				//var serializedData = JSON.stringify(newUser); //$(newUser).serialize()

				var request = new RequestSender(this.createUserEndpoint, newUser);
				request.serializeData();
				request.onSuccess = this.onSuccess;
				request.onError = this.onError;
				request.post();				
		}
}

class CreateUserFacebook extends CreateUserBase {

		handleRoughResponse(jsonRequest) {

				var fbUser = new FacebookUser(
						jsonRequest.accessToken,
						jsonRequest.userID,
						jsonRequest.expiresIn,
						jsonRequest.signedRequest);
				
				var baseUser = new PortalUser();
				//baseUser.displayName = 'test';
				baseUser.facebookUser = fbUser;

				super.sendUserRegistrationData(baseUser);
		}

}

class CreateUserLocal extends CreateUserBase {

		createUser(displayName: string, mail: string, password: string) {
				var baseUser = new PortalUser();
				baseUser.displayName = displayName;
				baseUser.mail = mail;
				baseUser.password = password;

				super.sendUserRegistrationData(baseUser);
		}
}

interface ResponseCallback {
    (request: any): void;
}

class RequestSender {
		
		constructor(endPoint: string, data: any) {
				this.endPoint = endPoint;
				this.data = data;
				this.dataToSend = data;
		}

		endPoint: string;
		data: any;
		dataToSend: any;

		onSuccess: ResponseCallback;
		onError: ResponseCallback;
		
		serializeData() {
				this.dataToSend = JSON.stringify(this.data)
		}

		post() {
				$.ajax({
						type: 'POST',
						url: this.endPoint,
						data: this.dataToSend,
						success: function (response) {
								if (this.onSuccess) {
										this.onSuccess(response);
								}
						},
						error: function (response) {
								if (this.onError) {
										this.onError(response);
								}
						},
						dataType: 'json',
						contentType: 'application/json; charset=utf-8'

				});
		}

}