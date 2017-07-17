const Account = require("./Account");
const Comment = require("./Comment");
const pForMap = require("./pForMap");

class Post {
	constructor(post) {
		Object.assign(this, post);
	}

	static async load(userId, postId) {
		const account = Account.at(userId);

		const [ content, edited, totalComments ] = await account.getPost(postId);

		const comments = await pForMap(
			0,
			i => i < totalComments,
			i => ++i,
			async i => Comment.load(userId, postId, i)
		);

		return new Post({
			userId,
			postId,
			content,
			comments,
			edited
		});
	}
};

module.exports = Post;
