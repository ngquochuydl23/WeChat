import { Stack, Skeleton } from "@mui/material";

const UserSkeleton = () => {
    return (
        <Stack direction="row">
            <Skeleton
                animation="wave"
                variant="circular"
                width="50px"
                height="50px" />
            <Stack
                ml="10px"
                direction="column"
                sx={{ width: '80%' }}>
                <Skeleton
                    animation="wave"
                    height="20px"
                    width="80%"
                />
                <Skeleton
                    animation="wave"
                    height="15px"
                    width="40%" />
            </Stack>
        </Stack>
    )
}

export default UserSkeleton;