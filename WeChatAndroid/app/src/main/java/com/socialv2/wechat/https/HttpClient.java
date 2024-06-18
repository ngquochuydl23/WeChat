package com.socialv2.wechat.https;

import android.content.Context;

import androidx.annotation.NonNull;


import com.socialv2.wechat.sharedReferences.SaveTokenSharedPreference;

import java.io.IOException;

import okhttp3.CacheControl;
import okhttp3.Headers;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava3.RxJava3CallAdapterFactory;
import retrofit2.converter.gson.GsonConverterFactory;

public class HttpClient implements IHttpClient {
    private Retrofit.Builder builder;
    private String baseUrl;
    private Context context;


    public HttpClient(Context context) {
        this.context = context;
        // get from dynamic enviroment.
        baseUrl = "https://locahost:2501/api/";
        builder = createRetrofitBuilder(baseUrl);
    }

    public HttpClient(Context context, String otherBaseUrl) {
        this.context = context;

        baseUrl = otherBaseUrl;
        builder = createRetrofitBuilder(baseUrl);
    }

    @Override
    public Retrofit getRetrofit() {
        return builder.build();
    }


    private Retrofit.Builder createRetrofitBuilder(String url) {
        String accessToken = new SaveTokenSharedPreference(context).getData();

        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
        loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient.Builder httpClient = new OkHttpClient
                .Builder()
                .addInterceptor(loggingInterceptor)
                .addInterceptor(new Interceptor() {
                    @NonNull
                    @Override
                    public Response intercept(@NonNull Chain chain) throws IOException {

                        Request originalRequest = chain.request();
                        Headers headers = new Headers.Builder()
                                .add("Authorization", "Bearer " + accessToken)
                                .build();

                        Request newRequest = originalRequest.newBuilder()
                                .cacheControl(CacheControl.FORCE_CACHE)
                                .headers(headers)
                                .method(originalRequest.method(), null)
                                .build();
                        return chain.proceed(newRequest);
                    }
                });
//                .addInterceptor(new Interceptor() {
//                    @Override
//                    public Response intercept(Chain chain) throws IOException {
//                        return chain.;
//                    }
//                });

        return new Retrofit.Builder()
                .baseUrl(url)
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJava3CallAdapterFactory.create())
                .client(httpClient.build())
                .build()
                .newBuilder();
    }
}
