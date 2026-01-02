import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a PDF file only (max 5MB)');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-4 border-black p-8 bg-yellow-300 
          cursor-pointer transition-all duration-200 
          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
          hover:translate-x-[-4px] hover:translate-y-[-4px]
          ${isDragActive ? 'bg-lime-300' : ''}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center text-center">
          {isDragActive ? (
            <Upload className="w-16 h-16 mb-4 text-black" />
          ) : (
            <FileText className="w-16 h-16 mb-4 text-black" />
          )}
          
          <h3 className="text-2xl font-black mb-2 text-black uppercase tracking-wider">
            {isLoading ? 'PROCESSING...' : 'DROP YOUR RESUME'}
          </h3>
          
          <p className="text-black font-bold text-lg">
            {isDragActive 
              ? 'DROP IT LIKE IT\'S HOT!' 
              : 'Drag & drop your PDF resume or click to browse'
            }
          </p>
          
          <div className="mt-4 text-sm font-bold text-black">
            PDF ONLY • MAX 5MB
          </div>
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-500 border-4 border-black text-white font-bold flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;