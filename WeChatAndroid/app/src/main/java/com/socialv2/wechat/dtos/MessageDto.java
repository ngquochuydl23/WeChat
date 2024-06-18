package com.socialv2.wechat.dtos;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.socialv2.wechat.BaseDto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

public class MessageDto extends BaseDto implements Serializable {

    @SerializedName("id")
    @Expose
    private String id;

    @SerializedName("type")
    @Expose
    private String type;

    @SerializedName("content")
    @Expose
    private String content;

    @SerializedName("creatorId")
    @Expose
    private String creatorId;

    @SerializedName("roomId")
    @Expose
    private String roomId;

    @SerializedName("attachment")
    @Expose
    private MsgAttachmentDto attachment;

    @SerializedName("seenBys")
    @Expose
    private List<String> seenBys;

    @SerializedName("pinnedBy")
    @Expose
    private String pinnedBy;

    @SerializedName("redeemed")
    @Expose
    private boolean redeemed;

    @SerializedName("redeemedAt")
    @Expose
    private LocalDateTime redeemedAt;

    public MessageDto() { }

    public MessageDto(String id, String type, String content, String creatorId, String roomId, MsgAttachmentDto attachment, List<String> seenBys, String pinnedBy, boolean redeemed, LocalDateTime redeemedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        super(createdAt, updatedAt);
        this.id = id;
        this.type = type;
        this.content = content;
        this.creatorId = creatorId;
        this.roomId = roomId;
        this.attachment = attachment;
        this.seenBys = seenBys;
        this.pinnedBy = pinnedBy;
        this.redeemed = redeemed;
        this.redeemedAt = redeemedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public MsgAttachmentDto getAttachment() {
        return attachment;
    }

    public void setAttachment(MsgAttachmentDto attachment) {
        this.attachment = attachment;
    }

    public List<String> getSeenBys() {
        return seenBys;
    }

    public void setSeenBys(List<String> seenBys) {
        this.seenBys = seenBys;
    }

    public String getPinnedBy() {
        return pinnedBy;
    }

    public void setPinnedBy(String pinnedBy) {
        this.pinnedBy = pinnedBy;
    }

    public boolean isRedeemed() {
        return redeemed;
    }

    public void setRedeemed(boolean redeemed) {
        this.redeemed = redeemed;
    }

    public LocalDateTime getRedeemedAt() {
        return redeemedAt;
    }

    public void setRedeemedAt(LocalDateTime redeemedAt) {
        this.redeemedAt = redeemedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MessageDto)) return false;
        MessageDto that = (MessageDto) o;
        return isRedeemed() == that.isRedeemed() && Objects.equals(getId(), that.getId()) && Objects.equals(getType(), that.getType()) && Objects.equals(getContent(), that.getContent()) && Objects.equals(getCreatorId(), that.getCreatorId()) && Objects.equals(getRoomId(), that.getRoomId()) && Objects.equals(getAttachment(), that.getAttachment()) && Objects.equals(getSeenBys(), that.getSeenBys()) && Objects.equals(getPinnedBy(), that.getPinnedBy()) && Objects.equals(getRedeemedAt(), that.getRedeemedAt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getType(), getContent(), getCreatorId(), getRoomId(), getAttachment(), getSeenBys(), getPinnedBy(), isRedeemed(), getRedeemedAt());
    }

    @Override
    public String toString() {
        return "MessageDto{" +
                "id='" + id + '\'' +
                ", type='" + type + '\'' +
                ", content='" + content + '\'' +
                ", creatorId='" + creatorId + '\'' +
                ", roomId='" + roomId + '\'' +
                ", attachment=" + attachment +
                ", seenBys=" + seenBys +
                ", pinnedBy='" + pinnedBy + '\'' +
                ", redeemed=" + redeemed +
                ", redeemedAt=" + redeemedAt +
                '}';
    }
}
