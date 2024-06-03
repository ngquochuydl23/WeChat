package com.socialv2.wechat;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;

import java.io.Serializable;

public abstract class BaseSharedPreferences<T extends Object> {

    private Context context;
    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;

    private String keyName;
    private Class<T> tClass;

    public BaseSharedPreferences(Context context, String keyName, Class<T> tClass) {
        this.tClass = tClass;
        this.context = context;
        this.sharedPreferences = context.getSharedPreferences(keyName, Context.MODE_PRIVATE);
        this.editor = sharedPreferences.edit();
        this.keyName = keyName;
        this.tClass = tClass;
    }

    @SuppressLint("CommitPrefEdits")
    public void setData(T data) {
        if (data instanceof String) {
            editor.putString(keyName, (String) data).commit();
        } else {
            editor.putString(keyName, new Gson().toJson(data)).commit();
        }
    }

    public T getData() {
        String jsonResult = sharedPreferences.getString(keyName, null);
        try {
            if (tClass.newInstance() instanceof String) {
                return (T) sharedPreferences.getString(keyName, null);
            }
        } catch (IllegalAccessException e) {
            return null;
        } catch (InstantiationException e) {
            return null;
        }
        return new Gson().fromJson(jsonResult, tClass);
    }

    public void clear() {
        editor.clear().apply();
    }

    public SharedPreferences getSharedPreferences() {
        return sharedPreferences;
    }
}