import { Box, Typography, Avatar, Button, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Grid, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AddMemberDialog from "./AddMemberDialog";
import { filterRoomInfo } from "../../utils/filterRoomInfo";
import { readUrl } from "@/utils/readUrl";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Scrollbars from "react-custom-scrollbars-2";
import IcCamera from "@/assets/icons/IcCamera";
import { uploadFile } from "@/services/storageApi";
import { patchThumnail } from "@/services/roomApiService";
import _ from "lodash";
import IcIditName from "@/assets/icons/IcIditName";
import RenameRoomDialog from "./RenameRoomDialog";

const RoomDetail = ({
    room,
    members,
    loggingUserId,
    onDispersedRoom,
    onAddMember,
    medias = []
}) => {
    const info = filterRoomInfo(loggingUserId, room, members);
    const [open, setOpen] = useState(false);
    const [openRenameRoomDialog, setOpenRenameRoomDialog] = useState(false);


    const onPickFile = (event) => {
        uploadFile(event.target.files[0])
            .then(res => {
                const { url } = res.data.files[0];
                patchThumnail(room._id, url)
                    .then(({ result }) => { console.log(result) })
                    .catch((err) => console.log(err))
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <Scrollbars style={{ width: "350px", height: '100vh' }}>
            <Box sx={{ width: "350px", height: "100%", display: "flex", flexDirection: "column", borderLeft: '0.5px solid #d3d3d3' }} >
                <Box
                    py="30px"
                    sx={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }} >
                    <Box sx={{ position: 'relative', height: "90px", display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Avatar
                            sx={{
                                width: "90px",
                                height: "90px",
                                border: '5px solid #d3d3d3',
                                position: 'relative',
                                ...((info.avatar) ? {
                                    padding: 0,
                                    border: '5px solid #d3d3d3',
                                } : {
                                    padding: '7px',
                                    backgroundColor: 'whitesmoke',
                                    border: '1px solid #d3d3d3',
                                }),
                            }}
                            alt={info.title}
                            src={info.avatar ? readUrl(info.avatar) : require('@/assets/Illustration/no_thumbnail_room.png')} />
                        {!room.singleRoom &&
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    backgroundColor: 'whitesmoke',
                                    '&:hover': {
                                        backgroundColor: 'white'
                                    }
                                }}
                                onClick={() => document?.getElementById('thumbnail.picker')?.click()}>
                                <IcCamera />
                            </IconButton>
                        }
                        <input
                            onChange={onPickFile}
                            style={{ display: "none" }}
                            type="file"
                            multiple
                            accept="image/*"
                            id="thumbnail.picker" />
                    </Box>
                    <Box sx={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                        <Typography mt="10px" fontSize="18px" fontWeight="800">
                            {info.title}
                            <span>
                                <IconButton
                                    size="small"
                                    sx={{ marginLeft: '10px', backgroundColor: 'whitesmoke' }}
                                    onClick={() => setOpenRenameRoomDialog(true)}>
                                    <IcIditName />
                                </IconButton>
                            </span>
                        </Typography>
                        {!room.singleRoom
                            ? <Typography mt="10px" fontSize="16px" fontWeight="500">
                                {info.subtitle}
                                {!room.singleRoom &&
                                    <IconButton onClick={() => setOpen(true)}>
                                        <PersonAddAltOutlinedIcon />
                                    </IconButton>
                                }
                            </Typography>
                            : <Button sx={{ marginTop: "20px", borderRadius: '20px' }} variant="outlined" size="small">
                                Xem trang cá nhân
                            </Button>
                        }
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flex: 1, flexGrow: 1, flexDirection: 'column' }}>
                    <Accordion elevation={0} defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header">
                            <Typography fontWeight="600" fontSize="15px">
                                {`Hình ảnh và video`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ paddingY: 0 }}>
                            <Grid container spacing={'5px'}>
                                {_.map(medias, ({ attachment }, index) => {
                                    return (
                                        <Grid item xs={3} md={3}>
                                            <img
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    aspectRatio: 1,
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                    border: '1px solid #d3d3d3'
                                                }}
                                                key={index}
                                                alt="file"
                                                src={readUrl(attachment.url)}
                                            />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion elevation={0}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header">
                            <Typography fontWeight="600" fontSize="15px">
                                {`Tập tin`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion elevation={0}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header">
                            <Typography fontWeight="600" fontSize="15px">
                                {`Link`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </AccordionDetails>
                    </Accordion>
                </Box>
                {(loggingUserId === room.creatorId && !room.singleRoom) && (
                    <Button
                        sx={{ marginX: "15px", marginY: "10px", borderRadius: '20px' }}
                        onClick={() => onDispersedRoom(room._id)}
                        color="error"
                        variant="outlined">
                        Giải tán nhóm
                    </Button>
                )}
                {!room.singleRoom &&
                    <AddMemberDialog
                        room={room}
                        members={members}
                        open={open}
                        addMemberToRoom={onAddMember}
                        onClose={() => setOpen(false)}
                    />
                }
            </Box>
            <RenameRoomDialog
                room={room}
                members={members}
                loggingUserId={loggingUserId}
                open={openRenameRoomDialog}
                onClose={() => setOpenRenameRoomDialog(false)} />
        </Scrollbars >
    );
};

export default RoomDetail;
