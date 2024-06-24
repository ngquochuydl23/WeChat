import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { readUrl } from './readUrl';
import _ from 'lodash';

export const filterMsgSystem = (content, members = []) => {
    if (content === 'created this room.') {
        return " đã tạo nhóm"
    } else if (content === "creator dispersed this room.") {
        return " đã giải tán nhóm"
    } else if (/^add/.test(content)) {

        let ids = content.match(/\['([^']+)'\]/)[1].split(',');

        var title;

        if (ids.length === 0) {
            const member = members.find(({ _id }) => _id === ids[0]);
            title = member.firstName + ' ';
        } else {
            title = "";
            var temp = [];
            for (let index = 0; index < ids.length - 1; index++) {
                const member = members.find(({ _id }) => _id === ids[index]);
                temp.push(member.firstName);
            }
            const lastMember = members.find(({ _id }) => _id === ids[ids.length - 1])

            if (_.isEmpty(temp.join(", "))) {
                title = lastMember.firstName + ' '
            } else {
                title = temp.join(", ") + ' và ' + lastMember.firstName + ' ';
            }
        }

        return (
            <span style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'inline-flex' }}>
                    đã thêm
                    <AvatarGroup sx={{ mx: '3px' }}>
                        {ids.map(id => {
                            const member = members.find(({ _id }) => _id === id);
                            return (
                                <Avatar
                                    sx={{ width: "20px", height: "20px" }}
                                    alt={member?.fullName}
                                    src={readUrl(member?.avatar)} />
                            )
                        })}
                    </AvatarGroup>
                    <span style={{ marginRight: '3px' }}>{title}</span>
                    vào nhóm
                </div>
            </span>
        );
    } else if (content === 'redeemMsg.') {
        return " đã thu hồi tin nhắn"
    } else if (content === 'leaved this room.') {
        return " đã rời khỏi nhóm"
    }
    return " ";
}

