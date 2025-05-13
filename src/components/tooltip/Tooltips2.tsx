'use client';
import React from 'react';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';


interface TooltipProps {
  children: React.ReactNode;
  infoText: string;
}

export default function Tooltips2({ children, infoText }: TooltipProps) {
  return (
    <>
      <div
        data-tooltip-id="tooltip2"
        data-tooltip-content={infoText}
      >
        {children}
      </div>

      <Tooltip
        place="bottom-start"
        id="tooltip2"
        noArrow
        offset={0}
        style={{
          display: 'inline-flex',
          padding: '4px 8px',
          alignItems: 'flex-start',
          borderRadius: '4px',
          backgroundColor: 'background: rgba(7, 16, 29, 0.80)',
          color: '#FFF',
          textAlign: 'center',
          fontSize: '11px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: 'normal',
        }}
      />
    </>
  );
}
