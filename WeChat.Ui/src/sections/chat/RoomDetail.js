import { Box, Typography, Avatar, Button, Accordion, AccordionSummary, AccordionDetails, AccordionActions, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AddMemberDialog from "./AddMemberDialog";
import { filterRoomInfo } from "../../utils/filterRoomInfo";
import { readUrl } from "@/utils/readUrl";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Scrollbars from "react-custom-scrollbars-2";

const RoomDetail = ({
    room,
    members,
    loggingUserId,
    onDispersedRoom,
    onAddMember
}) => {
    const info = filterRoomInfo(loggingUserId, room, members);
    const [open, setOpen] = useState(false);

    return (
        <Scrollbars style={{ width: "350px", height: '100vh' }}>
            <Box sx={{ width: "350px", height: "100%", display: "flex", flexDirection: "column", borderLeft: '0.5px solid #d3d3d3' }} >
                <Box
                    py="30px"
                    sx={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }} >
                    <Avatar
                        sx={{ width: "90px", height: "90px", border: '5px solid #d3d3d3' }}
                        alt={info.title}
                        src={readUrl(info.avatar)}
                    />
                    {room.singleRoom ? (
                        <Box sx={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                            <Typography mt="10px" fontSize="18px" fontWeight="800">{info.title}</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                            <Typography mt="10px" fontSize="18px" fontWeight="800">{info.title}</Typography>
                            <Typography mt="10px" fontSize="16px" fontWeight="500">
                                {info.subtitle}
                                {!room.singleRoom &&
                                    <IconButton onClick={() => setOpen(true)}>
                                        <PersonAddAltOutlinedIcon />
                                    </IconButton>
                                }
                            </Typography>
                        </Box>
                    )}
                    {room.singleRoom && (
                        <Button sx={{ marginTop: "20px", borderRadius: '20px' }} variant="outlined" size="small">
                            Xem trang cá nhân
                        </Button>
                    )}
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
                        <AccordionDetails>
                            <Grid container spacing={'5px'}>
                                <Grid item xs={4} md={4}>
                                    <img
                                        style={{ width: '100%', height: '100%', aspectRatio: 1, objectFit: 'cover', borderRadius: '5px' }}
                                        key={1}
                                        alt="file"
                                        src="https://lh3.googleusercontent.com/pw/AP1GczOZil3-Thc07VmjpIdQXnbpE7JGd4noxwpX5YLkOJLM4AU3eStsUeopVGMIikLTNnKhZ-tGr_6G7RFO0sa4Gt5m1oUQcUIdwIOe3O4vqLd_jlK57i8USar2Nlu20mtvPV2K5ykRwTkpmhZdN6KozcgRxvTPK6TPhLqVAq_vw-L5GPVtRwEqxiGuKiEBDekw12BMWIo5uPaL-rv-GIBK_C2xUiK16l6ImQxARXjVEV0M5CEYBefbMuEe_g7XlDiWj3y-OVGEU8hO_VS3U84aAHUNaZssff51kLtzhy83eZirX_26n1CYP7dQnF5s3AFKNW0WskGN8P0UF5t8GkLk87sbW9KHZ84repj0QSuhq3dBzEkYUygGnfP6XS1xcbYZdPMkNbTrmdbd3Yh_vcYwGX8rBbKZimoiCw2ksXFIo6zMDu2fgh1gGTNegAZkEYads8pGt2Ia5uGDM5axyS0FtxMsNGfYm8HF6Cfcpe0KuX0xrpwaWXJWVHSLl0rj8NkZK2D2xyBThKtSQlaIrN_-osJ4gzzBbQ1CnB9o1BEflf4m5d8ntp0d7dBKc_LYfJRm9Go99vtXe7E39Oko7B_RP1fZvFQ0sEIXo7g6HczfHS-CVpVxLENZqjLTObncHPCnwu-6EYEIleGvmUsnyJa5DOC3hpQX2vxt5Ltw6yJGyu1WaUqDLLTJt8zGCOxUQD5RdCko49iFVqHZV8XI9Vtq7ox1RO6DMNeKOx6aqchn5IkO2Zs5f3Z99tEWukQwSfYjt1NYB9AUtKWLZdjlGWeJH4KP0RGNjHHD2-qkx9_BBTrx57yFwYv7NiSYmPiP-b-K5glHzLHFP-tpAXHKAyVVnQuLOaOwP6tVMbG7abfW5muk57ILUmpLk6DxkX29lPVO3yyZ-pM_TU0R69rOQMq_h5BUmA=w489-h869-s-no-gm?authuser=0"
                                    />
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <img
                                        style={{ width: '100%', height: '100%', aspectRatio: 1, objectFit: 'cover', borderRadius: '5px' }}
                                        key={1}
                                        alt="file"
                                        src="https://lh3.googleusercontent.com/pw/AP1GczOZil3-Thc07VmjpIdQXnbpE7JGd4noxwpX5YLkOJLM4AU3eStsUeopVGMIikLTNnKhZ-tGr_6G7RFO0sa4Gt5m1oUQcUIdwIOe3O4vqLd_jlK57i8USar2Nlu20mtvPV2K5ykRwTkpmhZdN6KozcgRxvTPK6TPhLqVAq_vw-L5GPVtRwEqxiGuKiEBDekw12BMWIo5uPaL-rv-GIBK_C2xUiK16l6ImQxARXjVEV0M5CEYBefbMuEe_g7XlDiWj3y-OVGEU8hO_VS3U84aAHUNaZssff51kLtzhy83eZirX_26n1CYP7dQnF5s3AFKNW0WskGN8P0UF5t8GkLk87sbW9KHZ84repj0QSuhq3dBzEkYUygGnfP6XS1xcbYZdPMkNbTrmdbd3Yh_vcYwGX8rBbKZimoiCw2ksXFIo6zMDu2fgh1gGTNegAZkEYads8pGt2Ia5uGDM5axyS0FtxMsNGfYm8HF6Cfcpe0KuX0xrpwaWXJWVHSLl0rj8NkZK2D2xyBThKtSQlaIrN_-osJ4gzzBbQ1CnB9o1BEflf4m5d8ntp0d7dBKc_LYfJRm9Go99vtXe7E39Oko7B_RP1fZvFQ0sEIXo7g6HczfHS-CVpVxLENZqjLTObncHPCnwu-6EYEIleGvmUsnyJa5DOC3hpQX2vxt5Ltw6yJGyu1WaUqDLLTJt8zGCOxUQD5RdCko49iFVqHZV8XI9Vtq7ox1RO6DMNeKOx6aqchn5IkO2Zs5f3Z99tEWukQwSfYjt1NYB9AUtKWLZdjlGWeJH4KP0RGNjHHD2-qkx9_BBTrx57yFwYv7NiSYmPiP-b-K5glHzLHFP-tpAXHKAyVVnQuLOaOwP6tVMbG7abfW5muk57ILUmpLk6DxkX29lPVO3yyZ-pM_TU0R69rOQMq_h5BUmA=w489-h869-s-no-gm?authuser=0"
                                    />
                                </Grid>
                                <Grid item xs={4} md={4}>
                                    <img
                                        style={{ width: '100%', height: '100%', aspectRatio: 1, objectFit: 'cover', borderRadius: '5px' }}
                                        key={1}
                                        alt="file"
                                        src="https://lh3.googleusercontent.com/pw/AP1GczOZil3-Thc07VmjpIdQXnbpE7JGd4noxwpX5YLkOJLM4AU3eStsUeopVGMIikLTNnKhZ-tGr_6G7RFO0sa4Gt5m1oUQcUIdwIOe3O4vqLd_jlK57i8USar2Nlu20mtvPV2K5ykRwTkpmhZdN6KozcgRxvTPK6TPhLqVAq_vw-L5GPVtRwEqxiGuKiEBDekw12BMWIo5uPaL-rv-GIBK_C2xUiK16l6ImQxARXjVEV0M5CEYBefbMuEe_g7XlDiWj3y-OVGEU8hO_VS3U84aAHUNaZssff51kLtzhy83eZirX_26n1CYP7dQnF5s3AFKNW0WskGN8P0UF5t8GkLk87sbW9KHZ84repj0QSuhq3dBzEkYUygGnfP6XS1xcbYZdPMkNbTrmdbd3Yh_vcYwGX8rBbKZimoiCw2ksXFIo6zMDu2fgh1gGTNegAZkEYads8pGt2Ia5uGDM5axyS0FtxMsNGfYm8HF6Cfcpe0KuX0xrpwaWXJWVHSLl0rj8NkZK2D2xyBThKtSQlaIrN_-osJ4gzzBbQ1CnB9o1BEflf4m5d8ntp0d7dBKc_LYfJRm9Go99vtXe7E39Oko7B_RP1fZvFQ0sEIXo7g6HczfHS-CVpVxLENZqjLTObncHPCnwu-6EYEIleGvmUsnyJa5DOC3hpQX2vxt5Ltw6yJGyu1WaUqDLLTJt8zGCOxUQD5RdCko49iFVqHZV8XI9Vtq7ox1RO6DMNeKOx6aqchn5IkO2Zs5f3Z99tEWukQwSfYjt1NYB9AUtKWLZdjlGWeJH4KP0RGNjHHD2-qkx9_BBTrx57yFwYv7NiSYmPiP-b-K5glHzLHFP-tpAXHKAyVVnQuLOaOwP6tVMbG7abfW5muk57ILUmpLk6DxkX29lPVO3yyZ-pM_TU0R69rOQMq_h5BUmA=w489-h869-s-no-gm?authuser=0"
                                    />
                                </Grid>
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
                        sx={{ marginX: "15px", marginY: "10px" }}
                        onClick={() => onDispersedRoom(room._id)}
                        color="error"
                        variant="contained">
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
        </Scrollbars >
    );
};

export default RoomDetail;
