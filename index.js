const Vue = require("vue");
const User = require("./lib/User");

const app = window.app = new Vue({
	el: "#app",
	data: {
		profile: {}
	},
	methods: {
		async changeProfile(userId) {
			console.log(userId.toString());
			console.log(await User.load(userId.toString("hex")));
			app.profile = await User.load(userId.toString("hex"));
		}
	}
});

app.changeProfile(localStorage.address);
