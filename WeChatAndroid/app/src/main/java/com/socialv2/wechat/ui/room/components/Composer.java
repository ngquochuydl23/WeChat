package com.socialv2.wechat.ui.room.components;

import android.content.Context;
import android.os.Handler;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.socialv2.wechat.R;

public class Composer extends ConstraintLayout {

    private static final long DELAY = 500;
    private static final String TAG = "WeChat.Composer";

    private Context mContext;
    private View mCameraButton;
    private View mPictureButton;
    private View mContainerComposer;
    private View mMicButton;
    private View mMoreComposer;
    private View mSendMessageButton;
    private EditText mContentEditText;
    private Runnable mWorkRunnable;

    private ComposerListener mComposerListener;

    private Handler handler = new Handler();

    public Composer(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        inflate(context, R.layout.layout_room_composer, this);


        this.mContext = context;

        mContainerComposer = findViewById(R.id.containerComposer);
        mCameraButton = findViewById(R.id.cameraButton);
        mPictureButton = findViewById(R.id.pictureButton);
        mMicButton = findViewById(R.id.micButton);
        mMoreComposer = findViewById(R.id.moreComposer);
        mSendMessageButton = findViewById(R.id.sendMessageButton);
        mContentEditText = findViewById(R.id.contentEditText);

        initView();

    }


    public Composer(@NonNull Context context) {
        super(context);

    }

    private void initView() {


        mPictureButton.setOnClickListener(view -> {
//            Keyboard.hide(activity!!, it)
//            if (!galleryBottomSheet.isAdded) {
//                val supportFragmentManager = (activity as AppCompatActivity).supportFragmentManager
//                galleryBottomSheet.show(supportFragmentManager, galleryBottomSheet.tag)
//            }
        });

        mContentEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                Log.i(TAG, "onContentTyping");
                mComposerListener.onContentTyping();
            }
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void afterTextChanged(Editable editable) {
                handler.removeCallbacks(mWorkRunnable);
                mWorkRunnable = new Runnable() {
                    @Override
                    public void run() {
                        Log.i(TAG, "onContentStopTying");
                        mComposerListener.onContentStopTying();
                    }
                };
                handler.postDelayed(mWorkRunnable, DELAY);
            }
        });


    }

    public void clearFocus() {
        mContentEditText.clearFocus();
        mContentEditText.setFocusable(View.NOT_FOCUSABLE);
        mContentEditText.setSelected(false);
    }

    public void setComposerListener(ComposerListener composerListener){
        mComposerListener = composerListener;
    }

    public interface ComposerListener {
        void onContentTyping();

        void onContentStopTying();

        void sendMsg(String content);
    }
}
