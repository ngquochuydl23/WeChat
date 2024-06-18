package com.socialv2.wechat.dtos;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.socialv2.wechat.BaseDto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class RoomDto extends BaseDto implements Serializable {

    @SerializedName("_id")
    @Expose
    private String id;

    @SerializedName("title")
    @Expose
    private String title;

    @SerializedName("thumbnail")
    @Expose
    private String thumbnail;

    @SerializedName("members")
    @Expose
    private List<String> members = new ArrayList<>();

    @SerializedName("lastMsg")
    @Expose
    private MessageDto lastMsg;

    @SerializedName("singleRoom")
    @Expose
    private boolean singleRoom;

    @SerializedName("creatorId")
    @Expose
    private String creatorId;

    @SerializedName("dispersed")
    @Expose
    private boolean dispersed;

    @SerializedName("dispersedAt")
    @Expose
    private LocalDateTime dispersedAt;

    public RoomDto() {

    }

    public RoomDto(String id, String title, String thumbnail, List<String> members, MessageDto lastMsg, boolean singleRoom, String creatorId, boolean dispersed, LocalDateTime dispersedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        super(createdAt, updatedAt);
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
        this.members = members;
        this.lastMsg = lastMsg;
        this.singleRoom = singleRoom;
        this.creatorId = creatorId;
        this.dispersed = dispersed;
        this.dispersedAt = dispersedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public MessageDto getLastMsg() {
        return lastMsg;
    }

    public void setLastMsg(MessageDto lastMsg) {
        this.lastMsg = lastMsg;
    }

    public boolean isSingleRoom() {
        return singleRoom;
    }

    public void setSingleRoom(boolean singleRoom) {
        this.singleRoom = singleRoom;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public boolean isDispersed() {
        return dispersed;
    }

    public void setDispersed(boolean dispersed) {
        this.dispersed = dispersed;
    }

    public LocalDateTime getDispersedAt() {
        return dispersedAt;
    }

    public void setDispersedAt(LocalDateTime dispersedAt) {
        this.dispersedAt = dispersedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RoomDto)) return false;
        RoomDto roomDto = (RoomDto) o;
        return isSingleRoom() == roomDto.isSingleRoom() && isDispersed() == roomDto.isDispersed() && Objects.equals(getId(), roomDto.getId()) && Objects.equals(getTitle(), roomDto.getTitle()) && Objects.equals(getThumbnail(), roomDto.getThumbnail()) && Objects.equals(getMembers(), roomDto.getMembers()) && Objects.equals(getLastMsg(), roomDto.getLastMsg()) && Objects.equals(getCreatorId(), roomDto.getCreatorId()) && Objects.equals(getDispersedAt(), roomDto.getDispersedAt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTitle(), getThumbnail(), getMembers(), getLastMsg(), isSingleRoom(), getCreatorId(), isDispersed(), getDispersedAt());
    }

    @Override
    public String toString() {
        return "RoomDto{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", thumbnail='" + thumbnail + '\'' +
                ", members=" + members +
                ", lastMsg=" + lastMsg +
                ", singleRoom=" + singleRoom +
                ", creatorId='" + creatorId + '\'' +
                ", dispersed=" + dispersed +
                ", dispersedAt=" + dispersedAt +
                '}';
    }
}
