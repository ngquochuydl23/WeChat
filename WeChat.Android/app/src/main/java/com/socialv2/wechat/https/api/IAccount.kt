package com.nsolution.nfood.https.api

import com.nsolution.nfood.Models.*
import io.reactivex.rxjava3.core.Observable
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface IAccount {
  @POST("api/TokenAuth/Authenticate")
  fun Authenticate(@Body requestOtpDto: RequestOtpDto)
          : Observable<ResultAction<ResponseOtpDto>>
  
  @POST("Account/Verification")
  fun verification(
    @Header("Authorization") token: String,
    @Body verificationRequestDto: VerificationRequestDto
  ): Observable<ResultAction<VerificationResponseDto>>
  
  @POST("Account/AddUserInformation")
  fun addUserInformation(@Header("Authorization") token: String, @Body profile: ProfileDto)
          : Observable<ResultAction<AccountDto2>>
}