const { icons } = require('../embed/emoji');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		global.client.icons = icons();
		console.log('Icons have been loaded');
	},
};