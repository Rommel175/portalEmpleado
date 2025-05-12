'use client';
import { useState } from 'react';
import styles from './tooltip.module.css';

export default function Tooltip({ children, infoText }: { children: React.ReactNode, infoText: string }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className={styles.tooltipContainer}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {children}

            <div className={`${styles.tooltip} ${showTooltip ? styles.open : ''}`}>
                {infoText}
                <div className={styles.arrow} />
            </div>

        </div>
    );
}