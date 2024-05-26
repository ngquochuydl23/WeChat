import axios from "axios"
import _ from "lodash";

export const uploadFile = (file) => {
    console.log();
    return uploadMultiFile([file]);
}

export const uploadMultiFile = (files) => {

    var bodyFormData = new FormData();

    _.forEach(files, item => {
        bodyFormData.append('', item);
    })

    return axios({
        method: "post",
        url: process.env.REACT_APP_API_STORAGE_API + 'upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": localStorage.getItem("accessToken")
        },
    })
}