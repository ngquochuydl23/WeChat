package com.socialv2.wechat.sharedReferences;

import android.content.Context;

import com.socialv2.wechat.BaseSharedPreferences;

public class SaveTokenSharedPreference extends BaseSharedPreferences<String> {

    private static final String KeyName = "accessToken";

    public SaveTokenSharedPreference(Context context) {
        super(context, KeyName, String.class);
    }
}
