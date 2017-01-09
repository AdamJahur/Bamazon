//requiring npm packages
var mysql = require('mysql');
var prompt = require('prompt');

//settings to connect to Bamazon database
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Bamazon'
});

//executing code
var execute = function(){

	connection.query("SELECT * FROM Bamazon.Products", function(err, results) {
		return (prettyTable(result));
	});

	setTimeout(function(){
		prompt.get(['Item_Id', 'Stock_Quantity'], function(err, results) {
			var shopperItem = result.Item_Id;
			var shopperQuantity = result.Stock_Quantity;

			inventoryCheck(shopperItem, shopperQuantity);
			setTimeout(function() {execute();}, 3500);

		});
	}, 750);
}

//checking inventory 
var inventoryCheck = function (id, quantity){
	connection.query('SELECT * FROM Bamazon.Products WHERE Item_Id = ' + id, function(err, results){
		if (err) throw err;

		var total = result[0].Price * quantity;

		var inventory = result[0].Stock_Quantity - quantity;

		if (inventory < 0){
			console.log('Insufficient stock. There are only ' + result[0].Stock_Quantity + 'item(s) left.');

		} else {
			console.log('User has bought ' + quantity + ' ' + result[0].Product_Name + ' for $' + total);
			console.log('There are ' + inventory + ' ' + result[0].Product_Name + ' remaining.')
			databaseUpdate(id, inventory)
		}
	});
}

//updating database after purcahse
var databaseUpdate = function(id, quantity){
	connection.query('update products set Stock_Quantity = ' + quantity + ' where Item_Id = ' + id, function(err, result){
		if (err) throw err;
	});
}

//making inventory look good
function prettyTable(items){
	for (var i = 0; i < items.length; i++) {
		console.log('----------------------');
		console.log('Item_Id: ' + items[i].Item_Id);
		console.log('Item: ' + items[i].Product_Name);
		console.log('Department: ' + items[i].Department_Name);
		console.log('Price: $' + items[i].Price);
	}
	console.log('------------------');
}

//connecting to Bamazon database
connection.connect(function(err){
	if (err) {
		console.error('connection error: ' + err);
		return;
	}
});

//initiate the splinter sequence
execute();








