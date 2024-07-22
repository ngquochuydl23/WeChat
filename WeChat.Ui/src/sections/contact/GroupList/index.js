import { useEffect, useState } from "react";
import { Avatar, Box, Stack } from "@mui/material";
import { getContacts } from "@/services/contactApiService";
import _ from "lodash";
import GroupItem from "./GroupItem";
import { getRoomList } from "@/services/roomApiService";



const GroupList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getRoomList()
            .then(({ result }) => {
                console.log(result.rooms);
                setRooms(result.rooms);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false);
            })
    }, [])

    return (
        <Box sx={{ width: '100%', px: '10px' }}>
            {loading
                ? <div>Loading</div>
                : <Stack direction="column" spacing="10px">
                    {_.map(rooms, (room) => {
                        return (
                            <GroupItem
                                room={room}/>
                        )
                    })}
                </Stack>
            }
        </Box>

    )
}

export default GroupList;