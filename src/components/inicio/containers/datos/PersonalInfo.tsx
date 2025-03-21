import styles from './personalInfo.module.css';
import Image from 'next/image';

export default function PersonalInfoComponent() {
    return (
        <div className={styles.profile}>
            <Image src={'https://s3-alpha-sig.figma.com/img/4838/ebf9/9f5d3b04e54d4bda4b727af5ea1e799c?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=OjuiJ9iriZqqOE72l-KP6Dww0UyXc9B5~oomNe-ku1QR-WKTmgYEk~XR4Yy~5V~MbI19w6OyflPM11uPMCXcOxWsYqgjnPTMgz5l785OXlhQxdNPb7xWGmmsO7psdWTdWejBEqynsfqy28~m-GrAtXwhyY3~yo0qiWLyWbQnE3BiSjX0DE30oP3BESuhfHg~v5JAL~DlY8Px5Yty9JsxP5PRJ014RJ6fs4RoQsa9Yu-vyhzBZxaxfqHlg~v61lNCuGBSOxhbrI3QSGkXtdWzW7W9KJMTWdSwNJ7MTQFCUN1~rkYYt5EQEP2C2~f~EwrhSlBisU23jSN4wFepiWJ2gw'} width={60} height={60} alt='img_profile' className={styles.personalImage} />
            <div className={styles.personalInfo}>
                <h2>Nevaeh Simmons</h2>
                <h3>UI/UX designer | nevaeh.simmons@example.com</h3>
            </div>
        </div>
    );
}