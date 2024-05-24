export const filterMsgSystem = (content, members = []) => {
    if (content === 'created this room.') {
        return " đã tạo nhóm"
    } else if (content === "creator dispersed this room.") {
        return " đã giải tán nhóm"
    } else if (/^add/.test(content)) {
        var matches = content.match(/'(.*?)'/g)
        var userId = matches ? matches[0] : null;
        userId = userId.replace(/'/g, '');
        const newMember = members.find(x => x._id === userId);

        return ` đã thêm ${newMember.fullName} vào nhóm`;
    } else if (content === 'redeemMsg.') {
        return " đã thu hồi tin nhắn"
    }
    return " ";
}

