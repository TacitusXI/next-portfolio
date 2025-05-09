import React from 'react';

/**
 * A mapping of book titles to their Amazon URLs
 */
const bookLinks: Record<string, string> = {
  "Developing Blockchain Solutions in the Cloud": "https://www.amazon.com/Developing-Blockchain-Solutions-Cloud-blockchain-powered-ebook/dp/B0CW59K1M4"
};

/**
 * Parses text content and converts book titles to clickable links
 * @param text The text to parse
 * @returns React elements with links for book titles
 */
export const parseTextWithBookLinks = (text: string): React.ReactNode => {
  if (!text) return text;
  
  // Create a regex pattern from all book titles (escape special characters)
  const bookTitles = Object.keys(bookLinks)
    .map(title => title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  
  if (!bookTitles) return text;
  
  const regex = new RegExp(`(${bookTitles})`, 'g');
  
  // Split the text by book titles and create elements
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    const url = bookLinks[part];
    if (url) {
      return (
        <a 
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 'bold' }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}; 