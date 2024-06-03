package com.socialv2.wechat.dtos;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Objects;

public class AccountDto implements Serializable {

    @SerializedName("_id")
    @Expose
    private String id;

    @SerializedName("lastName")
    @Expose
    private String lastName;

    @SerializedName("firstName")
    @Expose
    private String firstName;

    @SerializedName("fullName")
    @Expose
    private String fullName;

    @SerializedName("avatar")
    @Expose
    private String avatar;

    @SerializedName("email")
    @Expose
    private String email;

    @SerializedName("phoneNumber")
    @Expose
    private String phoneNumber;

    @SerializedName("actived")
    @Expose
    private Boolean actived;

    @SerializedName("role")
    @Expose
    private String role;

    @SerializedName("gender")
    @Expose
    private Boolean gender;

    public AccountDto() { }

    public AccountDto(String id, String lastName, String firstName, String fullName, String avatar, String email, String phoneNumber, Boolean actived, String role, Boolean gender) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.fullName = fullName;
        this.avatar = avatar;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.actived = actived;
        this.role = role;
        this.gender = gender;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Boolean getActived() {
        return actived;
    }

    public void setActived(Boolean actived) {
        this.actived = actived;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getGender() {
        return gender;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AccountDto that = (AccountDto) o;
        return Objects.equals(id, that.id) && Objects.equals(lastName, that.lastName) && Objects.equals(firstName, that.firstName) && Objects.equals(fullName, that.fullName) && Objects.equals(avatar, that.avatar) && Objects.equals(email, that.email) && Objects.equals(phoneNumber, that.phoneNumber) && Objects.equals(actived, that.actived) && Objects.equals(role, that.role) && Objects.equals(gender, that.gender);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, lastName, firstName, fullName, avatar, email, phoneNumber, actived, role, gender);
    }

    @Override
    public String toString() {
        return "AccountDto{" +
                "id='" + id + '\'' +
                ", lastName='" + lastName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", fullName='" + fullName + '\'' +
                ", avatar='" + avatar + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", actived=" + actived +
                ", role='" + role + '\'' +
                ", gender=" + gender +
                '}';
    }
}
