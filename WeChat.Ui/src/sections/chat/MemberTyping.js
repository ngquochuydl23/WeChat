import Avatar from '@mui/material/Avatar';
import { Stack } from "@mui/material"
import { useSelector } from "react-redux";
import Lottie from 'react-lottie';
import typingAnimation from '../../lotties/typing-lotties.json'
import { readUrl } from "@/utils/readUrl";

const MemberTyping = ({ members, typingUserIds }) => {
    const { user } = useSelector((state) => state.user);
    return (
        <Stack direction="column" spacing="20px">
            {typingUserIds
                .filter(itemId => itemId !== user._id)
                .map(itemId => {
                    const member = members.find(x => x._id === itemId);

                    if (!member) {
                        return null;
                    }

                    return (
                        <Stack py="10px" spacing="15px" direction="row">
                            <Avatar
                                sx={{ height: '40px', width: '40px' }}
                                alt={member?.fullName}
                                src={readUrl(member?.avatar)} />
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                sx={{
                                    height: '40px',
                                    borderRadius: '20px',
                                    backgroundColor: 'whitesmoke',
                                    border: "2px solid #d3d3d3",
                                    paddingX: "7px",
                                }}
                                direction="column">
                                <Lottie
                                    options={{
                                        loop: true,
                                        autoplay: true,
                                        animationData: typingAnimation,
                                        rendererSettings: {
                                            preserveAspectRatio: "xMidYMid slice"
                                        }
                                    }}
                                    height={"100%"}
                                    width={"100%"}
                                />
                            </Stack>
                        </Stack>
                    )
                })}
        </Stack>
    )
}

export default MemberTyping;