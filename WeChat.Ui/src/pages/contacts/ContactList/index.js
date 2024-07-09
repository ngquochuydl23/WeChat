import ContactItem from "./ContactItem";
import { Avatar, Stack } from "@mui/material";


const ContactList = () => {
    return (
        <Stack direction="column" sx={{ width: '100%', px: '10px' }} spacing="10px">
            <ContactItem />
            <ContactItem />
            <ContactItem />
        </Stack>
    )
}

export default ContactList;