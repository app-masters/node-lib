let moment = require('moment');

moment.updateLocale('pt-br', require('moment/locale/pt-br'));

class DateTime {
    /**
     *
     * receives both data and period, data is any value like: [{value: String, count: Number}]
     * period is either "month" or "year"
     * @param {String} data
     * @param {String} period
     *
     * returns something like:
     * [{name: String, value: Number}], but filled for all period
     * you dont want to mess here ;)
     */
    static fillIntervalData (data, period, value) {
        let values = period === 'year' ? moment.monthsShort() : [...Array(moment(value, 'MM/YYYY').daysInMonth()).keys()];
        data = data.map(d => Object.assign(d, { value: d.value.split('-')[0] }));
        values = values.map((name, i) => {
            const valueObj = data.find(v => Number(v.value) === i + 1) || {};
            let resObj = {name};
            resObj.value = valueObj.count || 0;
            return resObj;
        }
    );


    static getDateInterval3 (value, period) {
        if (!value || !period) return new Date();
        let initDate;
        let endDate;

        // will set the init and final dates
        initDate = moment(value, period === 'year' ? 'YYYY' : 'MM-YYYY').startOf(period);
        endDate = moment(value, period === 'year' ? 'YYYY' : 'MM-YYYY').endOf(period);

        return {initDate, endDate};
    }

    static getDateInterval2 (filter) {
        if (!filter.initDate || !filter.endDate || !filter.period) {
            console.error('Method GetInterval 2 must receive a full filter object as parameter! filter object includes at least one of initDate and endDate and a period! got: ', filter);
            return ({initDate: null, endDate: null});
        }

        let initDate = filter.initDate || filter.endDate;
        let endDate = filter.endDate || filter.initDate;
        // will set the init and final dates
        initDate = moment(filter.initDate, filter.period === 'year' ? 'YYYY' : 'MM/YYYY').startOf(filter.period || 'day');
        if (!filter.endDate) {
            endDate = moment(filter.initDate, filter.period === 'year' ? 'YYYY' : 'MM/YYYY').endOf(filter.period || 'day');
        } else {
            endDate = moment(filter.endDate, filter.period === 'year' ? 'YYYY' : 'MM/YYYY').endOf(filter.period || 'day');
        }

        initDate = new Date(initDate);
        endDate = new Date(endDate);

        return {initDate, endDate};
    };

    // rounds a date to an unity less than the given period
    // ex: {17/12/2017, 'month'} => {01/12/2017}
    static roundToPeriod (date, period) {
        if (!date || !period) {
            console.error('You must provide a valid date AND a period! got: ', date, period);
            return null;
        }

        return moment(date).startOf(period);
    }


    static getDateInterval (filter) {
        let initDate = '';
        let endDate = '';

        // will set the init and final dates
        initDate = moment(filter.initDate, 'DD/MM/YYYY');
        endDate = moment(filter.endDate, 'DD/MM/YYYY');

        initDate = new Date(initDate);
        endDate = new Date(endDate);

        return {initDate, endDate};
    };

    /**
     *
     * returns two dates based on given parameters.
     * the parameters may be:
     * interval: 'month' or 'period'
     * value: '09/2017' for 'month' interval or 'today', 'week', '28days' for 'period' interval
     *
     * @param {String} interval
     * @param {String} value
     */
    static getDates (interval, value) {
        let initDate = '';
        let finalDate = '';

        // console.log('--->', interval, value);

        // will change to moment method
        if (interval === 'month') {
            let monthYear = value.split('/');
            initDate = moment([monthYear[1], monthYear[0] - 1]).startOf('month').format();
            finalDate = moment([monthYear[1], monthYear[0] - 1]).startOf('month').add(1, 'month').format();

            initDate = new Date(initDate);
            finalDate = new Date(finalDate);
        } else if (interval === 'period') {
            finalDate = moment().endOf('day').format();
            if (value === 'today') {
                initDate = moment().endOf('day').subtract(1, 'day').format();
            } else if (value === 'week') {
                initDate = moment().endOf('day').subtract(7, 'day').format();
            } else if (value === '28days') {
                initDate = moment().endOf('day').subtract(28, 'day').format();
            }
            initDate = new Date(initDate);
            finalDate = new Date(finalDate);
        }
        return {initDate, finalDate};
    };

    static getDateRanges (startDate, interval, format = 'MM-DD-YYYY') {
        // console.log(" ");
        // console.log(" ");
        // console.log("getDateRanges startDate", startDate);
        // Final date is today.
        let finalDate = moment();
        startDate = moment(startDate);

        let stopDate = startDate;
        let dates = [];

        // Loop dates 'till stopDate >= finalDate
        while (finalDate.isSameOrAfter(stopDate)) {
            stopDate = moment(stopDate).add(interval, 'days');
            dates.push({startDate, stopDate});
            startDate = moment(startDate).add(interval, 'days');
        }

        // console.log(" ");
        // console.log("getDateRanges dates", dates);
        // console.log(" ");
        // console.log(" ");
        return dates;

        // Verify if startDate is older than finalDate
        // if (finalDate.isAfter(startDate)) {

        // }
    }

    /**
     * format dates to ISO
     * @param {Date} date to be formated
     */
    static formatDate (date) {
        return moment(date).format();
    }

    /**
     * returns a date in ISO format from giver days ago.
     */
    static daysBefore (days) {
        return moment().startOf('day').subtract(days, 'day').format();
    }
    /**
     * returns a date in ISO format from given hours ago.
     */
    static hoursBefore (hours) {
        return moment().startOf('hour').subtract(hours, 'hour').format();
    }
}

module.exports = DateTime;
