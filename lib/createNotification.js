module.exports = function createNotification(body) {
	new Notification("ethsocial", {
		body
	});
}
