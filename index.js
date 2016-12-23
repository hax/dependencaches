exports.load = function (m) {
	if (/[/\\]node_modules[/\\]/.test(__dirname)) {
		require('babel-polyfill')
		return require('./lib/' + m)
	} else { // dev env
		console.info('dependencaches development version\n')
		require('babel-polyfill')
		require('babel-register')
		return require('./src/' + m)
	}
}
