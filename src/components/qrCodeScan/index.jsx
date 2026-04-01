import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
const QrCodeScan = ({ onCallback }) => {

    const onResult = (result, error) => {
        if (!!result) {
            onCallback(result?.text);
        }

        if (!!error) {
            console.info(error);
        }
    };
    return (
        <>
            <QrReader
                onResult={onResult}
                style={{ width: '100%' }}
                constraints={{ facingMode: 'environment' }}
            />
        </>
    );
};
export default QrCodeScan;