'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { FaStickyNote, FaSearch, FaFileAlt, FaGithub, FaSpinner, FaFolder, FaChevronDown, FaChevronRight, FaExternalLinkAlt, FaCode, FaClock, FaTags, FaBookOpen, FaRocket } from 'react-icons/fa';

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'TacitusXI';
const REPO_NAME = 't-notes';

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  download_url: string;
  type: string;
  size: number;
}

interface Note {
  name: string;
  path: string;
  content: string;
  lastModified: string;
  size: number;
}

// Floating particles removed for cleaner design

// Subtle tech grid background
const TechGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 224, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 224, 255, 0.015) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
`;

// Add subtle glow effects
const BackgroundGlow = styled.div`
  position: absolute;
  top: 20%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 224, 255, 0.03) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  animation: pulse 4s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1) opacity(0.5); }
    50% { transform: scale(1.1) opacity(0.8); }
  }
`;

const BackgroundGlow2 = styled.div`
  position: absolute;
  top: 60%;
  right: 15%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 255, 163, 0.025) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  animation: pulse 6s ease-in-out infinite reverse;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1) opacity(0.3); }
    50% { transform: scale(1.2) opacity(0.6); }
  }
`;

// Enhanced container with better spacing
const NotesContainer = styled.section`
  padding: 4rem 0;
  background-color: #090a1a;
  position: relative;
  overflow-x: hidden;
  min-height: 100vh;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 163, 0.5), rgba(0, 224, 255, 0.8), rgba(0, 255, 163, 0.5), transparent);
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 10;
`;

const SectionPrefix = styled.div`
  color: #00e0ff;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 4rem;
  font-weight: 800;
  text-transform: uppercase;
  color: white;
  position: relative;
  display: inline-block;
  text-align: center;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #00e0ff, #00ffa3);
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 3rem;
  }
`;

// Three-column layout with better responsive handling
const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: minmax(280px, 300px) 1fr minmax(250px, 280px);
  gap: 2rem;
  position: relative;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 1400px) {
    max-width: 1200px;
    grid-template-columns: minmax(260px, 280px) 1fr minmax(220px, 250px);
    gap: 1.5rem;
  }
  
  @media (max-width: 1200px) {
    max-width: 1000px;
    grid-template-columns: minmax(240px, 260px) 1fr minmax(200px, 230px);
    gap: 1.5rem;
    padding: 0 1.5rem;
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 1rem;
    max-width: 100%;
  }
`;

// Enhanced sidebar with floating elements
const Sidebar = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 224, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  height: 600px;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  position: relative;
  min-width: 0;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 224, 255, 0.05), rgba(0, 255, 163, 0.05));
    border-radius: 16px;
    pointer-events: none;
  }
  
  @media (max-width: 900px) {
    height: 500px;
    padding: 1rem;
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #00e0ff, #00ffa3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #00ffa3, #00e0ff);
  }
`;

// Main content area
const MainContent = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 224, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  height: 600px;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  position: relative;
  min-width: 0;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 224, 255, 0.03), rgba(0, 255, 163, 0.03));
    border-radius: 16px;
    pointer-events: none;
  }
  
  @media (max-width: 900px) {
    height: 500px;
    padding: 1.5rem;
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #00e0ff, #00ffa3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #00ffa3, #00e0ff);
  }
`;

// Right panel with stats and quick actions
const RightPanel = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 224, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  height: 600px;
  backdrop-filter: blur(10px);
  position: relative;
  min-width: 0;
  width: 100%;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 224, 255, 0.05), rgba(0, 255, 163, 0.05));
    border-radius: 16px;
    pointer-events: none;
  }
  
  @media (max-width: 900px) {
    height: auto;
    padding: 1rem;
  }
`;

// Enhanced search box
const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 0.875rem 0.875rem 0.875rem 2.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 224, 255, 0.3);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  max-width: 100%;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(0, 224, 255, 0.6);
    box-shadow: 0 0 20px rgba(0, 224, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &:hover {
    border-color: rgba(0, 224, 255, 0.5);
    background: rgba(255, 255, 255, 0.06);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 224, 255, 0.7);
  font-size: 0.8rem;
  z-index: 1;
  pointer-events: none;
`;

// Enhanced folder and file items
const FolderGroup = styled.div`
  margin-bottom: 1rem;
`;

const FolderHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 224, 255, 0.1);
  border: 1px solid rgba(0, 224, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: rgba(0, 224, 255, 0.15);
    border-color: rgba(0, 224, 255, 0.4);
    transform: translateX(4px);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.1);
  }
`;

const FolderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
  
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const FolderFiles = styled.div`
  margin-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NoteItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background: rgba(0, 224, 255, 0.1);
    border-color: rgba(0, 224, 255, 0.3);
    transform: translateX(4px);
    color: rgba(255, 255, 255, 1);
  }
  
  &.active {
    background: rgba(0, 224, 255, 0.15);
    border-color: rgba(0, 224, 255, 0.5);
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px rgba(0, 224, 255, 0.2);
  }
`;

const NoteTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
  
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

// Stats panel components
const StatsPanel = styled.div`
  margin-bottom: 2rem;
`;

const StatsTitle = styled.h3`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 224, 255, 0.1);
    border-color: rgba(0, 224, 255, 0.3);
  }
`;

const StatLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const StatValue = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.9rem;
`;

// Quick actions panel
const QuickActionsPanel = styled.div`
  margin-bottom: 2rem;
`;

const QuickActionsTitle = styled.h3`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 224, 255, 0.1);
  border: 1px solid rgba(0, 224, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: rgba(0, 224, 255, 0.15);
    border-color: rgba(0, 224, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 224, 255, 0.2);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.1);
  }
`;

// External links container
const ExternalLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(0, 224, 255, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 900px) {
    padding: 0.75rem;
    margin-top: 1.5rem;
  }
`;

const ExternalLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, rgba(0, 224, 255, 0.08), rgba(0, 255, 163, 0.08));
  border: 1px solid rgba(0, 224, 255, 0.25);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 224, 255, 0.15), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(0, 224, 255, 0.12), rgba(0, 255, 163, 0.12));
    border-color: rgba(0, 224, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 224, 255, 0.15);
    color: rgba(255, 255, 255, 1);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0px);
    box-shadow: 0 3px 10px rgba(0, 224, 255, 0.1);
  }
  
  svg {
    font-size: 1rem;
    transition: all 0.3s ease;
    flex-shrink: 0;
    color: var(--cyber-blue);
  }
  
  &:hover svg {
    transform: scale(1.1);
    color: var(--cyber-green);
  }
  
  span {
    font-size: 0.85rem;
    font-weight: 500;
    white-space: nowrap;
  }
  
  @media (max-width: 900px) {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
    gap: 0.6rem;
    
    svg {
      font-size: 0.9rem;
    }
    
    span {
      font-size: 0.8rem;
    }
  }
`;

// Loading and error states
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  gap: 1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  gap: 1rem;
`;

// Markdown content styling
const MarkdownContent = styled.div`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  
  h1, h2, h3, h4, h5, h6 {
    color: rgb(49, 164, 253);
    margin: 1.5rem 0 1rem 0;
    font-weight: 600;
  }
  
  h1 {
    font-size: 1.8rem;
    border-bottom: 2px solid rgba(115, 74, 253, 0.3);
    padding-bottom: 0.5rem;
  }
  
  h2 { font-size: 1.4rem; }
  h3 { font-size: 1.2rem; }
  
  p { margin: 1rem 0; }
  
  a {
    color: rgb(115, 74, 253);
    text-decoration: underline;
    
    &:hover {
      color: rgb(49, 164, 253);
      text-shadow: 0 0 5px rgba(49, 164, 253, 0.5);
    }
  }
  
  blockquote {
    border-left: 3px solid rgba(115, 74, 253, 0.5);
    padding-left: 1rem;
    margin: 1rem 0;
    background: rgba(115, 74, 253, 0.05);
    border-radius: 0 8px 8px 0;
  }
  
  code {
    background: rgba(0, 0, 0, 0.5);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    color: rgb(49, 164, 253);
  }
  
  pre {
    background: rgba(0, 0, 0, 0.7);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid rgba(115, 74, 253, 0.3);
    
    code {
      background: none;
      padding: 0;
    }
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin: 0.5rem 0;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
    
    th, td {
      border: 1px solid rgba(115, 74, 253, 0.3);
      padding: 0.5rem;
      text-align: left;
    }
    
    th {
      background: rgba(115, 74, 253, 0.1);
      font-weight: 600;
    }
  }
