import moment from 'moment';

export function filterChatTime(time) {
 
    var duration = moment.duration(moment().diff(time));
    var days = duration.asDays();


    if (days < 1) {
        return moment(time).format('LT').trim();
    }

    return moment(time).format('L');
}