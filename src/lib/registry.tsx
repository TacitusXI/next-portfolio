'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

// Prop filtering function to prevent motion props and other custom props from being passed to DOM
const shouldForwardProp = (prop: string): boolean => {
  // List of motion props and other custom props to filter out
  const blacklist = [
    'whileHover', 
    'whileTap', 
    'whileFocus', 
    'whileDrag',
    'whileInView',
    'initial', 
    'animate', 
    'exit', 
    'transition',
    'variants',
    'isActive' // Also filter out isActive if it's still being used
  ];
  
  return !blacklist.includes(prop);
};

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance} shouldForwardProp={shouldForwardProp} enableVendorPrefixes>
      {children}
    </StyleSheetManager>
  );
} 