`;

// GitHub API functions
async function fetchMarkdownFiles(): Promise<GitHubFile[]> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/v4?recursive=1`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    
    const markdownFiles = data.tree
      .filter((item: any) => 
        item.type === 'blob' && 
        item.path.endsWith('.md') && 
        item.path.startsWith('content/')
      )
      .map((item: any) => {
        // Remove 'content/' prefix and get the relative path
        const relativePath = item.path.replace('content/', '');
        const fileName = relativePath.split('/').pop() || relativePath;
        
        return {
          name: fileName,
          path: relativePath,
          sha: item.sha,
          download_url: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/v4/${item.path}`,
          type: 'file',
          size: item.size || 0
        };
      });
    
    return markdownFiles;
  } catch (error) {
    console.error('Error fetching markdown files:', error);
    throw error;
  }
}

async function fetchFileContent(downloadUrl: string): Promise<string> {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
}

function formatFileName(fileName: string): string {
  return fileName
    .replace('.md', '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function NotesSection() {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [notes, setNotes] = useState<Map<string, Note>>(new Map());
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Fetch markdown files on mount
  useEffect(() => {
    async function loadFiles() {
      try {
        setLoading(true);
        setError(null);
        const markdownFiles = await fetchMarkdownFiles();
        setFiles(markdownFiles);
        
        if (markdownFiles.length > 0) {
          setSelectedNote(markdownFiles[0].name);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notes');
      } finally {
        setLoading(false);
      }
    }
    
    if (inView) {
      loadFiles();
    }
  }, [inView]);

  // Load note content when selected
  useEffect(() => {
    async function loadNoteContent() {
      if (!selectedNote || notes.has(selectedNote)) return;
      
      const file = files.find(f => f.name === selectedNote);
      if (!file) return;
      
      try {
        setLoadingContent(true);
        const content = await fetchFileContent(file.download_url);
        setNotes(prev => new Map(prev).set(selectedNote, {
          name: selectedNote,
          path: file.path,
          content,
          lastModified: new Date().toISOString(),
          size: file.size
        }));
      } catch (err) {
        console.error('Error loading note content:', err);
      } finally {
        setLoadingContent(false);
      }
    }
    
    if (selectedNote) {
      loadNoteContent();
    }
  }, [selectedNote, files, notes]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folder)) {
        newSet.delete(folder);
      } else {
        newSet.add(folder);
      }
      return newSet;
    });
  };

  // Group files by folder
  const groupedFiles = files.reduce((acc, file) => {
    const pathParts = file.path.split('/');
    const folder = pathParts.length > 1 ? pathParts[0] : 'Root';
    if (!acc[folder]) {
      acc[folder] = [];
    }
    acc[folder].push(file);
    return acc;
  }, {} as Record<string, GitHubFile[]>);

  // Filter files based on search term
  const filteredGroupedFiles = Object.entries(groupedFiles).reduce((acc, [folder, files]) => {
    const filteredFiles = files.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredFiles.length > 0) {
      acc[folder] = filteredFiles;
    }
    return acc;
  }, {} as Record<string, GitHubFile[]>);

  // Calculate stats
  const totalNotes = files.length;
  const totalFolders = Object.keys(groupedFiles).length;
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  // Particles removed for cleaner design

  if (loading) {
    return (
      <NotesContainer id="notes" ref={ref}>
        <TechGrid />
        <BackgroundGlow />
        <BackgroundGlow2 />
        <SectionHeader>
          <SectionPrefix>Exploit.Research_Protocol</SectionPrefix>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Technical Writeups & Notes
          </SectionTitle>
        </SectionHeader>
        <ContentWrapper>
          <Sidebar>
            <LoadingContainer>
              <FaSpinner className="fa-spin" />
              <span>Loading notes...</span>
            </LoadingContainer>
          </Sidebar>
          <MainContent>
            <LoadingContainer>
              <FaSpinner className="fa-spin" />
              <span>Loading content...</span>
            </LoadingContainer>
          </MainContent>
          <RightPanel>
            <LoadingContainer>
              <FaSpinner className="fa-spin" />
              <span>Loading stats...</span>
            </LoadingContainer>
          </RightPanel>
        </ContentWrapper>
      </NotesContainer>
    );
  }

  if (error) {
    return (
      <NotesContainer id="notes" ref={ref}>
        <TechGrid />
        <SectionHeader>
          <SectionPrefix>Exploit.Research_Protocol</SectionPrefix>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Technical Writeups & Notes
          </SectionTitle>
        </SectionHeader>
        <ContentWrapper>
          <Sidebar>
            <ErrorContainer>
              <FaFileAlt />
              <span>Error loading notes</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{error}</span>
            </ErrorContainer>
          </Sidebar>
          <MainContent>
            <ErrorContainer>
              <FaFileAlt />
              <span>Unable to load content</span>
            </ErrorContainer>
          </MainContent>
          <RightPanel>
            <ErrorContainer>
              <FaFileAlt />
              <span>Stats unavailable</span>
            </ErrorContainer>
          </RightPanel>
        </ContentWrapper>
      </NotesContainer>
    );
  }

  return (
    <NotesContainer id="notes" ref={ref}>
      <TechGrid />
      <BackgroundGlow />
      <BackgroundGlow2 />
      
      <SectionHeader>
        <SectionPrefix>Exploit.Research_Protocol</SectionPrefix>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Technical Writeups & Notes
        </SectionTitle>
      </SectionHeader>

      <ContentWrapper>
        <Sidebar>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchBox
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <div>
            {Object.entries(filteredGroupedFiles).map(([folder, files]) => (
              <FolderGroup key={folder}>
                <FolderHeader onClick={() => toggleFolder(folder)}>
                  <FolderTitle>
                    <FaFolder />
                    <span>{folder}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({files.length})</span>
                  </FolderTitle>
                  <div style={{ transform: expandedFolders.has(folder) ? 'rotate(90deg)' : 'none' }}>
                    <FaChevronRight />
                  </div>
                </FolderHeader>
                {expandedFolders.has(folder) && (
                  <FolderFiles>
                    {files.map((file) => (
                      <NoteItem
                        key={file.name}
                        onClick={() => setSelectedNote(file.name)}
                        className={selectedNote === file.name ? 'active' : ''}
                      >
                        <NoteTitle>
                          <FaFileAlt />
                          <span>{formatFileName(file.name)}</span>
                        </NoteTitle>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                          {formatFileSize(file.size)}
                        </div>
                      </NoteItem>
                    ))}
                  </FolderFiles>
                )}
              </FolderGroup>
            ))}
          </div>


        </Sidebar>

        <MainContent>
          {loadingContent ? (
            <LoadingContainer>
              <FaSpinner className="fa-spin" />
              <span>Loading content...</span>
            </LoadingContainer>
          ) : selectedNote && notes.has(selectedNote) ? (
            <MarkdownContent>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
              >
                {notes.get(selectedNote)!.content}
              </ReactMarkdown>
            </MarkdownContent>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', marginTop: '2rem' }}>
              <FaFileAlt style={{ fontSize: '3rem', marginBottom: '1rem' }} />
              <p>Select a note to view its content</p>
            </div>
          )}
        </MainContent>

        <RightPanel>
          <StatsPanel>
            <StatsTitle>
              <FaBookOpen />
              Statistics
            </StatsTitle>
            <StatItem>
              <StatLabel>Total Notes</StatLabel>
              <StatValue>{totalNotes}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Folders</StatLabel>
              <StatValue>{totalFolders}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Total Size</StatLabel>
              <StatValue>{formatFileSize(totalSize)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Last Updated</StatLabel>
              <StatValue>Today</StatValue>
            </StatItem>
          </StatsPanel>

          <QuickActionsPanel>
            <QuickActionsTitle>
              <FaRocket />
              Quick Actions
            </QuickActionsTitle>
            <ExternalLink href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`} target="_blank" rel="noopener noreferrer" style={{ marginBottom: '0.75rem' }}>
              <FaGithub />
              <span>Browse Repository</span>
            </ExternalLink>
            <ExternalLink href="https://tacitusxi.github.io/t-notes/" target="_blank" rel="noopener noreferrer" style={{ marginBottom: '0.75rem' }}>
              <FaExternalLinkAlt />
              <span>Open Quartz Site</span>
            </ExternalLink>
            <ExternalLink as="button" onClick={() => setSearchTerm('')} style={{ marginBottom: '0.75rem' }}>
              <FaSearch />
              <span>Clear Search</span>
            </ExternalLink>
            <ExternalLink as="button" onClick={() => setExpandedFolders(new Set(Object.keys(groupedFiles)))}>
              <FaFolder />
              <span>Expand All</span>
            </ExternalLink>
          </QuickActionsPanel>
        </RightPanel>
      </ContentWrapper>
    </NotesContainer>
  );
}