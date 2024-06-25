import QRCodeStyling from "qr-code-styling";

const generateQrCode = (data, image, size) => {
    return new QRCodeStyling({
        width: size,
        height: size,
        type: "svg",
        data: data,
        image: image,
        "margin": 0,
        "qrOptions": {
            "typeNumber": "0",
            "mode": "Byte",
            "errorCorrectionLevel": "L"
        },
        "imageOptions": {
            "imageSize": 0.5,
            "margin": 0
        },
        "dotsOptions": {
            "type": "rounded",
            "color": "#0c0c0c",
            "gradient": null
        },
        "backgroundOptions": {
            "color": "#f5f5f5",
            "gradient": null
        },
        "dotsOptionsHelper": {
            "colorType": {
                "single": true,
                "gradient": false
            },
            "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#6a1a4c",
                "color2": "#6a1a4c",
                "rotation": "0"
            }
        },
        "cornersSquareOptions": {
            "type": "extra-rounded",
            "color": '#07C160',
            "gradient": null
        },
        "cornersSquareOptionsHelper": {
            "colorType": {
                "single": true,
                "gradient": false
            },
            "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#000000",
                "color2": "#000000",
                "rotation": "0"
            }
        },
        "cornersDotOptions": {
            "type": "",
            "color": "#0c0c0c"
        },
        "cornersDotOptionsHelper": {
            "colorType": {
                "single": true,
                "gradient": false
            },
            "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#000000",
                "color2": "#000000",
                "rotation": "0"
            }
        },
        "backgroundOptionsHelper": {
            "colorType": {
                "single": true,
                "gradient": false
            },
            "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#ffffff",
                "color2": "#ffffff",
                "rotation": "0"
            }
        }
    });
}

export default generateQrCode;