import { readUrl } from "@/utils/readUrl";
import { Avatar, Box, Button, Icon, Stack, Typography } from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";


const data = [
    {
        "isDeleted": false,
        "_id": "6650bb07d51b54a5c039f3fb",
        "fullName": "박 선영",
        "phoneNumber": "0868684961",
        "email": "nguyenquochuydl123@gmail.com",
        "createdAt": "2024-05-24T16:06:31.184Z",
        "updatedAt": "2024-05-28T14:19:19.958Z",
        "__v": 0,
        "avatar": "/api/bucket/665084baa340536c521c22b1/NDJiMzM4NTNmNmY0ODYyNDNkY2YxZjRlZjIzM2Q1NmMuanBn",
        "bio": "Moment of Love 2022 🤎 여러모로 나에겐 선물 같았던 2022년. 고마웠어~ 안녕!",
        "firstName": "Quốc Huy",
        "lastName": "Nguyễn",
        "userName": "s_ylll"
    },
    {
        "_id": "66536e9b0da85ecbda10d51c",
        "firstName": "Nguyễn",
        "lastName": "Kiều Anh",
        "fullName": "Sharasuo",
        "phoneNumber": "0868684962",
        "email": "nguyenthikieuanh@gmail.com",
        "avatar": "/api/bucket/665084baa340536c521c22b1/ZjNkNzM2YWExODZkYTE2ZDY3YzM0YzhkOTI0YjlkMTEuanBn",
        "isDeleted": false,
        "createdAt": "2024-05-26T17:17:15.082Z",
        "updatedAt": "2024-05-26T17:17:15.082Z",
        "__v": 0,
        "userName": "sharasuo"
    }
];

const BlockUserTabContent = ({ onNavigate }) => {

    const [blockUsers, setBlockUsers] = useState([]);
    useEffect(() => {
        setBlockUsers(data);
    }, [])

    const removeUserBlock = (id) => {

    }

    const BlockUserItem = ({
        _id,
        fullName,
        phoneNumber,
        avatar,
        bio,
        firstName,
        lastName,
        userName,
        onRemoveBlocked
    }) => {
        return (
            <Stack direction="row" alignItems="center" display="flex">
                <Avatar src={readUrl(avatar)} />
                <Typography
                    display="flex"
                    flex="1"
                    variant="subtitle1"
                    fontSize="15x"
                    ml="15px">
                    {fullName}
                </Typography>
                <Button
                    variant="outlined"
                    width="200px"
                    size="small"
                    onClick={() => onRemoveBlocked(_id)}>
                    {`Bỏ chặn`}
                </Button>
            </Stack>
        )
    }

    return (
        <Stack direction="column" spacing="15px" px="24px">
            <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" fontSize="15x">Chặn tin nhắn</Typography>
                <Typography fontSize="14px" fontWeight="500">
                    Những người này không thể nhắn tin cho bạn
                </Typography>
                <Stack mt="15px" direction="column" spacing="15px" my="15px">
                    {_.map(blockUsers, (user) => (
                        <BlockUserItem
                            {...user}
                            onRemoveBlocked={removeUserBlock} />
                    ))}
                </Stack>
            </Box>

        </Stack>
    )
}

export default BlockUserTabContent;