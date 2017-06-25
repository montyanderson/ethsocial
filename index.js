const Vue = require("vue");
const User = require("./lib/User");

const self = window.user = new User("0x4780e332579dd6c885fbd66ae8166b103b016ef7");
let user;

const app = window.app = new Vue({
	el: "#app",
	data: {
		newPost: "",
		comments: {},
		self: {
			name: "",
			bio: "",
			posts: []
		},
		user: {
			name: "",
			bio: "",
			posts: []
		},
		accounts: []
	},
	methods: {
		pushPost() {
			self._account.pushPost(this.newPost);
			this.newPost = "";
		},
		pushComment(postId) {
			self._account.pushComment(user.address, postId, this.comments[postId]);
			this.comments[postId] = "";
		},
		changeUser(address) {
			user = new User(address);
			autoUpdate();
		}
	}
});

const autoUpdate = () => {
	self.load().then(() => {
		for(let key in self) {
			app.self[key] = self[key];
		}
	});

	if(user) {
		user.load().then(() => {
			for(let key in user) {
				app.user[key] = user[key];
			}
		});
	}
};

autoUpdate();
setInterval(autoUpdate, 2000);
