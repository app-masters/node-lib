let moment = require('moment');

moment.updateLocale('pt-br', require('moment/locale/pt-br'));

class DateTime {
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
