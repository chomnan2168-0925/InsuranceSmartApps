import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// This is a mock Rich Text Editor. In a real application, you would integrate a
// library like 'react-quill', 'draft-js', or 'tiptap' here.
const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="mt-1 border border-gray-300 rounded-md shadow-sm">
      <div className="p-2 bg-gray-50 border-b border-gray-300 text-xs text-gray-500">
        Mock Toolbar (Bold, Italic, Link, etc.)
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-96 p-2 border-0 focus:ring-0 rounded-b-md"
        placeholder="Start writing your article here..."
      />
    </div>
  );
};

export default RichTextEditor;
