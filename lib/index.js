const Vue = require("vue");
const base58 = require("bs58");
const Account = window.account = require("./Account");
const User = require("./User");
const createNotification = require("./createNotification");

const app = window.app = new Vue({
	el: "#app",
	data: {
		userId: localStorage.address,
		login: localStorage.address ? true : false,
		profile: {},
		newPost: "",
		address: "",
		newPicture: ""
	},
	methods: {
		async createAccount() {
			createNotification("Your account is being created!");

			const res = await Account.new();
			localStorage.address = this.userId = res.contractAddress;
			this.login = true;

			await this.changeProfile(res.contractAddress);

			createNotification("Your account is ready!");
		},

		async setName(name) {
			await Account.at(this.userId).setName(name);
			await this.changeProfile(this.userId);
		},

		async setBio(bio) {
			await Account.at(this.userId).setBio(bio);
			await this.changeProfile(this.userId);
		},

		async setPicture(pictureHash) {
			await Account.at(this.userId).setPicture(base58.decode(pictureHash));
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
		},

		addressColors(address = "") {
			if(!address) return;

			return address.match(/.{1,2}/g).map(a => {
				const val = parseInt(a, 16);
				const bin = val.toString(2);

				const red = parseInt(bin.slice(0, 3) || 0, 2) * (2 ** 5);
				const green = parseInt(bin.slice(3, 6) || 0, 2) * (2 ** 5);
				const blue = parseInt(bin.slice(6, 8) || 0, 2) * (2 ** 6);

				const color = "#" + red.toString(16) + green.toString(16) + blue.toString("16");

				return `<font color=${color}>${a}</font>`;
			}).join("");
		}
	}
});

if(app.login) {
	app.changeProfile(app.userId);
}

(async () => {

	while(true) {
		await new Promise(r => setTimeout(r, 2000));

		if(app.profile.userId) {
			await app.changeProfile(app.profile.userId);
		}
	}

})();
