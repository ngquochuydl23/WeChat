import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Stack,
    TextField,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik"
import { useSnackbar } from "notistack";

const VerifyForm = () => {
    const localEmail = localStorage.getItem('email'); 
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: localEmail,
            otp: ''
        },
        validationSchema: Yup.object().shape({
            // email: Yup
            //     .string()
            //     .required('Vui lòng nhập email'),
            otp: Yup.string()
                .required('Vui lòng nhập otp')
        }),
        onSubmit: async values => {
            console.log(values);
            await axios
                .post("http://localhost:8000/auth/verify", values)
                .then(res => {
                    navigate("/auth/login")
                })
                .catch(err => {
                    enqueueSnackbar(`Xác thực thất bại`, {
                        variant: 'error',
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right'
                        }
                    });
                });
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
                    value={localEmail}
                />

                <TextField
                    fullWidth
                    id="otp"
                    label="Otp"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.otp && formik.touched.otp}
                    helperText={formik.errors.otp}
                    value={formik.values.otp}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                        fullWidth
                        color="primary"
                        size="large"
                        type="submit"
                        variant="contained">
                        Xác thực
                    </Button>

                    <Button
                        href="/auth/resendOtp"
                        fullWidth
                        color="inherit"
                        size="large"
                        type="button"
                        variant="contained"
                    >
                        Gửi lại Otp
                    </Button>
                </Stack>
            </Stack>
            
        </form>
    );
};
export default VerifyForm;
