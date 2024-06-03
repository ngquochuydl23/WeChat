package com.socialv2.wechat.singleton;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.socialv2.wechat.dtos.AccountDto;


public class AccountSingleton {
    private static final AccountSingleton instance = new AccountSingleton();


    public static AccountSingleton getInstance() {
        return instance;
    }

    private MutableLiveData<AccountDto> resultLiveData = new MutableLiveData<>();

    public LiveData<AccountDto> getData() {
        return resultLiveData;
    }

    public void setData(AccountDto newData) {
        resultLiveData.postValue(newData);
    }

    public void clear() {
        resultLiveData.setValue(null);
    }
}
