# node-coinmarketcap

A node module to connect to CoinMarketCap API and retrieve prices and statistics of cryptocurrencies.

It supports events to get alerts on price status.

## Installation

```console
$ npm install node-coinmarketcap
```

## Usage Example
```js
var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();
// If you want to check a single coin, use get() (You need to supply the coinmarketcap id of the cryptocurrency, not the symbol)
// If you want to use symbols instead of id, use multi.
coinmarketcap.get("bitcoin", coin => {
  console.log(coin.price_usd); // Prints the price in USD of BTC at the moment.
});
// If you want to check multiple coins, use multi():
coinmarketcap.multi(coins => {
  console.log(coins.get("BTC").price_usd); // Prints price of BTC in USD
  console.log(coins.get("ETH").price_usd); // Print price of ETH in USD
  console.log(coins.get("ETH").price_btc); // Print price of ETH in BTC
  console.log(coins.getTop(10)); // Prints information about top 10 cryptocurrencies
});
```
## Usage Example with Events

```js
var CoinMarketCap = require("node-coinmarketcap");

var options = {
	events: true, // Enable event system
	refresh: 60, // Refresh time in seconds (Default: 60)
	convert: "EUR" // Convert price to different currencies. (Default USD)
}
var coinmarketcap = new CoinMarketCap(options);

// Trigger this event when BTC price is greater than 4000
coinmarketcap.onGreater("BTC", 4000, (coin) => {
	console.log("BTC price is greater than 4000 of your defined currency");
});

// Trigger this event when BTC percent change is greater than 20
coinmarketcap.onPercentChange24h("BTC", 20, (coin) => {
	console.log("BTC has a percent change above 20% in the last 24 hours");
});

// Trigger this event every 60 seconds with information about BTC
coinmarketcap.on("BTC", (coin) => {
	console.log(coin);
});
```
For a full list of examples with events, visit: https://github.com/Aex12/node-coinmarketcap/blob/master/example.js
