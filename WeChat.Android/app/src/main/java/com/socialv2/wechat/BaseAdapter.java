package com.socialv2.wechat;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

public abstract class BaseAdapter<TModel extends Object, TViewHolder extends RecyclerView.ViewHolder> extends RecyclerView.Adapter<TViewHolder> {
    private int viewResource;
    private Context context;
    private List<TModel> list;

    public BaseAdapter(int viewResource, List<TModel> list) {
        this.viewResource = viewResource;
        this.list = list;
    }

    public int getViewResource() {
        return viewResource;
    }

    protected TViewHolder createViewHolder(ViewGroup parent, Class<TViewHolder> viewHolderClass) {
        try {
            context = parent.getContext();
            return viewHolderClass
                    .getDeclaredConstructor(View.class)
                    .newInstance(LayoutInflater.from(context).inflate(viewResource, parent, false));
        } catch (IllegalAccessException | InstantiationException | NoSuchMethodException |
                 InvocationTargetException e) {
            e.printStackTrace();
            return null;
        }
    }

    protected abstract void bind(@NonNull TViewHolder viewHolder, TModel model);

    @Override
    public void onBindViewHolder(@NonNull TViewHolder holder, int position) {
        bind(holder, list.get(position));
    }

    public Context getContext() {
        return context;
    }

    @Override
    public int getItemCount() {
        return list.size();
    }
}
