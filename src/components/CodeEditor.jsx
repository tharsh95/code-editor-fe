import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, language }) {
  useEffect(() => {
    console.log('CodeEditor received code:', code);
  }, [code]);

  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={language || "javascript"}
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
          },
          scrollBeyondLastLine: false,
          fixedOverflowWidgets: true,
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          wordBasedSuggestions: true,
          parameterHints: {
            enabled: true,
            cycle: true,
            showMethods: true,
            showVariables: true,
            showOther: true
          }
        }}
      />
    </div>
  );
} 