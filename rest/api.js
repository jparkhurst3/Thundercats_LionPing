const connection = mysql.createConnection({
	host: 'localhost',
	user: 'samford',
	password: 'asdf',
	database: 'world'
});

app.get('users', function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	connection.connect();
	connection.query('SELECT * FROM user', function(error, results, fields) {
		console.log('got users');
		console.log('users');
		const rows = JSON.stringify(results);
		res.end(rows);
	})
});
