const Vue = require("vue");
const base58 = require("bs58");
const Account = window.account = require("./Account");
const User = require("./User");
const createNotification = require("./createNotification");

document.querySelector("#app").style.display = "block";

const app = window.app = new Vue({
	el: "#app",
	data: {
		userId: localStorage.address,
		login: localStorage.address ? true : false,
		user: {
			userId: localStorage.address
		},
		profile: {},
		newPost: "",
		editingName: false,
		newName: "",
		editingBio: false,
		newBio: "",
		address: "",
		editingPicture: false,
		newPicture: ""
	},
	methods: {
		async createAccount() {
			createNotification("Your account is being created!");

			const res = await Account.new();
			localStorage.address = this.user.userId = res.contractAddress;
			this.login = true;

			await this.updateUser();
			await this.changeProfile(res.contractAddress);

			createNotification("Your account is ready!");
		},

		async updateUser() {
			this.user = await User.load(this.user.userId);
		},

		async setName(name) {
			await Account.at(this.user.userId).setName(name);
			this.editingName = false;
			await this.changeProfile(this.user.userId);
		},

		async setBio(bio) {
			await Account.at(this.user.userId).setBio(bio);
			this.editingBio = false;
			await this.changeProfile(this.user.userId);
		},

		async setPicture(pictureHash) {
			await Account.at(this.user.userId).setPicture(base58.decode(pictureHash));
			this.editingPicture = false;
			await this.changeProfile(this.user.userId);
		},

		async changeProfile(userId) {
			let i;

			const profile = await User.load(userId.toString("hex"));

			for(let post of profile.posts) {
				post.newComment = (app.profile.posts && app.profile.posts[profile.posts.indexOf(post)] || {}).newComment || "";
			}

			if(profile.userId == this.user.userId) {
				if(!this.newName) this.newName = profile.name;
				if(!this.newBio) this.nameBio = profile.bio;
			}

			app.profile = profile;
		},

		async submitPost(post) {
			await Account.at(this.user.userId).pushPost(post);
			await this.changeProfile(this.user.userId);
		},

		async submitComment(userId, postId, comment) {
			const user = Account.at(localStorage.address);

			await user.pushComment(userId, postId, comment);
			await this.changeProfile(this.profile.userId);
		},

		async follow(userId) {
			await Account.at(this.user.userId).pushFollow(userId);
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

		if(app.user.userId) {
			await app.changeProfile(app.user.userId);
		}


	}

})();
