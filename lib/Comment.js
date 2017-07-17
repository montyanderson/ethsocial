const Account = require("./Account");
const pForMap = require("./pForMap");

class Comment {
	constructor(comment) {
		Object.assign(this, comment);
	}

	static async load(posterId, postId, commentId) {
		const account = new Account(posterId);

		const [ userId, content ] = await account.getComment(postId, commentId);

		return new Comment({
			userId,
			postId,
			commentId,
			content
		});
	}
};

module.exports = Comment;
