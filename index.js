var request = require('request');

class CoinMarketCap {

	constructor(options={}){
		this.API_URL = options.API_URL || "https://api.coinmarketcap.com/v1/ticker";
		this.convert = options.convert || "USD";
		this.convert = this.convert.toLowerCase();
		this.events = options.events || false;
		if(this.events){
			this.refresh = options.refresh*1000 || 60*1000;
			this.events = [];
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

			this.events.filter(e => e.type == "update").forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					event.callback(res, event)
				}
			});

			this.events.filter(e => e.type == "greater").forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(res["price_"+this.convert] >= event.price){
						event.callback(res, event)
					}
				}
			});

			this.events.filter(e => e.type == "lesser").forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(res["price_"+this.convert] <= event.price){
						event.callback(res, event)
					}
				}
			});

			this.events.filter(e => e.type == "percent1h").forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(event.percent < 0 && res.percent_change_1h <= event.percent ){
						event.callback(res, event)
					} else if(event.percent > 0 && res.percent_change_1h >= event.percent){
						event.callback(res, event)
					} else if(event.percent == 0 && res.percent_change_1h == 0){
						event.callback(res, event)
					}
				}
			});

			this.events.filter(e => e.type == "percent24h").forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(event.percent < 0 && res.percent_change_24h <= event.percent ){
						event.callback(res, event)
					} else if(event.percent > 0 && res.percent_change_24h >= event.percent){
						event.callback(res, event)
					} else if(event.percent == 0 && res.percent_change_24h == 0){
						event.callback(res, event)
					}
				}
			});

			this.events.filter(e => e.type == "percent7d").forEach(event => {
				var res = this._find(coins, event.coin);
				if(res){
					if(event.percent < 0 && res.percent_change_7d <= event.percent ){
						event.callback(res, event)
					} else if(event.percent > 0 && res.percent_change_7d >= event.percent){
						event.callback(res, event)
					} else if(event.percent == 0 && res.percent_change_7d == 0){
						event.callback(res, event)
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
			this.events.push({coin, callback, type: "update"});
		} else {
			return false;
		}
	}

	onGreater(coin, price, callback){
		if(this.events){
			this.events.push({coin, price, callback, type: "greater"});
		} else {
			return false;
		}
	}

	onLesser(coin, price, callback){
		if(this.events){
			this.events.push({coin, price, callback, type: "lesser"});
		} else {
			return false;
		}
	}

	onPercentChange1h(coin, percent, callback){
		if(this.events){
			this.events.push({coin, percent, callback, type: "percent1h"});
		} else {
			return false;
		}
	}

	onPercentChange24h(coin, percent, callback){
		if(this.events){
			this.events.push({coin, percent, callback, type: "percent24h"});
		} else {
			return false;
		}
	}

	onPercentChange7d(coin, percent, callback){
		if(this.events){
			this.events.push({coin, percent, callback, type: "percent7d"});
		} else {
			return false;
		}
	}

	deleteEvent(event){
		this.events.splice(this.events.indexOf(event), 1);
		return this;
	}
}

module.exports = CoinMarketCap;
