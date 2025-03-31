import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange }) {
  useEffect(() => {
    console.log('CodeEditor received code:', code);
  }, [code]);

  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <Editor
          key={code}
          height="100%"
          language="javascript"
          defaultValue={code}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyond: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            wordWrap: 'on',
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible'
            }
          }}
        />
      </div>
    </div>
  );
} 