const Ethane = require("../ethane");
const Vue = require("vue");

const ethane = new Ethane("http://localhost:8545");

const Account = ethane.contract(
	[{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"pushFollow","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"content","type":"string"}],"name":"pushPost","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"postId","type":"uint256"},{"name":"commentId","type":"uint256"},{"name":"content","type":"string"}],"name":"editComment","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getPost","outputs":[{"name":"","type":"string"},{"name":"","type":"bool"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPosts","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"postId","type":"uint256"},{"name":"commentId","type":"uint256"},{"name":"content","type":"string"}],"name":"_editComment","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"postId","type":"uint256"},{"name":"commentId","type":"uint256"}],"name":"getComment","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"deleteFollow","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"postId","type":"uint256"},{"name":"content","type":"string"}],"name":"pushComment","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getFollows","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"setName","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"content","type":"string"}],"name":"_pushComment","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getBio","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"content","type":"string"}],"name":"editPost","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_bio","type":"string"}],"name":"setBio","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]
);

class User {
	constructor(address) {
		this._account = new Account(address);
		this.address = address;
	}

	update() {
		return Promise.all([
			this._account.getName(),
			this._account.getBio(),
			this._account.getPosts(),
			this._account.getFollows()
		]).then(res => {
			const [ name, bio, totalPosts, totalFollows ] = res;

			this.name = name;
			this.bio = bio;

			const posts = [];

			for(let i = 0; i < totalPosts; i++) {
				posts.push(this.getPost(i));
			}

			const follows = [];

			for(let i = 0; i < totalFollows; i++) {
				follows.push(this._account.getFollow(id));
			}

			return Promise.all([
				Promise.all(posts).then(p => this.posts = p.reverse()),
				Promise.all(follows).then(f => this.follows = f)
			]);
		});
	}

	getPost(id) {
		return this._account.getPost(id).then(res => {
			const [ content, edited, totalComments ] = res;
			const post = {};

			post.id = id;
			post.content = content;
			post.edited = edited;

			let comments = [];

			for(let i = 0; i < totalComments; i++) {
				comments.push(this._account.getComment(id, i));
			}

			return Promise.all(comments).then(c => post.comments = c).then(() => post);
		});
	}
}

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
		}
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
	self.update().then(() => {
		for(let key in self) {
			app.self[key] = self[key];
		}
	});

	if(user) {
		user.update().then(() => {
			for(let key in user) {
				app.user[key] = user[key];
			}
		});
	}
};

autoUpdate();
setInterval(autoUpdate, 2000);
