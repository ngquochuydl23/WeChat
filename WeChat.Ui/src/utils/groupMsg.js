import _ from "lodash";
import moment from "moment";

export const groupMsg = (messages) => {
    var groupToDayForm = function (group, datetime) {
        return {
            datetime: datetime,
            messages: group
        }
    };

    var resultAsDays = _.chain(messages)
        .groupBy((obj) => moment(obj.createdAt).format('DD-MMM-YYYY'))
        .map(groupToDayForm)
        .value();


    return resultAsDays.map(({ datetime, messages }) => ({
        datetime,
        groupsInDay: groupMsgWithThreshold(messages)
    }));
}

export const groupMsgWithThreshold = (messages) => {

    const timeThreshold = 5 * 60 * 1000;

    messages.forEach(message => {
        message.createdAt = new Date(message.createdAt);
    });

    // Sort messages by createdAt time
    const sortedMessages = _.sortBy(_.filter(messages, msg => msg !== 'system-notification' && msg.content !== 'redeemMsg.'), 'createdAt');
    // const sortedMessages = messages;
    // Group messages into arrays based on the time threshold
    const groupedMessages = [];
    let currentGroup = [];

    sortedMessages.forEach((message, index) => {
        if (index === 0) {
            currentGroup.push(message);
            groupedMessages.push(currentGroup);
        } else {
            const timeDifference = message.createdAt - sortedMessages[index - 1].createdAt;


            if (message.type === 'system-notification') {

                if (sortedMessages[index - 1].type === 'system-notification') {
                    currentGroup.push(message);
                } else {
                    currentGroup = [message];
                    groupedMessages.push(currentGroup);
                }
            } else {
                if (timeDifference <= timeThreshold
                    && message.creatorId === sortedMessages[index - 1].creatorId
                    && sortedMessages[index - 1].type !== 'system-notification') {
                    currentGroup.push(message);
                } else {

                    currentGroup = [message];
                    groupedMessages.push(currentGroup);
                }
            }
        }
    });

    return groupedMessages;
}