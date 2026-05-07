import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileCode, FileJson, X, Terminal, Maximize2, Minimize2, CheckCircle2, ChevronRight, Download, Plus } from 'lucide-react';

// Mock data for the generated files
const initialFiles = [
  { id: '1', name: 'schema.prisma', type: 'prisma', content: 'generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel User {\n  id    Int     @id @default(autoincrement())\n  email String  @unique\n  name  String?\n  posts Post[]\n}\n\nmodel Post {\n  id        Int     @id @default(autoincrement())\n  title     String\n  content   String?\n  published Boolean @default(false)\n  author    User    @relation(fields: [authorId], references: [id])\n  authorId  Int\n}' },
  { id: '2', name: 'mock_users.json', type: 'json', content: '[\n  {\n    "id": 1,\n    "email": "alice@example.com",\n    "name": "Alice Smith"\n  },\n  {\n    "id": 2,\n    "email": "bob@example.com",\n    "name": "Bob Jones"\n  }\n]' },
  { id: '3', name: 'mock_posts.json', type: 'json', content: '[\n  {\n    "id": 101,\n    "title": "Getting Started with Mockmate",\n    "content": "This is a great tool for generating data.",\n    "published": true,\n    "authorId": 1\n  }\n]' }
];

const initialInputFiles = [
  { id: 'in1', name: 'product_schema.js', type: 'js', content: 'export const productSchema = {\n  type: "object",\n  properties: {\n    id: { type: "integer" },\n    name: { type: "string" },\n    price: { type: "number" }\n  }\n};' },
  { id: 'in2', name: 'user_profile_template.js', type: 'js', content: 'export const userProfileTemplate = {\n  profile: {\n    username: "{{name.firstName}}",\n    age: "{{datatype.number({min: 18, max: 65})}}"\n  }\n};' }
];

const mockLogs = [
  '[INFO] Initializing Mockmate engine...',
  '[INFO] Parsing schema files...',
  '[SUCCESS] Successfully parsed schema.prisma (2 models found)',
  '[INFO] Resolving relationships (User 1-to-many Post)...',
  '[INFO] Generating mock data for User (Target: 100 rows)...',
  '[INFO] Generating mock data for Post (Target: 500 rows)...',
  '[SUCCESS] Mock data generated successfully in 1.42s.',
  '[INFO] Preparing output files for download...'
];

