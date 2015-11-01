
class Comments {

 public owner: Views.ViewBase;	

 public comments: any[];
 public users: any[];

 private template;

 constructor(owner: Views.ViewBase) {
	 this.owner = owner;
	 var source = $("#comment-template").html();
	 this.template = Handlebars.compile(source);
 }

 public generateComments() {
	 var html = "";
	 if (!this.comments) {
		 return "";
	 }

	 this.comments.forEach(comment => {
		 html += this.generateComment(comment);
	 });
	 return html;
 }

 public postComment(tripId: string) {
	 var $input = $("#commentInput");
		var text = $input.val();

		var request = { text: text, tripId: tripId };
		this.owner.apiPost("tripComment", request, response => {
			this.comments = response.comments;
			this.users = response.users;
			this.displayComments();
		});

		$input.val("");
	}

 public displayComments() {
	 var commentsHtml = this.generateComments();
	 $("#commentsContainer").html(commentsHtml);
 }

 private generateComment(comment) {
	 var context = this.addUserData(comment);	
	
	var html = this.template(context);
	return html;
 }
 
 private addUserData(comment) {
	 var user = this.getUserById(comment.userId);

	 var postDate = new Date(comment.postDate);
	 comment["displayDate"] = postDate.getDate() + "." + postDate.getMonth() + "." + postDate.getFullYear() + " (" + postDate.getHours() + ":" + postDate.getMinutes() + ")";
	 comment["displayName"] = user.displayName;
	 comment["photoUrl"] = user.photoUrl;
	 return comment;
 }

 private getUserById(id) {
	 var user = _.find(this.users, (user) => {
		 return user.id === id;
	 });
	 return user;
 }



 

}