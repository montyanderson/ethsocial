const Account = require("./Account");
const pForMap = require("./pForMap");

class Comment {
	constructor(comment) {
		Object.assign(this, comment);
	}

	static async load(posterId, postId, commentId) {
		const account = Account.at(posterId);

		console.log(postId, commentId);
		let userId, content;

		try {
			[ userId, content ] = await account.getComment(postId, commentId);
		} catch(err) {
			console.log("comment load failed!", posterId, postId, commentId);
			throw err;
		}

		userId = "0x" + userId.toString("hex");

		return new Comment({
			userId,
			postId,
			commentId,
			content
		});
	}
};

module.exports = Comment;
