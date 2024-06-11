export function getGroupChatTitle(users, loggingUserId) {
    const otherMembers = users.filter(x => x._id !== loggingUserId);
    const title = otherMembers
        .map(item => item.firstName)
        .join(',');

    return title + ' và bạn';
}