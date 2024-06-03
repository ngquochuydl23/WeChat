package com.socialv2.wechat;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;

public abstract class BaseFragment extends Fragment {
    private int viewResource;


    public BaseFragment(int viewResource) {
        this.viewResource = viewResource;
    }


    public int getViewResource() {
        return viewResource;
    }

    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        return inflater.inflate(viewResource, container, false);
    }

    public FragmentActivity getFragmentActivity() {
        return requireActivity();
    }
}