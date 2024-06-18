package com.socialv2.wechat.ui.main.chat;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.socialv2.wechat.BaseFragment;
import com.socialv2.wechat.R;
import com.socialv2.wechat.dtos.RoomDto;

import java.util.ArrayList;
import java.util.List;


public class MenuRoomChatFragment extends BaseFragment {

    private RecyclerView mMenuRoomChatRecyclerView;

    public MenuRoomChatFragment() {
       super(R.layout.fragment_menu_room_chat);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        mMenuRoomChatRecyclerView = view.findViewById(R.id.menuRoomChatRecyclerView);

        initView();
        handleSubcribed();
    }

    private void initView() {
        mMenuRoomChatRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
    }

    private void handleSubcribed() {

        List<RoomDto> rooms = new ArrayList<>();
        rooms.add(new RoomDto());
        rooms.add(new RoomDto());
        rooms.add(new RoomDto());
        rooms.add(new RoomDto());
        rooms.add(new RoomDto());
        rooms.add(new RoomDto());
        rooms.add(new RoomDto());
        rooms.add(new RoomDto());
        rooms.add(new RoomDto());

        mMenuRoomChatRecyclerView.setAdapter(new RoomChatAdapter(rooms));
    }
}