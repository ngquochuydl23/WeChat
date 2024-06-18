package com.socialv2.wechat.utils;

import android.content.Context;
import android.content.Intent;

public class NavigateUtil {

    public static void navigateTo(Context ctx, Class<?> activityClass) {
        Intent intent = new Intent(ctx, activityClass);
        ctx.startActivity(intent);
    }
}
