const Account = require("./Account");
const pForMap = require("./pForMap");

class Comment {
	constructor(comment) {
		Object.assign(this, comment);
	}

	static async load(posterId, postId, commentId) {
		const account = Account.at(posterId);

		let [ userId, content ] = await account.getComment(postId, commentId);

		userId = "0x" + (userId.length == 42 ? userId.toString("hex") : "0" + userId.toString("hex"));

		return new Comment({
			userId,
			postId,
			commentId,
			content
		});
	}
};

module.exports = Comment;
