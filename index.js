var request = require('request');

class CoinMarketCap {

	constructor(options={}){
		this.API_URL = options.API_URL || "https://api.coinmarketcap.com/v1/ticker";
		this.convert = options.convert || "USD";
		this.convert = this.convert.toLowerCase();
		this.events = options.events || false;
		if(this.events){
			this.refresh = options.refresh*1000 || 60*1000;
			this.events_update = [];
			this.events_greater = [];
			this.events_lesser = [];
			this.events_percent1h = [];
			this.events_percent24h = [];
			this.events_percent7d = [];
			this._emitter();
			setInterval(this._emitter.bind(this), this.refresh);
		}
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

	_find(coins, coin){
		return coins.find(o => o.symbol === coin.toUpperCase()) ||
		       coins.find(o => o.id === coin.toLowerCase());
	};

	_emitter(){
		this._getJSON(`/?convert=${this.convert}`, (coins) => {
			if(!coins){ return false; }

			this.events_update.forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					event.callback(res)
				}
			});

			this.events_greater.forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(res["price_"+this.convert] >= event.price){
						event.callback(res)
					}
				}
			});

			this.events_lesser.forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(res["price_"+this.convert] <= event.price){
						event.callback(res)
					}
				}
			});

			this.events_percent1h.forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(event.percent < 0 && res.percent_change_1h <= event.percent ){
						event.callback(res)
					} else if(event.percent > 0 && res.percent_change_1h >= event.percent){
						event.callback(res)
					} else if(event.percent == 0 && res.percent_change_1h == 0){
						event.callback(res)
					}
				}
			});

			this.events_percent24h.forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(event.percent < 0 && res.percent_change_24h <= event.percent ){
						event.callback(res)
					} else if(event.percent > 0 && res.percent_change_24h >= event.percent){
						event.callback(res)
					} else if(event.percent == 0 && res.percent_change_24h == 0){
						event.callback(res)
					}
				}
			});

			this.events_percent7d.forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(event.percent < 0 && res.percent_change_7d <= event.percent ){
						event.callback(res)
					} else if(event.percent > 0 && res.percent_change_7d >= event.percent){
						event.callback(res)
					} else if(event.percent == 0 && res.percent_change_7d == 0){
						event.callback(res)
					}
				}
			});
		});
	}

	multi(callback){
		this._getJSON(`/?convert=${this.convert}`, (coins) => {
			if(coins && callback){
				var response = {};
				response.data = coins;
				response.get = function(coin){ return this.data.find(o => o.symbol === coin.toUpperCase()) || this.data.find(o => o.id === coin.toLowerCase()); }
				response.getTop = function(top){return this.data.slice(0, top);}
				response.getAll = function(){ return this.data; }
				callback(response)
			}
		});
		return this;
	}

	get(coin, callback){
		if(callback){
			this._getJSON(`/${coin}/?convert=${this.convert}`, (res) => {
				if(res){callback(res[0]);}
			});
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

	on(coin, callback){
		if(this.events){
			this.events_update.push({coin, callback});
		} else {
			return false;
		}
	}

	onGreater(coin, price, callback){
		if(this.events){
			this.events_greater.push({coin, price, callback});
		} else {
			return false;
		}
	}

	onLesser(coin, price, callback){
		if(this.events){
			this.events_lesser.push({coin, price, callback});
		} else {
			return false;
		}
	}

	onPercentChange1h(coin, percent, callback){
		if(this.events){
			this.events_percent1h.push({coin, percent, callback});
		} else {
			return false;
		}
	}

	onPercentChange24h(coin, percent, callback){
		if(this.events){
			this.events_percent24h.push({coin, percent, callback});
		} else {
			return false;
		}
	}

	onPercentChange7d(coin, percent, callback){
		if(this.events){
			this.events_percent7d.push({coin, percent, callback});
		} else {
			return false;
		}
	}
}

module.exports = CoinMarketCap;
