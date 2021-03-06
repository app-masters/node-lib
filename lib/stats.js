const restful = require('node-restful');
const mongoose = restful.mongoose;

/**
 * Class to get quantity of something
 * in a determined period of time
 * (use this on dashboard to make reports)
 * @author Igor Phelype
 */
class Stats {
    /**
     * Generic auxiliar method to count things
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date, model: String, matchField: String, returnField: String} params
     * @returns {usersNew}
     */
    static async count(params) {
        if (!params.startDate || !params.endDate) {
            throw new Error('You must especify the startDate and endDate params!');
        }
        if (!params.matchField || !params.returnField) {
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
    static async usersNew(params) {
        let obj = params;
        obj.model = 'user';
        obj.matchField = 'created_at';
        obj.returnField = 'usersNew';
        return await this.count(obj);
    }

    /**
     * Method to get quantity of invites sent
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns
     */
    static async invitesSent(params) {
        let obj = params;
        obj.model = 'invite';
        obj.matchField = 'created_at';
        obj.returnField = 'invitesSent';
        return this.count(obj);
    }

    /**
     * Method to get quantity of invites accepted
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns
     */
    static async invitesAccepted(params) {
        let obj = params;
        obj.model = 'invite';
        obj.matchField = 'acceptedAt';
        obj.returnField = 'invitesAccepted';
        return this.count(obj);
    }

    /**
     * Method to get quantity of users active
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns
     */
    static async usersActive(params) {
        let obj = params;
        obj.model = 'user';
        obj.matchField = 'lastAccessDate';
        obj.returnField = 'usersActive';
        return this.count(obj);
    }

    /**
     * Method to get quantity of users removed
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns
     */
    static async usersRemoved(params) {
        let obj = params;
        params.model = 'user';
        params.matchField = 'removedAt';
        params.returnField = 'usersRemoved';
        return this.count(obj);
    }

    /**
     * Method to get quantity of messages received
     * in a determined period of time
     * @author Igor Phelype
     * @param {startDate: Date, endDate: Date} params
     * @returns
     */
    static async receveidMessages(params) {
        let obj = params;
        params.model = 'user';
        params.matchField = 'emailSentAt';
        params.returnField = 'receveidMessages';
        return this.count(obj);
    }
}

module.exports = Stats;
