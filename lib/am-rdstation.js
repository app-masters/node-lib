let rdclient = require('rdstation-node-client');


class RdStation {

    static createConversion(identifier, email, name, customFields) {
        return new Promise(async (resolve, reject) => {

            let obj = {};
            if (email)
                obj.email = email;
            if (name)
                obj.name = name;

            if (customFields){
                obj = Object.assign(obj,customFields);
            }

            console.log("RdStation.createConversion obj",obj);

            let conversions = new rdclient.Conversions(RdStation.getToken());
            conversions.createConversion(identifier, obj)
                .then(function (data) {
                    console.log('createConversion done statusCode ', data.statusCode);
                    // console.log('Request done ', data);
                    // console.log('Request done statusCode ', data.statusCode);
                    // console.log('Request done body ', data.body);
                    // console.log('Request done body ', data.res.body);
                    resolve(data.statusCode);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    static dealWon(email, value) {
        return new Promise(async (resolve, reject) => {
            // Set won - turn it a client
            const services = new rdclient.Services(RdStation.getPrivateToken());
            await services.dealWon(value, email)
                .then(function (data) {
                    // console.log('Request done ', data);
                    console.log('dealWon done statusCode ', data.statusCode);
                    resolve(data.statusCode);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }
    static dealLost(email, reason) {
        return new Promise(async (resolve, reject) => {
            // Set won - turn it a client
            const services = new rdclient.Services(RdStation.getPrivateToken());
            await services.dealLost(reason, email)
                .then(function (data) {
                    // console.log('Request done ', data);
                    console.log('dealLost done statusCode ', data.statusCode);
                    resolve(data.statusCode);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }


    static changeStatusToLead(email, opportunity) {
        return new Promise(async (resolve, reject) => {
            let leads = new rdclient.Leads(RdStation.getPrivateToken());
            await leads.changeStatusToLead(email, opportunity).then(function (data) {
                console.log('changeStatusToLead done statusCode ', data.statusCode);
                resolve(data.statusCode);
            })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    static changeStatusToClient(email, opportunity) {
        return new Promise(async (resolve, reject) => {
            let leads = new rdclient.Leads(RdStation.getPrivateToken());
            await leads.changeStatusToClient(email, opportunity).then(function (data) {
                console.log('changeStatusToClient done statusCode ', data.statusCode);
                resolve(data.statusCode);
            })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    static getToken() {
        return RdStation.token;
    }

    static getPrivateToken() {
        return RdStation.privateToken ;
    }

    static setPrivateToken(token) {
        RdStation.privateToken = token;
    }

    static setToken(token) {
        RdStation.token = token;
    }
}

module.exports = RdStation;