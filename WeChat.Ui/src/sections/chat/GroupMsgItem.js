import { readUrl } from "@/utils/readUrl";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import _ from "lodash";
import moment from "moment";
import { LeftMessage, NotificationMessage, RightMessage } from "./MessageItem";

const GroupMsgItem = ({ user, datetime, groupsInDay, members }) => {
    if (_.isEmpty(groupsInDay)) {
        return null;
    }

    return (
        <Box sx={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <div>
                <Typography fontSize="14px" fontWeight="600">
                    {moment(datetime).calendar()}
                </Typography>
            </div>
            <Stack direction="column" sx={{ width: '100%' }}>
                {_.map((groupsInDay), (messages, idx) => {
                    const creator = _.find(members, x => x._id === messages[0].creatorId);
                    const isNotificationSystem = messages[0].type === 'system-notification';

                    if (isNotificationSystem) {
                        return (
                            <Stack alignSelf="center" alignItems="center" my="10px" spacing="15px" direction="column">
                                {_.map(messages, (message, idx) => (
                                    <div style={{ display: 'flex' }} key={message._id}>
                                        <NotificationMessage
                                            key={message._id}
                                            members={members}
                                            user={members.find(x => x._id === message.creatorId)}
                                            {...message}
                                        />
                                    </div>
                                ))}
                            </Stack>
                        )
                    }

                    if (creator._id !== user._id) {
                        return (
                            <Stack mb="10px" spacing="15px" direction="row" alignSelf="flex-start">
                                <Avatar
                                    alt={creator.fullName}
                                    src={readUrl(creator.avatar)} />
                                <Stack
                                    direction="column"
                                    spacing="2.5px"
                                    display="flex">
                                    {_.map(messages, (message, idx) => (
                                        <div style={{ display: 'flex' }} key={message._id}>
                                            <LeftMessage
                                                sx={{
                                                    ...((idx === 0) && {
                                                        borderRadius: '20px 20px 20px 5px'
                                                    }),
                                                    ...((idx === messages.length - 1) && {
                                                        borderRadius: '5px 20px 20px 20px'
                                                    }),
                                                    ...((idx === 0 && idx === messages.length - 1) && {
                                                        borderRadius: '20px'
                                                    })
                                                }}
                                                content={message.content}
                                                redeem={message.redeem}
                                                attachment={message.attachment}
                                                type={message.type}
                                                user={creator}
                                            />
                                        </div>
                                    ))}
                                </Stack>
                            </Stack>
                        )
                    }

                    return (
                        <Stack mb="10px" spacing="2px" direction="column" alignSelf="flex-end" alignItems="flex-end">
                            {_.map(messages, (message, idx) => (
                                <div style={{ display: 'flex' }} key={message._id}>
                                    <RightMessage
                                        sx={{
                                            ...((idx === 0) && {
                                                borderRadius: '20px 20px 5px 20px'
                                            }),
                                            ...((idx === messages.length - 1) && {
                                                borderRadius: '20px 5px 20px 20px'
                                            }),
                                            ...((idx === 0 && idx === messages.length - 1) && {
                                                borderRadius: '20px'
                                            })
                                        }}
                                        {...message}
                                        msgId={message._id}
                                    // onRedeemMsg={redeemMsg}
                                    />
                                </div>
                            ))}
                        </Stack>
                    )
                })}
            </Stack>
        </Box>
    )

}

export default GroupMsgItem;