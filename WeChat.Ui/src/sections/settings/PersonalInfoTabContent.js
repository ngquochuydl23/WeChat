import BirthdayPicker from "@/components/fields/BirthdayPicker";
import { setUser } from "@/redux/slices/userSlice";
import { updateProfile } from "@/services/profileApiService";
import { LoadingButton } from "@mui/lab";
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const PersonalInfoTabContent = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            userName: user.userName || '',
            bio: user.bio || '',
            birthday: user.birthday || null,
            gender: user.gender || null
        },
        validationSchema: Yup.object().shape({
            firstName: Yup
                .string()
                .required('Vui lòng nhập tên'),
            lastName: Yup
                .string()
                .required('Vui lòng nhập họ'),
            userName: Yup
                .string()
                .matches(/^(?!.*[_.]{2})(?!.*[_.]$)[a-z0-9._]{1,30}$/, "Vui lòng nhập tên hợp lệ")
                .required('Vui lòng nhập tên người dùng'),
            birthday: Yup
                .date()
                .test("birthday", "Phải lớn hơn 16 tuổi", function (value) {
                    return moment().diff(value, 'years', false) >= 16
                })
                .required("Vui lòng nhập ngày sinh"),
            gender: Yup
                .string()
                .required('Vui lòng chọn giới tính')
        }),
        onSubmit: async values => {
            setLoading(true);
            updateProfile(values)
                .then(({ result }) => {
                    const { user } = result;
                    dispatch(setUser(user));
                    enqueueSnackbar(`Cập nhật hồ sơ thành công`, {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right'
                        },
                        preventDuplicate: true
                    });
                })
                .catch((err) => {
                    console.log(err);
                    enqueueSnackbar(`Cập nhật hồ sơ thất bại`, {
                        variant: 'error',
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right'
                        },
                        preventDuplicate: true
                    });
                })
                .finally(() => setLoading(false))
        },
    });
    console.log(formik.errors.gender)
    return (
        <Box px="24px">
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing="30px">
                    <Stack direction="row" spacing="20px">
                        <TextField
                            disabled={loading}
                            fullWidth
                            id="lastName"
                            label="Họ"
                            size="small"
                            sx={{ fontSize: '14px' }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.lastName && formik.touched.lastName}
                            helperText={formik.errors.lastName}
                            value={formik.values.lastName}
                        />
                        <TextField
                            disabled={loading}
                            fullWidth
                            id="firstName"
                            label="Tên"
                            size="small"
                            sx={{ fontSize: '14px' }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.firstName && formik.touched.firstName}
                            helperText={formik.errors.firstName}
                            value={formik.values.firstName}
                        />
                    </Stack>
                    <TextField
                        disabled={loading}
                        fullWidth
                        id="userName"
                        size="small"
                        sx={{ fontSize: '14px' }}
                        label="Tên người dùng"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        FormHelperTextProps={{
                            fontSize: '14px', marginLeft: 0, marginTop: 0
                        }}
                        error={formik.errors.userName && formik.touched.userName}
                        helperText={formik.errors.userName ? formik.errors.userName : ("wechat.com/@" + formik.values.userName)}
                        value={formik.values.userName}
                    />
                    <TextField
                        disabled={loading}
                        fullWidth
                        id="bio"
                        multiline
                        minRows={4}
                        InputLabelProps={{
                            size: '14px'
                        }}
                        label="Tiểu sử"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.bio && formik.touched.bio}
                        helperText={formik.errors.bio}
                        value={formik.values.bio}
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel
                            id="gender.select.label"
                            sx={{
                                backgroundColor: 'white',
                                ...(formik.errors.gender && {
                                    color: 'red',
                                    "&.Mui-focused": {
                                        color: "red"
                                    }
                                })
                            }}
                            shrink={formik.values.year}>
                            {`Giới tính`}
                        </InputLabel>
                        <Select
                            touched
                            size="small"
                            labelId="gender.select.label"
                            id="gender"
                            disabled={loading}
                            sx={{
                                ...(formik.errors.gender && {
                                    "&.MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "red"
                                        },
                                        "& fieldset legend span": {
                                            color: "red"
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "red"
                                        },
                                        "& .MuiSelect-select": {
                                            color: 'red'
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: 'red'
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "red"
                                        }
                                    }
                                })
                            }}
                            value={formik.values.gender}
                            label={`Giới tính`}
                            onBlur={formik.handleBlur}
                            error={formik.errors.gender && formik.touched.gender}
                            helperText={formik.errors.gender}
                            onChange={(event) => {
                                formik.setFieldTouched('gender', true);
                                formik.setFieldValue('gender', event.target.value);
                            }}>
                            <MenuItem value={'female'}>{`Nữ`}</MenuItem>
                            <MenuItem value={'male'}>{`Nam`}</MenuItem>
                        </Select>
                    </FormControl>
                    <BirthdayPicker
                        date={moment(formik.values.birthday)}
                        dayLabel="Ngày"
                        error={formik.errors.birthday}
                        monthLabel="Tháng"
                        yearLabel="Năm"
                        disabled={loading}
                        onChange={(date) => {
                            formik.setFieldValue('birthday', date.toDate())
                        }}
                    />
                </Stack>
                <LoadingButton
                    type="submit"
                    disabled={loading || !_.isEmpty(formik.errors) || !formik.dirty}
                    disableElevation
                    sx={{ mt: '40px' }}
                    fullWidth
                    loading={loading}
                    variant="contained"
                    size="large">
                    Cập nhật hồ sơ
                </LoadingButton>
            </form>
        </Box>
    )
}

export default PersonalInfoTabContent;