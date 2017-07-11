const Account = require("./Account");

async function pForMap(init, condition, expression, handler) {
	const promises = [];

	for(let i = 0; condition(i); i = expression(i)) {
		promises[i] = handler(i);
	}

	return await Promise.all(promises);
}

module.exports = class User {
	constructor(address) {
		this._account = new Account(address);
		this.address = address;
	}

	async setName(name) {
		await this._account.setName(name);
	}

	async setBio(bio) {
		await this._account.setBio(bio);
	}

	async loadProfile() {
		const [ name, bio ] = await Promise.all([
			this._account.getName(),
			this._account.getBio()
		]);

		this.name = name;
		this.bio = bio;
	}

	async getPost(id) {
		const [ content, edited, totalComments ] = await this._account.getPost(id);
		const post = {};

		post.id = id;
		post.content = content;
		post.edited = edited;

		post.comments = await pForMap(
			() => 0,
			i => i < totalComments,
			i => ++i,
			async i => this._account.getComment(id, i)
		);

		return post;
	}

	async loadPosts() {
		const totalPosts = await this._account.getPosts();

		this.posts = await pForMap(
			() => 0,
			i => i < totalPosts,
			i => ++i,
			async i => this.getPost(i)
		);

		this.posts.reverse();
	}

	async loadFollows() {
		const totalFollows = await this._account.getFollows();

		this.follows = await pForMap(
			() => 0,
			i => i < totalFollows,
			i => ++i,
			async i => this._account.getFollow(i)
		);
	}

	async load() {
		await Promise.all([
			this.loadProfile(),
			this.loadPosts(),
			this.loadFollows()
		]);
	}
}
