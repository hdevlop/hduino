'use client';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeContentProps {
  code: string;
}

export function CodeContent({ code }: CodeContentProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      if (!code || code === '// Add blocks to generate Arduino code') {
        setHighlightedCode('');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const html = await codeToHtml(code, {
          lang: 'cpp',
          theme: 'github-dark',
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHighlightedCode(`<pre class="text-white/90 h-full">${code}</pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code]);

  return (
    <div className="flex-1 overflow-auto font-mono text-xs leading-relaxed bg-[#24292e] p-2">
      {isLoading ? (
        <pre className="text-white/50 ">Loading...</pre>
      ) : highlightedCode ? (
        <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <pre className="text-white/50 ">// Add blocks to generate Arduino code</pre>
      )}
    </div>
  );
}