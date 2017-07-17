const Vue = require("vue");
const Account = window.account = require("./lib/Account");
const User = require("./lib/User");

const app = window.app = new Vue({
	el: "#app",
	data: {
		userId: localStorage.address,
		login: localStorage.address ? true : false,
		profile: {},
		newPost: "",
		address: ""
	},
	methods: {
		async createAccount() {
			const res = await Account.new();
			localStorage.address = res.contractAddress;
			this.login = true;

			this.changeProfile(res.contractAddress);
		},

		async setName(name) {
			await Account.at(this.userId).setName(name);
			await this.changeProfile(this.userId);
		},

		async setBio(bio) {
			await Account.at(this.userId).setBio(bio);
			await this.changeProfile(this.userId);
		},

		async changeProfile(userId) {
			const profile = await User.load(userId.toString("hex"));

			for(let post of profile.posts) {
				post.newComment = "";
			}

			app.profile = profile;
		},

		async submitPost(post) {
			await Account.at(this.userId).pushPost(post);
			await this.changeProfile(this.userId);
		},

		async submitComment(userId, postId, comment) {
			const user = Account.at(localStorage.address);

			await user.pushComment(userId, postId, comment);
			await this.changeProfile(this.profile.userId);
		}
	}
});

if(app.login) {
	app.changeProfile(app.userId);
}
