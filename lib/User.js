const base58 = require("bs58");
const Account = require("./Account");
const Post = require("./Post");
const Comment = require("./Comment");
const pForMap = require("./pForMap");

class User {
	constructor(user) {
		Object.assign(this, user);
	}

	static async load(userId) {
		if(userId.startsWith("0x") == false) {
			userId = "0x" + userId;
		}

		const account = Account.at(userId);

		const [ name, bio, pictureHashRaw ] = await Promise.all([
			account.getName(),
			account.getBio(),
			account.getPicture()
		]);

		const pictureHash = base58.encode(pictureHashRaw);
		const pictureUrl = `https://ipfs.io/ipfs/${pictureHash}`;

		const totalPosts = await account.getPosts();

		const posts = await pForMap(
			0,
			i => i < totalPosts,
			i => ++i,
			async i => Post.load(userId, i)
		);

		posts.reverse();

		return new User({
			userId,
			name,
			bio,
			pictureHash,
			pictureUrl,
			posts
		});
	}
};

module.exports = window.User = User;
