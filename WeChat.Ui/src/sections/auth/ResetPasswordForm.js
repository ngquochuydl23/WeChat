import React from "react";
import * as Yup from 'yup';
import { Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object().shape({
            email: Yup
                .string()
                .required("Nhập đúng Email")
        }),
        onSubmit: async values => {
            navigate('/auth/new-Password');
        },
    });

    return (

        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.email && formik.touched.email}
                    helperText={formik.errors.email}
                    value={formik.values.email}
                />
                <Button
                    fullWidth
                    color="inherit"
                    size="large"
                    type="submit"
                    variant="contained" >
                    Gửi mã
                </Button>
            </Stack>
        </ form>
    );
};
export default ResetPasswordForm;