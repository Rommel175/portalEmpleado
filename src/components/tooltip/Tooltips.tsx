'use client';
import React from 'react';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';


interface TooltipProps {
  children: React.ReactNode;
  infoText: string;
}

export default function Tooltips({ children, infoText }: TooltipProps) {
  return (
    <>
      <div
        data-tooltip-id="my-tooltip-inline"
        data-tooltip-content={infoText}
      >
        {children}
      </div>

      <Tooltip
        id="my-tooltip-inline"
        style={{
          display: 'flex',
          width: '240px',
          padding: '8px 12px',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--white, #FFF)',
          textAlign: 'center',
          fontSize: '10px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: 'normal',
          borderRadius: '4px',
          backgroundColor: 'var(--primary-dark, #07101D)',
        }}
      />
    </>
  );
}
