
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";


export default function RHFTextField({ name, helpText, ...other }) {
    return (
        <>
            <Controller
                name={name}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        fullWidth
                        value={
                            typeof field.name === "number" && field.value === 0 ?
                                "" : field.value
                        } error={!!error}
                        helperText={error ? error.message : helpText}
                        {...other} />
                )} />

        </>
    )
}