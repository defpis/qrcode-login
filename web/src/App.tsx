import { useMemo, useState } from "react";
import "./App.scss";
import { QRCodeSVG } from "qrcode.react";

enum QRCodeStatus {
  Init,
  Loading,
  Pending,
  Expired,
  Used,
}

export function App() {
  const [[code, status], setQRCode] = useState<[string, QRCodeStatus]>([
    "123",
    QRCodeStatus.Loading,
  ]);

  const renderer = useMemo(() => {
    if (status === QRCodeStatus.Init) return;

    if (status === QRCodeStatus.Loading) {
      return (
        <>
          {code && <QRCodeSVG className="invalid" size={256} value={code} />}
          <div className="loader"></div>
        </>
      );
    }

    if (status === QRCodeStatus.Pending) {
      return <QRCodeSVG size={256} value={code} />;
    }

    if (status === QRCodeStatus.Used) {
      return (
        <>
          <QRCodeSVG className="invalid" size={256} value={code} />
          <div className="tips">已扫描</div>
        </>
      );
    }

    if (status === QRCodeStatus.Expired) {
      return (
        <>
          <QRCodeSVG className="invalid" size={256} value={code} />
          <div className="tips">已过期</div>
        </>
      );
    }
  }, [code, status]);

  return (
    <>
      <div className="main">
        <div className="qrcode">{renderer}</div>
      </div>
    </>
  );
}
