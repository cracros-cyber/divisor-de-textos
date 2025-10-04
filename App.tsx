import React, { useState, useMemo, useCallback } from 'react';

// --- Helper Function: Text Splitting Logic ---

const splitTextIntoChunks = (text: string, maxLength: number): string[] => {
  if (!text || maxLength <= 0) return [];
  
  const chunks: string[] = [];
  let remainingText = text.trim();

  while (remainingText.length > 0) {
    if (remainingText.length <= maxLength) {
      chunks.push(remainingText);
      break;
    }

    let potentialChunk = remainingText.substring(0, maxLength);
    let lastSpaceIndex = potentialChunk.lastIndexOf(' ');

    // If no space is found or the only space is at the start, we must cut the word
    if (lastSpaceIndex <= 0) {
      lastSpaceIndex = maxLength;
    }
    
    const chunk = remainingText.substring(0, lastSpaceIndex);
    chunks.push(chunk.trim());
    remainingText = remainingText.substring(lastSpaceIndex).trim();
  }

  return chunks;
};


// --- SVG Icon Components ---

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const ScissorsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"></circle>
      <circle cx="6" cy="18" r="3"></circle>
      <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
      <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
      <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

// --- UI Components ---

interface ChunkCardProps {
    chunk: string;
    index: number;
}

const ChunkCard: React.FC<ChunkCardProps> = ({ chunk, index }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(chunk).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [chunk]);

    return (
        <div className="bg-white/80 border border-slate-200 rounded-lg shadow-sm transition-all duration-300 hover:border-purple-400/50 hover:shadow-md">
            <div className="flex justify-between items-center p-3 bg-slate-50/70 border-b border-slate-200">
                <h3 className="font-semibold text-sm text-slate-700">
                    Parte {index + 1} <span className="text-slate-500 font-normal">({chunk.length} caracteres)</span>
                </h3>
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
                        copied
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
            <p className="p-4 text-slate-800 text-sm whitespace-pre-wrap">{chunk}</p>
        </div>
    );
};


// --- Main App Component ---

export default function App() {
    const [text, setText] = useState('');
    const [chunkSize, setChunkSize] = useState(400);
    const [chunks, setChunks] = useState<string[]>([]);

    const handleProcessText = useCallback(() => {
        const result = splitTextIntoChunks(text, chunkSize);
        setChunks(result);
    }, [text, chunkSize]);
    
    const handleClear = useCallback(() => {
        setText('');
        setChunks([]);
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100 text-slate-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
            <div className="w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-purple-100/50 space-y-8">
                
                <header className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        Divisor de Texto
                    </h1>
                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                        Cole seu texto para dividi-lo em partes com um limite de caracteres. Perfeito para redes sociais.
                    </p>
                </header>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="text-input" className="block text-sm font-medium text-slate-700 mb-2">
                            Seu Texto
                        </label>
                        <textarea
                            id="text-input"
                            rows={10}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Comece a digitar ou cole seu texto aqui..."
                            className="w-full bg-white/50 border-2 border-slate-300 text-slate-800 rounded-lg p-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-y"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,auto] items-end gap-4">
                        <div>
                            <label htmlFor="chunk-size" className="block text-sm font-medium text-slate-700 mb-2">
                                Tamanho Máximo por Parte
                            </label>
                            <input
                                type="number"
                                id="chunk-size"
                                value={chunkSize}
                                onChange={(e) => setChunkSize(Number(e.target.value))}
                                min="1"
                                className="w-full bg-white/50 border-2 border-slate-300 text-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                            />
                        </div>
                        <button
                            onClick={handleClear}
                            disabled={!text && chunks.length === 0}
                            className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                        >
                           <TrashIcon />
                            Limpar
                        </button>
                        <button
                            onClick={handleProcessText}
                            disabled={!text}
                            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/30"
                        >
                           <ScissorsIcon />
                            Dividir Texto
                        </button>
                    </div>
                </div>

                {chunks.length > 0 && (
                    <div className="border-t border-slate-200 pt-8 space-y-4">
                        <h2 className="text-2xl font-bold text-center text-slate-800">
                            Resultados <span className="text-purple-600">({chunks.length} partes)</span>
                        </h2>
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1 pr-2">
                            {chunks.map((chunk, index) => (
                                <ChunkCard key={index} chunk={chunk} index={index} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
