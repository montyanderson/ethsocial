const Account = require("./Account");

module.exports = class User {
	constructor(address) {
		this._account = new Account(address);
		this.address = address;
	}

	loadProfile() {
		return Promise.all([
			this._account.getName(),
			this._account.getBio()
		]).then(res => {
			const [ name, bio ] = res;
			this.name = name;
			this.bio = bio;
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

	loadPosts() {
		return this._account.getPosts().then(totalPosts => {
			const posts = [];

			for(let i = 0; i < totalPosts; i++) {
				posts.push(this.getPost(i));
			}

			return Promise.all(posts).then(p => this.posts = p.reverse());
		});
	}

	loadFollows() {
		return this._account.getFollows().then(totalFollows => {
			const follows = [];

			for(let i = 0; i < totalFollows; i++) {
				follows.push(this._account.getFollow(id));
			}

			return Promise.all(follows).then(f => this.follows = f);
		});
	}

	load() {
		return Promise.all([
			this.loadProfile(),
			this.loadPosts(),
			this.loadFollows()
		]);
	}
}
