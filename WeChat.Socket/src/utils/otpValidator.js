

const otpValidator = async (otpTime) => {
    try {
        const cDate = new Date();
        var differenceValue = (otpTime - cDate.getTime()) / 1000;
        differenceValue /= 60;
        const minutes = Math.abs(differenceValue);
        if (minutes > 2) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
}

module.exports = { otpValidator }