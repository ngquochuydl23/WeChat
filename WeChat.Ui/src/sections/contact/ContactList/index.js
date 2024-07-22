import { useEffect, useState } from "react";
import ContactItem from "./ContactItem";
import { Avatar, Box, Stack } from "@mui/material";
import { getContacts } from "@/services/contactApiService";
import _ from "lodash";


const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getContacts()
            .then(({ result }) => {
                console.log(result.contacts);
                setContacts(result.contacts);
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
                    {_.map(contacts, (contact) => {
                        return (
                            <ContactItem
                                key={contact._id}
                                contactId={contact._id}
                                user={contact.user} 
                                onDoneUnfriend={(contactId) => {
                                    setContacts(preState => preState.filter(x => x._id !== contactId));
                                }}/>
                        )
                    })}
                </Stack>
            }
        </Box>

    )
}

export default ContactList;