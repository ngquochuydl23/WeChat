package com.socialv2.wechat.utils;

import android.annotation.SuppressLint;
import android.content.Context;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.socialv2.wechat.R;


public class FetchImageUrl {
    @SuppressLint("UseCompatLoadingForDrawables")
    public static void read(ImageView imageView, String url, Integer errorResourceId) {
        Context context = imageView.getContext();

        Glide.with(context)
                .load("https://storage.pgonevn.com/api" + url)
                .error(errorResourceId == -1 ? null : context.getDrawable(errorResourceId))
                .into(imageView);
    }

    public static void read(ImageView imageView, String url) {
        read(imageView, url, -1);
    }

    public static void readUrlAsAvatar(ImageView imageView, String url, Boolean gender) {
        read(imageView, url, R.drawable.default_avatar_men);
    }
}
