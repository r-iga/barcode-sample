import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

const BarcodeReader: React.FC = () => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    const startScanning = async () => {
        if (!videoContainerRef.current || isScanning) return;
        const html5QrCode = new Html5Qrcode(videoContainerRef.current.id);

        try {
            await html5QrCode.start(
                { facingMode: "environment" }, // 背面カメラを使用
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText, _) => {
                    // バーコード/QRコードを検知した際の処理
                    setScanResult(decodedText);
                    stopScanning();
                }, undefined
            );
            html5QrCodeRef.current = html5QrCode;
            setIsScanning(true);
        } catch (error) {
            console.error("Scanning failed", error);
        }
    };

    const stopScanning = () => {
        if (html5QrCodeRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
            html5QrCodeRef.current.stop();
            html5QrCodeRef.current.clear();
        }
        html5QrCodeRef.current = null;
        setIsScanning(false);
    };

    useEffect(() => {
        return () => {
            // コンポーネントのアンマウント時にリソースを解放
            stopScanning();
        };
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>バーコードリーダー</h1>
            <div
                id="video-container"
                ref={videoContainerRef}
                style={{ width: "300px", height: "300px", border: "1px solid black", margin: "20px auto" }}
            />
            {scanResult && (
                <div>
                    <h3>スキャン結果:</h3>
                    <p>{scanResult}</p>
                </div>
            )}
            <button onClick={isScanning ? stopScanning : startScanning}>
                {isScanning ? "スキャン停止" : "スキャン開始"}
            </button>
        </div>
    );
};

export default BarcodeReader;
