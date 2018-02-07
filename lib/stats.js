var restful = require('node-restful');
var mongoose = restful.mongoose;

class Stats {
    /**
     * Generic auxiliar method to count things
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date, model: String, matchField: String, returnField: String} params
     * @returns {usersNew}
     */
    static async count(params){
        if(!params.startDate || !params.endDate){
            throw new Error('You must especify the startDate and endDate params!');
        }
        if(!params.matchField || !params.returnField){
            throw new Error('You must especify the matchField and returnField params!');
        }
        // console.log(params);        
        let model = mongoose.model(params.model);
        let response = null;
        let query = [
            {
                $match: {
                    [params.matchField]: {
                        $gte: params.startDate,
                        $lte: params.endDate
                    }
                }
            },
            {
                $count: params.returnField
            }
        ];
        response = await model.aggregate(query);
        // console.log(params.model, response);       
        return (response.length > 0) ? response[0] : {[params.returnField]: 0};
    }
    /**
     * Method to get the quantity of new users registered
     * in a determined period of time 
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns {usersNew}
     */
    static async usersNew(params){
        let response = null;
        let obj = {
            ...params,
            model: 'user',
            matchField: 'created_at',
            returnField: 'usersNew'
        }
        response = await this.count(obj);
        // console.log(response);       
        return response;
    }

    /**
     * Method to get quantity of invites sent
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns 
     */
    static async invitesSent(params){
        let response = null;
        let obj = {
            ...params,
            model: 'invite',
            matchField: 'created_at',
            returnField: 'invitesSent'
        }
        response = this.count(obj);
        return response;
    }

    /**
     * Method to get quantity of invites accepted
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns 
     */
    static async invitesAccepted(params){
        let response = null;
        let obj = {
            ...params,
            model: 'invite',
            matchField: 'acceptedAt',
            returnField: 'invitesAccepted'
        }
        response = this.count(obj);
        return response;
    }

    /**
     * Method to get quantity of users active
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns 
     */
    static async usersActive(params){
        let response = null;
        let obj = {
            ...params,
            model: 'user',
            matchField: 'lastAccessDate',
            returnField: 'usersActive'
        }
        response = this.count(obj);
        return response;
    }

    /**
     * Method to get quantity of users removed
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns 
     */
    static async usersRemoved(params){
        let response = null;
        let obj = {
            ...params,
            model: 'user',
            matchField: 'removedAt',
            returnField: 'usersRemoved'
        }
        response = this.count(obj);
        return response;
    }
};
module.exports = Stats;
