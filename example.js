var CoinMarketCap = require(".")

var options = {
	refresh: 60, // Refresh time in seconds (Default: 60)
	convert: "EUR" // Convert price to different currencies. (Default USD)
}
var coinmarketcap = new CoinMarketCap.events(options); 

// Put event for price greater or equal than X
coinmarketcap.onGreater("BTC", 4000, (coin) => {
	console.log("BTC price is greater than 4000 of your defined currency");
});

coinmarketcap.onLesser("BTC", 3000, (coin) => {
	console.log("BTC price is lesser than 3000 of your defined currency");
});

// Put event for percent change. You can define negative and positive percent changes.
coinmarketcap.onPercentChange7d("BTC", 15, (coin) => {
	console.log("BTC has a percent change above 15% in the last 7 days");
});

coinmarketcap.onPercentChange24h("BTC", -10, (coin) => {
	console.log("BTC has a percent change beyond -10% in the last 24h");
});

coinmarketcap.onPercentChange1h("BTC", 10, (coin) => {
	console.log(coin);
});

// Put event on BTC with no conditions. It will trigger every 60 seconds with information about that coin (Or the defined time in options)
coinmarketcap.on("BTC", (coin) => {
	console.log(coin)
});