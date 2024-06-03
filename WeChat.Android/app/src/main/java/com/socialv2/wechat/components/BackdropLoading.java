package com.socialv2.wechat.components;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.socialv2.wechat.R;


public class BackdropLoading extends ConstraintLayout {

    private Context context;

    public BackdropLoading(Context context) {
        super(context);
        init(context);
    }

    public BackdropLoading(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public BackdropLoading(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init(context);
    }

    private void init(Context context) {
        this.context = context;

        inflate(context, R.layout.layout_loading_backdrop, this);
        setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {

            }
        });
        setLoading(false);
    }

    public void setLoading(Boolean loading) {
        setVisibility(loading ? View.VISIBLE : View.GONE);

        if (context instanceof Activity) {
            ((Activity) context)
                    .getWindow()
                    .setStatusBarColor(context.getColor(loading ? R.color.trans50 : R.color.white));
        }
        invalidate();
    }
}