const Output = () => {
  const { id } = useParams();
  const [files, setFiles] = useState(initialFiles);
  const [inputFiles, setInputFiles] = useState(initialInputFiles);
  const [activeFileId, setActiveFileId] = useState(initialFiles[0]?.id || null);
  const [openTabs, setOpenTabs] = useState([initialFiles[0]?.id].filter(Boolean));
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId) || inputFiles.find(f => f.id === activeFileId);

  const openFile = (fileId) => {
    if (!openTabs.includes(fileId)) {
      setOpenTabs([...openTabs, fileId]);
    }
    setActiveFileId(fileId);
  };

  const closeTab = (e, fileId) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(id => id !== fileId);
    setOpenTabs(newTabs);
    if (activeFileId === fileId) {
      setActiveFileId(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  const closeFile = (e, fileId) => {
    e.stopPropagation();
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    closeTab(e, fileId);
  };

  const closeInputFile = (e, fileId) => {
    e.stopPropagation();
    const newFiles = inputFiles.filter(f => f.id !== fileId);
    setInputFiles(newFiles);
    closeTab(e, fileId);
  };

  const toggleTerminal = () => {
    setIsTerminalExpanded(!isTerminalExpanded);
    if (!isTerminalExpanded) setIsEditorExpanded(false);
  };

  const toggleEditor = () => {
    setIsEditorExpanded(!isEditorExpanded);
    if (!isEditorExpanded) setIsTerminalExpanded(false);
  };

  return (
    <main className="max-w-8xl mx-auto px-4 md:px-6 pt-24 pb-8 min-h-[calc(100vh-100px)] relative z-10 transition-colors duration-300">
      
      {/* Header Info */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Generation Results
            <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Complete
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Project ID: {id}</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-lg shadow-brand-500/20">
          <Download className="w-4 h-4" /> Download All
        </button>
      </div> */}

      <div className="flex flex-col lg:flex-row gap-6 h-[100vh]">
        
        {/* Left Sidebar - File Explorer */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 relative z-20 h-full">
          
          {/* Input Schemas Section */}
          <div className="flex-1 min-h-[150px] flex flex-col bg-[#1a1f2e] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="px-4 py-3 border-b border-gray-800 bg-[#1e2333] flex justify-between items-center">
              <h2 className="text-xs font-semibold text-gray-300">Input_Schemas</h2>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {inputFiles.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 text-center">No input schemas.</p>
              ) : (
                inputFiles.map(file => (
                  <div 
                    key={file.id}
                    onClick={() => openFile(file.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm mb-1 transition-colors group
                      ${activeFileId === file.id ? 'bg-[#2a3045] text-blue-400' : 'hover:bg-[#22283a] text-gray-400'}
                    `}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {file.type === 'json' ? <FileJson className="w-4 h-4 flex-shrink-0 opacity-70" /> : <FileCode className="w-4 h-4 flex-shrink-0 opacity-70" />}
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button 
                      onClick={(e) => closeInputFile(e, file.id)}
                      className={`p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors ${activeFileId === file.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Generated Data Section */}
          <div className="flex-1 min-h-[150px] flex flex-col bg-[#1a1f2e] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="px-4 py-3 border-b border-gray-800 bg-[#1e2333] flex justify-between items-center">
              <h2 className="text-xs font-semibold text-gray-300">Generated_Data</h2>
              <button className="text-gray-400 hover:text-white transition-colors" title="Download Data">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {files.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 text-center">No files remaining.</p>
              ) : (
                files.map(file => (
                  <div 
                    key={file.id}
                    onClick={() => openFile(file.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm mb-1 transition-colors group
                      ${activeFileId === file.id ? 'bg-[#2a3045] text-blue-400' : 'hover:bg-[#22283a] text-gray-400'}
                    `}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {file.type === 'json' ? <FileJson className="w-4 h-4 flex-shrink-0 opacity-70" /> : <FileCode className="w-4 h-4 flex-shrink-0 opacity-70" />}
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button 
                      onClick={(e) => closeFile(e, file.id)}
                      className={`p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors ${activeFileId === file.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Side - File Viewer & Terminal */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden relative">
          
          {/* File Viewer */}
          <div className={`bg-[#1e1e1e] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-lg flex-col transition-all duration-300
            ${isEditorExpanded ? 'absolute inset-0 z-30 h-full' : 'flex-1 min-h-[300px]'}
            ${isTerminalExpanded ? 'hidden' : 'flex'}
          `}>
            {/* Editor Header Row */}
            <div className="flex items-center justify-between bg-[#252526] border-b border-[#3c3c3c]">
              {/* Editor Tabs */}
              <div className="flex items-center overflow-x-auto flex-nowrap flex-1">
                {openTabs.length > 0 ? (
                  openTabs.map(tabId => {
                    const tabFile = files.find(f => f.id === tabId) || inputFiles.find(f => f.id === tabId);
                    if (!tabFile) return null;
                    const isActive = activeFileId === tabId;
                    return (
                      <div 
                        key={tabId}
                        onClick={() => setActiveFileId(tabId)}
                        className={`flex items-center gap-2 px-3 py-2 min-w-[120px] max-w-[200px] cursor-pointer border-r border-[#3c3c3c] group transition-colors
                          ${isActive ? 'bg-[#1e1e1e] border-t-2 border-t-brand-500' : 'bg-[#2d2d2d] border-t-2 border-t-transparent hover:bg-[#252526]'}
                        `}
                      >
                        {tabFile.type === 'json' ? <FileJson className="w-4 h-4 text-yellow-400 opacity-80 flex-shrink-0" /> : <FileCode className="w-4 h-4 text-blue-400 opacity-80 flex-shrink-0" />}
                        <span className={`text-sm truncate select-none flex-1 ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>{tabFile.name}</span>
                        <button 
                          onClick={(e) => closeTab(e, tabId)}
                          className={`p-0.5 rounded-md hover:bg-[#4c4c4c] transition-colors ml-1 flex-shrink-0
                            ${isActive ? 'opacity-100 text-gray-400 hover:text-white' : 'opacity-0 group-hover:opacity-100 text-gray-500'}
                          `}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500 italic select-none">No files open</div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center px-2">
                <button 
                  onClick={toggleEditor}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10 flex-shrink-0"
                  title={isEditorExpanded ? "Minimize Editor" : "Maximize Editor"}
                >
                  {isEditorExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
              
              {/* Editor Content */}
              <div className="flex-1 overflow-auto p-4 relative">
                {activeFile ? (
                  <pre className="font-mono text-sm text-gray-300">
                    <code>{activeFile.content}</code>
                  </pre>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <FileCode className="w-12 h-12 mb-4 opacity-20" />
                    <p>Select a file to view its contents</p>
                  </div>
                )}
              </div>
            </div>

          {/* Terminal */}
          <div className={`bg-[#0d1117] border border-[var(--color-border)] rounded-xl flex-col overflow-hidden shadow-lg transition-all duration-300
            ${isTerminalExpanded ? 'absolute inset-0 z-30 h-full' : 'h-64 flex-shrink-0'}
            ${isEditorExpanded ? 'hidden' : 'flex'}
          `}>
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex items-center gap-2 text-gray-400">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Output Console</span>
              </div>
              <button 
                onClick={toggleTerminal}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                title={isTerminalExpanded ? "Minimize Terminal" : "Maximize Terminal"}
              >
                {isTerminalExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Terminal Body */}
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
              {mockLogs.map((log, i) => (
                <div key={i} className="mb-1 flex">
                  <span className="text-gray-600 mr-4 select-none flex-shrink-0">
                    {new Date().toISOString().substring(11, 19)}
                  </span>
                  <span className={`
                    ${log.includes('[SUCCESS]') ? 'text-green-400' : ''}
                    ${log.includes('[INFO]') ? 'text-blue-400' : ''}
                    ${!log.includes('[') ? 'text-gray-300' : ''}
                  `}>
                    {log}
                  </span>
                </div>
              ))}
              <div className="mt-4 flex items-center text-gray-400 animate-pulse">
                <ChevronRight className="w-4 h-4" />
                <span className="w-2 h-4 bg-gray-400 ml-1"></span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
};

export default Output;
