let RdStation = require('./am-rdstation');

class LeadManager {

    static async createConversion(identifier, email, name, customFields) {
        if (!LeadManager.sendToRd()) return false;

        let obj = {};
        if (email)
            obj.email = email;
        if (name)
            obj.name = name;

        if (customFields) {
            obj = Object.assign(obj, customFields);
        }

        let result = await RdStation.createConversion(identifier, email, name, customFields);
        return result === 200;
    }

    static async dealWon(email, value) {
        if (!LeadManager.sendToRd()) return false;
        let result = await RdStation.dealWon(email, value);
        return result === 200;
    }

    static async dealLost(email, reason) {
        if (!LeadManager.sendToRd()) return false;
        let result = await RdStation.dealLost(email, reason);
        return result === 200;
    }

    static async changeStatusToLead(email, opportunity) {
        if (!LeadManager.sendToRd()) return false;
        let result = await RdStation.changeStatusToLead(email,opportunity);
        return result === 200;
    }

    static async changeStatusToClient(email, opportunity) {
        if (!LeadManager.sendToRd()) return false;
        let result = await RdStation.changeStatusToClient(email, opportunity);
        return result === 200;
    }

    static setRdToken(privateToken, token) {
        RdStation.setPrivateToken(privateToken);
        RdStation.setToken(token);
        LeadManager.tokenSet = true;
    }

    static sendToRd() {
        if (!LeadManager.tokenSet){
            console.log(" >>>> RdStation Token not set. Don't will send data.");
        }
        return LeadManager.tokenSet;
    }
}
LeadManager.tokenSet = false;

module.exports = LeadManager;