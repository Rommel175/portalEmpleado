'use client';
import React, { useId } from 'react';
import { Tooltip, PlacesType } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';


interface TooltipProps {
  children: React.ReactNode;
  infoText: string;
  place?: PlacesType
}

export default function Tooltips2({ children, infoText, place }: TooltipProps) {
  const tooltipId = useId();

  return (
    <>
      <div
        data-tooltip-id={tooltipId}
        data-tooltip-content={infoText}
      >
        {children}
      </div>

      <Tooltip
        place={place}
        id={tooltipId}
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
