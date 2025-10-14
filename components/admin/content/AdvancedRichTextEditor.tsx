// components/admin/content/AdvancedRichTextEditor.tsx
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  imageUploadHandler?: (blobInfo: any, progress: (percent: number) => void) => Promise<string>;
  onCloudinaryClick?: () => void;
}

const AdvancedRichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange,
  imageUploadHandler,
  onCloudinaryClick
}) => {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  if (!apiKey) {
    return (
      <div className="border border-red-400 bg-red-50 p-4 rounded-md text-red-700">
        <strong>Error:</strong> TinyMCE API key is not configured. Please add it to your 
        <code>.env.local</code> file and restart your server.
      </div>
    );
  }

  return (
    <div className="mt-1">
      <Editor
        apiKey={apiKey}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image ' +
            (onCloudinaryClick ? '| cloudinary-image ' : '') +
            '| code | help',
          content_style: `
            body { 
              font-family:Helvetica,Arial,sans-serif; 
              font-size:16px;
            }
            p {
              margin: 0 0 10px 0;
            }
          `,
          // Add automatic image upload if handler is provided
          automatic_uploads: !!imageUploadHandler,
          images_upload_handler: imageUploadHandler,
          paste_data_images: !!imageUploadHandler,
          
          setup: (editor) => {
            // Shift+Enter for line break
            editor.on('keydown', (event) => {
              if (event.key === 'Enter' && event.shiftKey) {
                event.preventDefault();
                editor.execCommand('InsertLineBreak');
              }
            });

            // Add Cloudinary button if callback is provided
            if (onCloudinaryClick) {
              editor.ui.registry.addButton('cloudinary-image', {
                text: 'Cloudinary',
                icon: 'image',
                tooltip: 'Insert image from Cloudinary',
                onAction: () => onCloudinaryClick(),
              });
            }
          }
        }}
      />
    </div>
  );
};

export default AdvancedRichTextEditor;