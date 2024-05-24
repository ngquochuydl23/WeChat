const otpGenerator = require("otp-generator");
const Otp = require("../models/otp");
const { sendOtpEmailUtil } = require("../utils/emailSenderUtil");
const { otpValidator } = require('../utils/otpValidator');
const { AppException } = require("../exceptions/AppException");

async function sendOtpViaEmail(user, type) {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  await sendOtpEmailUtil(user.email, otp);
  await Otp.findOneAndUpdate(
    { email: user.email, userId: user._id, type: type },
    {
      otp,
      otpExpiration: new Date(new Date().getTime())
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function findOtp(user, type, otp) {
  return Otp.findOne({
    email: user.email,
    otp: otp,
    userId: user._id,
    type: type
  });
}

async function checkOtpExpired(user, type, otp) {
  const otpData = await findOtp(user, type, otp);

  return await otpValidator(otpData.otpExpiration);
}

async function verifyOtp(user, type, otp) {
  const otpData = await findOtp(user, type, otp);

  if (!otpData) {
    throw new AppException('OtpNotFound');
  }

  const isExpired = await otpValidator(otpData.otpExpiration);

  if (isExpired) {
    await otpData.deleteOne();
    throw new AppException('OtpIsExpired');
  }


  await otpData.deleteOne();
}


module.exports = { sendOtpViaEmail, verifyOtp, checkOtpExpired, findOtp }