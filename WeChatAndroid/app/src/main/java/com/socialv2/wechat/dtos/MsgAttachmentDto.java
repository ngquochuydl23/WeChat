package com.socialv2.wechat.dtos;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Objects;

public class MsgAttachmentDto implements Serializable {

    @SerializedName("url")
    @Expose
    private String url;

    @SerializedName("mime")
    @Expose
    private String mime;

    @SerializedName("fileName")
    @Expose
    private String fileName;

    @SerializedName("fileSize")
    @Expose
    private String fileSize;

    public MsgAttachmentDto() { }

    public MsgAttachmentDto(String url, String mime, String fileName, String fileSize) {
        this.url = url;
        this.mime = mime;
        this.fileName = fileName;
        this.fileSize = fileSize;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMime() {
        return mime;
    }

    public void setMime(String mime) {
        this.mime = mime;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MsgAttachmentDto)) return false;
        MsgAttachmentDto that = (MsgAttachmentDto) o;
        return Objects.equals(getUrl(), that.getUrl()) && Objects.equals(getMime(), that.getMime()) && Objects.equals(getFileName(), that.getFileName()) && Objects.equals(getFileSize(), that.getFileSize());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getUrl(), getMime(), getFileName(), getFileSize());
    }

    @Override
    public String toString() {
        return "MsgAttachmentDto{" +
                "url='" + url + '\'' +
                ", mime='" + mime + '\'' +
                ", fileName='" + fileName + '\'' +
                ", fileSize='" + fileSize + '\'' +
                '}';
    }
}
