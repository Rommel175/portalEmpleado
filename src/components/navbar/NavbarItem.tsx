import styles from './navbarItem.module.css';
import Link from 'next/link';
import DropdownProfile from '../customInputs/dropdownProfile/DropdownProfile';
import Tooltips2 from '../tooltip/Tooltips2';

export default function NavbarItem({ image, nombre, apellido, email }: { image: string, nombre: string, apellido: string, email: string }) {
    return (
        <div className={styles.navItems}>
            <Tooltips2 infoText='Ayuda'>
                <Link href={'#'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M17.4444 17.7777L14.7221 15.0555M9.2777 9.61107L6.55547 6.88885M14.7221 9.61107L17.4444 6.88885M6.55547 17.7777L9.2777 15.0555M20.1666 12.3333C20.1666 13.4058 19.9553 14.4677 19.5449 15.4585C19.1345 16.4494 18.533 17.3497 17.7746 18.108C17.0163 18.8663 16.116 19.4679 15.1252 19.8783C14.1343 20.2887 13.0724 20.5 11.9999 20.5C10.9275 20.5 9.8655 20.2887 8.87467 19.8783C7.88384 19.4679 6.98356 18.8663 6.22521 18.108C5.46687 17.3497 4.86532 16.4494 4.4549 15.4585C4.04449 14.4677 3.83325 13.4058 3.83325 12.3333C3.83325 10.1674 4.69367 8.09013 6.22521 6.55859C7.75676 5.02704 9.83398 4.16663 11.9999 4.16663C14.1659 4.16663 16.2431 5.02704 17.7746 6.55859C19.3062 8.09013 20.1666 10.1674 20.1666 12.3333ZM15.6295 12.3333C15.6295 13.2959 15.2471 14.2191 14.5665 14.8998C13.8858 15.5805 12.9626 15.9629 11.9999 15.9629C11.0373 15.9629 10.1141 15.5805 9.43338 14.8998C8.75269 14.2191 8.37029 13.2959 8.37029 12.3333C8.37029 11.3707 8.75269 10.4474 9.43338 9.76676C10.1141 9.08607 11.0373 8.70366 11.9999 8.70366C12.9626 8.70366 13.8858 9.08607 14.5665 9.76676C15.2471 10.4474 15.6295 11.3707 15.6295 12.3333Z" stroke="#B6BEC9" strokeWidth="1.2" />
                    </svg>
                </Link>
            </Tooltips2>

            <Tooltips2 infoText={'Notificaciones'}>
                <Link href={'#'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M13.3081 18.8051C13.1751 19.0343 12.9843 19.2246 12.7547 19.3568C12.5251 19.489 12.2648 19.5586 11.9999 19.5586C11.7349 19.5586 11.4746 19.489 11.2451 19.3568C11.0155 19.2246 10.8247 19.0343 10.6917 18.8051M16.5369 9.27737C16.5369 7.99415 16.059 6.7631 15.2083 5.85569C14.3576 4.94828 13.2022 4.43787 11.9999 4.43787C10.7976 4.43787 9.6429 4.94753 8.79145 5.85569C7.94076 6.7631 7.46285 7.99415 7.46285 9.27737C7.46285 14.9237 5.19434 16.5366 5.19434 16.5366H18.8054C18.8054 16.5366 16.5369 14.9237 16.5369 9.27737Z" stroke="#B6BEC9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </Tooltips2>

            <Tooltips2 infoText='Usuario' place='bottom'>
                <DropdownProfile image={image} nombre={nombre} apellido={apellido} email={email} />
            </Tooltips2>
        </div>
    );
}