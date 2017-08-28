var request = require('request');

class base {

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
}

class onDemand extends base {

	constructor(options={}){
		super(options);
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

class cached extends base {
	constructor(options={}){
		super(options);
		this.refresh = options.refresh*1000 || 60*1000;
		this.start();
	}

	start(){
		if(this.refresh > 0){
			this.update();
			this._interval_id = setInterval(this.update.bind(this), this.refresh);
		}
	}

	stop(){
		if(this._interval_id){
			clearInterval(this._interval_id);
		}
	}

	update(callback){
		var self = this;
		this._getJSON(`/?convert=${this.convert}`, (response) => {
			if(response){ self.data = response; }
		});
		return this;
	}

	get(coin){
		return self.data.find(o => o.symbol === coin) || self.data.find(o => o.id === coin);
	}

	getAll(){
		return self.data;
	}

	getTop(top){
		return self.data.slice(0, top);
	}


}

module.exports = {onDemand, cached};