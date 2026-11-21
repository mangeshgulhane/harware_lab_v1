import React, { useRef, useEffect } from 'react';

declare const require: any;
declare const monaco: any;

interface CodeEditorProps {
  code: string;
  language: 'python' | 'cpp';
  theme: 'light' | 'dark';
  isEditable?: boolean;
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, theme, isEditable = false, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Effect for creating and destroying the editor instance
  useEffect(() => {
    if (editorRef.current) {
      require(['vs/editor/editor.main'], () => {
        // Dispose of the old editor instance if it exists
        if (editorInstanceRef.current) {
          editorInstanceRef.current.dispose();
        }

        const editor = monaco.editor.create(editorRef.current!, {
          value: code,
          language: language,
          theme: theme === 'dark' ? 'vs-dark' : 'vs',
          readOnly: !isEditable,
          minimap: { enabled: false },
          automaticLayout: false, // Disable automatic layout to prevent ResizeObserver loop
          scrollBeyondLastLine: false,
          fontSize: 13,
          wordWrap: 'on',
        });

        editorInstanceRef.current = editor;

        if (onChange) {
            editor.onDidChangeModelContent(() => {
                const currentValue = editor.getValue();
                onChangeRef.current?.(currentValue);
            });
        }
      });
    }

    // Cleanup function to dispose the editor
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose();
        editorInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // Only re-create the editor if the language fundamentally changes

  // Effect to handle manual layout on resize, fixing the ResizeObserver error
  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const editorElement = editorRef.current;
    const observer = new ResizeObserver(() => {
        // Use a timeout to break the synchronous rendering loop that causes the error
        setTimeout(() => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.layout();
            }
        }, 0);
    });

    observer.observe(editorElement);

    return () => {
      observer.disconnect();
    };
  }, []); // Run only once on mount

  // Effect to update code value dynamically
  useEffect(() => {
    if (editorInstanceRef.current && editorInstanceRef.current.getValue() !== code) {
      editorInstanceRef.current.setValue(code);
    }
  }, [code]);

  // Effect to update theme dynamically
  useEffect(() => {
    if (typeof monaco !== 'undefined' && editorInstanceRef.current) {
      monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
    }
  }, [theme]);

  // Effect to update readOnly status dynamically
  useEffect(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.updateOptions({ readOnly: !isEditable });
    }
  }, [isEditable]);

  return <div ref={editorRef} style={{ width: '100%', height: '100%' }} />;
};

export default CodeEditor;