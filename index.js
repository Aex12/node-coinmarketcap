var request = require('request');

class CoinMarketCap {
	constructor(options={}){
		this.API_URL = options.API_URL || "https://api.coinmarketcap.com/v1/ticker";
		this.convert = options.convert || "USD";
	}

	_getJSON(url, callback){
		request(this.API_URL+url, (error, response, body) => {
			if(error){ 
				callback(false);
				return this;
			}
			if(response && response.statusCode == 200){
				callback(JSON.parse(body))
			} else {
				callback(false);
				return this;
			}
		});
	}

	get(coin, callback){
		if(callback){
			this._getJSON(`/${coin}/?convert=${this.convert}`, callback);
			return this;
		} else {
			return false;
		}
	}

	getAll(callback){
		if(callback){
			this._getJSON(`/?convert=${this.convert}`, callback);
			return this;
		} else {
			return false;
		}
	}

	getTop(top, callback){
		if(callback){
			this._getJSON(`/?convert=${this.convert}&limit=${top}`, callback);
			return this;
		} else {
			return false;
		}
	}

}

module.exports = CoinMarketCap;