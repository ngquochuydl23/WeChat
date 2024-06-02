import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";

const NotificationTabContent = () => {
    return (
        <Box sx={{ width: '100%', px: '24px' }}>
            <Typography variant="subtitle1" fontSize="15x">Cài đặt thông báo</Typography>
            <Typography variant="body1" fontSize="14px" color="gray">Nhận được thông báo mỗi khi có tin nhắn mới</Typography>
            <Box mt="10px" bgcolor="white" borderRadius="15px" padding="15px" sx={{ border: '0.2px solid #d3d3d3' }}>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-form-control-label-placement"
                        name="position"
                        defaultValue="turn-on">
                        <FormControlLabel
                            value="turn-on"
                            control={<Radio />}
                            label="Bật"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="turn-off"
                            control={<Radio />}
                            label="Tắt"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Box>
        </Box>
    )
}

export default NotificationTabContent;