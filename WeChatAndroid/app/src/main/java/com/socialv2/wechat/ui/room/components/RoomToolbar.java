package com.socialv2.wechat.ui.room.components;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

import com.socialv2.wechat.R;
import com.socialv2.wechat.utils.FetchImageUrl;

import de.hdodenhof.circleimageview.CircleImageView;

public class RoomToolbar extends Toolbar {

    private Context mContext;

    private Toolbar mRoomToolbar;
    private CircleImageView mThumbnailImageView;
    private TextView mRoomTitleTextView;
    private TextView mRoomSubtitleTextView;

    public RoomToolbar(@NonNull Context context) {
        super(context);
    }

    public RoomToolbar(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);

        inflate(context, R.layout.layout_room_toolbar, this);


        this.mContext = context;

        mRoomToolbar = findViewById(R.id.roomToolbar);
        mThumbnailImageView = findViewById(R.id.thumbnailImageView);
        mRoomTitleTextView = findViewById(R.id.roomTitleTextView);
        mRoomSubtitleTextView = findViewById(R.id.roomSubtitleTextView);
        initView();
    }

    private void initView() {
        mRoomToolbar.setNavigationOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });
    }

    public void setTitle(String title) {
        mRoomTitleTextView.setText(title);
        invalidate();
    }

    public void setSubtitle(String subtitle) {
        mRoomSubtitleTextView.setText(subtitle);
        invalidate();
    }

    public void setThumbnail(String url) {
        FetchImageUrl.read(mThumbnailImageView, url);
        invalidate();
    }
}
