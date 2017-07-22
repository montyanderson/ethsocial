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
		const startTime = Date.now();

		if(userId.startsWith("0x") == false) {
			userId = "0x" + userId;
		}

		const account = Account.at(userId);

		const [
			name,
			bio,
			pictureHashRaw,
			totalPosts,
			totalFollows
		] = await Promise.all([
			account.getName(),
			account.getBio(),
			account.getPicture(),
			account.getPosts(),
			account.getFollows()
		]);

		const pictureHash = base58.encode(pictureHashRaw);
		const pictureUrl = `https://ipfs.io/ipfs/${pictureHash}`;

		const [
			posts,
			follows
		] = await Promise.all([
			await pForMap(
				0,
				i => i < totalPosts,
				i => ++i,
				async i => Post.load(userId, i)
			),
			await pForMap(
				0,
				i => i < totalFollows,
				async i => account.getFollow(i)
			)
		]);

		posts.reverse();

		const user = new User({
			userId,
			name,
			bio,
			pictureHash,
			pictureUrl,
			posts,
			follows
		});

		console.log(`User ${JSON.stringify(userId)} loaded in ${(Date.now() - startTime) / 1000}s`, user);

		return user;
	}
};

module.exports = window.User = User;
