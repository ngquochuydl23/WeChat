import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";

function ProfilePage() {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      gender: 0,
      birthday: undefined,
      avatar: undefined,
    },
    onSubmit: (values) => {
      //   editUserInfo(values)
      //     .then((res) => console.log(res))
      //     .catch((err) => console.log(err));
    },
  });
  return (
    <>
      <Box>
        <Container maxWidth="sm">
          <Stack alignItems="center" direction="column" spacing="25px">
            <div className="relative rounded-full overflow-hidden flex">
              {/* <CustomAvatar
                fullname={formik.values.fullName}
                onClick={() => document.getElementById("pick-image").click()}
                sx={{
                  height: "180px",
                  width: "180px",
                }}
              /> */}
              <input
                onChange={(event) => {
                  var file = event.target.files[0];
                  //   uploadFile(file)
                  //     .then((res) => {
                  //       console.log("Uploaded");
                  //       var avatar = res.medias[0].url;
                  //       formik.setFieldValue("avatar", avatar);
                  //     })
                  //     .catch((err) => console.log(err));
                }}
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                id="pick-image"
              />
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6"
            >
              <TextField
                fullWidth
                id="fullName"
                label="Họ và tên"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.fullName && formik.touched.fullName}
                helperText={formik.errors.fullName}
                value={formik.values.fullName}
              />
              <TextField
                fullWidth
                sx={{ marginTop: "20px" }}
                id="email"
                label="Địa chỉ email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.email && formik.touched.email}
                helperText={formik.errors.email}
                value={formik.values.email}
              />
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "100%" }}
                  fullWidth
                  id="birthday"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      sx={{ marginTop: "20px" }}
                    />
                  )}
                  onChange={(value) => {
                    formik.setFieldValue(
                      "birthday",
                      moment(value[`$d`]).format()
                    );
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.errors.birthday && formik.touched.birthday}
                  helperText={formik.errors.birthday}
                  value={dayjs(formik.values.birthday)}
                  format="DD/MM/YYYY"
                  label="Ngày sinh"
                />
              </LocalizationProvider> */}
              <TextField
                fullWidth
                select
                sx={{ marginTop: "20px" }}
                onChange={(e) => {
                  formik.setFieldValue("gender", e.target.value);
                }}
                onBlur={formik.handleBlur}
                error={formik.errors.gender && formik.touched.gender}
                helperText={formik.errors.gender}
                value={formik.values.gender}
                id="gender"
                label="Giới tính"
              >
                <MenuItem key={0} value={0}>
                  Nữ
                </MenuItem>
                <MenuItem key={1} value={1}>
                  Nam
                </MenuItem>
              </TextField>
              <TextField
                required
                fullWidth
                sx={{ marginTop: "20px" }}
                id="phoneNumber"
                label="Số điện thoại"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.phoneNumber && formik.touched.phoneNumber}
                helperText={formik.errors.phoneNumber}
                value={formik.values.phoneNumber}
              />
              <Button
                disabled={formik.values === formik.initialValues}
                type="submit"
                fullWidth
                sx={{
                  height: "50px",
                  mt: "30px",
                  mb: "30px",
                }}
                variant="contained"
              >
                Lưu
              </Button>
              <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                // open={openSuccessAlert}
                autoHideDuration={3000}
                // onClose={() => setOpenSuccessAlert(false)}
              >
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  This is a success alert — <strong>check it out!</strong>
                </Alert>
              </Snackbar>
            </form>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default ProfilePage;
