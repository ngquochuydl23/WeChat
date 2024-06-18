package com.socialv2.wechat.ui.main.chat;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.socialv2.wechat.BaseAdapter;
import com.socialv2.wechat.R;
import com.socialv2.wechat.dtos.RoomDto;
import com.socialv2.wechat.ui.room.RoomActivity;
import com.socialv2.wechat.utils.NavigateUtil;

import org.w3c.dom.Text;

import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;


public class RoomChatAdapter extends BaseAdapter<RoomDto> {

    public RoomChatAdapter(List<RoomDto> list) {
        super(list);
    }

    @Override
    protected RecyclerView.ViewHolder getViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater
                .from(getContext())
                .inflate(R.layout.item_room_chat, parent, false);
        return new RoomChatViewHolder(view);
    }

    @Override
    protected void bind(@NonNull RecyclerView.ViewHolder viewHolder, RoomDto room) {
        RoomChatViewHolder roomChatItem = (RoomChatViewHolder) viewHolder;

        roomChatItem.mItemContainerView.setOnClickListener(view -> {
            NavigateUtil.navigateTo(getContext(), RoomActivity.class);
        });
    }

    public class RoomChatViewHolder extends RecyclerView.ViewHolder {

        private CircleImageView mAvatarImageView;
        private TextView mRoomTitleTextView;
        private TextView mContentChatTextView;
        private View mItemContainerView;

        public RoomChatViewHolder(@NonNull View itemView) {
            super(itemView);

            mAvatarImageView = itemView.findViewById(R.id.avatarImageView);
            mRoomTitleTextView = itemView.findViewById(R.id.roomTitleTextView);
            mContentChatTextView = itemView.findViewById(R.id.contentChatTextView);
            mItemContainerView = itemView.findViewById(R.id.itemContainerView);
        }

    }
}
