import Image from 'next/image';
import styles from './navbarItem.module.css';
import Link from 'next/link';

export default function NavbarItem( {image} : {image: string} ) {
    return (
        <div className={styles.navItems}>
            <Link href={'#'}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 20.9999L17.5 17.4999M10.5 10.4999L7 6.99994M17.5 10.4999L21 6.99994M7 20.9999L10.5 17.4999M24.5 13.9999C24.5 15.3788 24.2284 16.7442 23.7007 18.0181C23.1731 19.292 22.3996 20.4495 21.4246 21.4246C20.4496 22.3996 19.2921 23.173 18.0182 23.7007C16.7443 24.2283 15.3789 24.4999 14 24.4999C12.6211 24.4999 11.2557 24.2283 9.98182 23.7007C8.70791 23.173 7.55039 22.3996 6.57538 21.4246C5.60036 20.4495 4.82694 19.292 4.29926 18.0181C3.77159 16.7442 3.5 15.3788 3.5 13.9999C3.5 11.2152 4.60625 8.54445 6.57538 6.57532C8.54451 4.60619 11.2152 3.49994 14 3.49994C16.7848 3.49994 19.4555 4.60619 21.4246 6.57532C23.3938 8.54445 24.5 11.2152 24.5 13.9999ZM18.6667 13.9999C18.6667 15.2376 18.175 16.4246 17.2998 17.2998C16.4247 18.1749 15.2377 18.6666 14 18.6666C12.7623 18.6666 11.5753 18.1749 10.7002 17.2998C9.825 16.4246 9.33333 15.2376 9.33333 13.9999C9.33333 12.7623 9.825 11.5753 10.7002 10.7001C11.5753 9.82494 12.7623 9.33327 14 9.33327C15.2377 9.33327 16.4247 9.82494 17.2998 10.7001C18.175 11.5753 18.6667 12.7623 18.6667 13.9999Z" stroke="#C0C0C0" strokeWidth="2" />
                </svg>
            </Link>

            <Link href={'#'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21M18 8.4C18 6.703 17.368 5.075 16.243 3.875C15.118 2.675 13.59 2 12 2C10.41 2 8.883 2.674 7.757 3.875C6.632 5.075 6 6.703 6 8.4C6 15.867 3 18 3 18H21C21 18 18 15.867 18 8.4Z" stroke="#C0C0C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
            
            <Link href={'#'}>
                <Image src={image} width={36} height={36} alt='img' className={styles.navImage} />
            </Link>
        </div>
    );
}