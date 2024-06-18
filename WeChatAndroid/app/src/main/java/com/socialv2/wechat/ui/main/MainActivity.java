package com.socialv2.wechat.ui.main;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.socialv2.wechat.R;
import com.socialv2.wechat.ui.main.chat.MenuRoomChatFragment;
import com.socialv2.wechat.ui.main.contacts.ContactFragment;
import com.socialv2.wechat.ui.main.more.MoreFragment;
import com.socialv2.wechat.ui.qr.QrScanActivity;
import com.socialv2.wechat.ui.search.SearchActivity;
import com.socialv2.wechat.utils.NavigateUtil;

public class MainActivity extends AppCompatActivity {

    private MenuRoomChatFragment mMenuRoomChatFragment;
    private ContactFragment mContactFragment;
    private MoreFragment mMoreFragment;

    private Toolbar mWeChatToolbar;
    private BottomNavigationView mBottomNavigationView;
    private FragmentManager mFragmentManager;
    private FragmentTransaction mFragmentTransaction;
    private Boolean mDoubleBackToExitPressedOnce;


    public MainActivity() {
        mDoubleBackToExitPressedOnce = true;

        mMenuRoomChatFragment = new MenuRoomChatFragment();
        mContactFragment = new ContactFragment();
        mMoreFragment = new MoreFragment();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        mFragmentManager = getSupportFragmentManager();

        mWeChatToolbar = findViewById(R.id.weChatToolbar);
        mBottomNavigationView = findViewById(R.id.bottomNavigationView);

        initView();
        initNofificationFirebase();
        navigateFragment(mMenuRoomChatFragment);
    }


    @SuppressLint("NonConstantResourceId")
    private void initView() {
        mWeChatToolbar.setTitle(getResources().getString(R.string.chat_title));
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0);
            return insets;
        });

        setSupportActionBar(mWeChatToolbar);

        mBottomNavigationView.setOnNavigationItemSelectedListener(item -> {
            switch (item.getItemId()) {
                case R.id.menuRoomChatTab:
                    navigateFragment(mMenuRoomChatFragment);
                    mWeChatToolbar.setTitle(getResources().getString(R.string.chat_title));
                    return true;
                case R.id.contactTab:
                    navigateFragment(mContactFragment);
                    mWeChatToolbar.setTitle(getResources().getString(R.string.contact_title));
                    return true;
                case R.id.profileTab:
                    mWeChatToolbar.setTitle(getResources().getString(R.string.profile_title));
                    navigateFragment(mMoreFragment);
                    return true;
            }
            return false;
        });
    }

    private void navigateFragment(Fragment fragment) {
        mDoubleBackToExitPressedOnce = (fragment == mMenuRoomChatFragment);
        mFragmentTransaction = mFragmentManager.beginTransaction();

        String fragmentTag = fragment.getClass().getName();
        Fragment current = mFragmentManager.getPrimaryNavigationFragment();
        Fragment temp = mFragmentManager.findFragmentByTag(fragmentTag);

        if (current != null) {
            mFragmentTransaction.hide(current);
        }

        if (temp == null) {
            temp = fragment;
            mFragmentTransaction.add(R.id.fragmentContainer, temp, fragmentTag);
        } else mFragmentTransaction.show(temp);


        mFragmentTransaction.setPrimaryNavigationFragment(temp);
        mFragmentTransaction.setReorderingAllowed(true);
        mFragmentTransaction.commitNowAllowingStateLoss();
    }

    @Override
    public void onBackPressed() {
        if (mDoubleBackToExitPressedOnce) {
            super.onBackPressed();
            return;
        }

        mBottomNavigationView.setSelectedItemId(R.id.menuRoomChatTab);
        navigateFragment(mMenuRoomChatFragment);
    }

    private void initNofificationFirebase() {
//        FirebaseMessaging.getInstance().getToken().addOnCompleteListener(new OnCompleteListener<String>() {
//            @Override
//            public void onComplete(@NonNull Task<String> task) {
//                if (!task.isSuccessful()) {
//                    //Log.w(TAG, "Fetching FCM registration token failed", task.exception)
//                }
//            }
//        });
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.main_wechat_toolbar_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case R.id.searchItem:
                NavigateUtil.navigateTo(MainActivity.this, SearchActivity.class);
                return true;
            case R.id.qrScanItem:
                NavigateUtil.navigateTo(MainActivity.this, QrScanActivity.class);
                return true;
        }

        return false;
    }
}