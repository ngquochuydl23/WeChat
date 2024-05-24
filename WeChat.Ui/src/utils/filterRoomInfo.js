import _ from "lodash";

export const filterRoomInfo = (loggingUserId, room, members) => {

    if (!room || !members) {
        return null;
    }

    if (room.singleRoom) {
        const destMember = members.find(x => x._id !== loggingUserId);
        return {
            title: destMember.fullName,
            subtitle: 'Đang online',
            avatar: destMember.avatar
        };
    }

    if (Boolean(room.title) && room.title.length > 0) {
        return {
            title: room.title,
            subtitle: members.length + ' thành viên',
            avatar: ''
        };
    }

    const otherMembers = _.filter(members, x => x._id !== loggingUserId);
    const title = otherMembers
        .map(item => {
            const fullName = item.fullName;
            return fullName.substring(fullName.lastIndexOf(' '), fullName.length);
        })
        .join(',');

    return {
        title: title + ' và bạn',
        subtitle: members.length + ' thành viên',
        avatar: ''
    };
}