
// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { FileText, AlertCircle, UploadCloud as CloudUpload } from 'lucide-react';

// interface ResumeUploaderProps {
//   onFileSelect: (file: File) => void;
//   isLoading: boolean;
// }

// const ResumeUploader: React.FC<ResumeUploaderProps> = ({ 
//   onFileSelect, 
//   isLoading 
// }) => {
//   const [error, setError] = useState<string>('');

//   const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
//     setError('');
    
//     if (rejectedFiles.length > 0) {
//       setError('Please upload a PDF file only (max 10MB)');
//       return;
//     }

//     if (acceptedFiles.length > 0) {
//       const file = acceptedFiles[0];
//       if (file.size > 10 * 1024 * 1024) {
//         setError('File size must be less than 10MB');
//         return;
//       }
      
//       onFileSelect(file);
//     }
//   }, [onFileSelect]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'application/pdf': ['.pdf']
//     },
//     maxFiles: 1,
//     disabled: isLoading
//   });

//   return (
//     <div className="w-full space-y-4">
//       <div
//         {...getRootProps()}
//         className={`
//           material-card elevation-2 cursor-pointer material-transition
//           border-2 border-dashed border-gray-300 hover:border-blue-500
//           relative p-8 rounded-xl
//           ${isDragActive ? 'border-blue-500 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}
//           ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
//         `}
//       >
//         <input {...getInputProps()} />
        
//         <div className="flex flex-col items-center text-center">
//           {isDragActive ? (
//             <CloudUpload className="w-16 h-16 mb-4 text-blue-500" />
//           ) : (
//             <FileText className="w-16 h-16 mb-4 text-gray-600" />
//           )}
          
//           <h3 className="text-2xl font-medium mb-2 text-gray-800">
//             {isLoading ? 'Processing...' : 'Upload Your Resume'}
//           </h3>
          
//           <p className="text-gray-600 font-normal text-base mb-4">
//             {isDragActive 
//               ? 'Drop your file here' 
//               : 'Drag & drop your PDF resume or click to browse'
//             }
//           </p>
          
//           <div className="text-sm text-gray-500">
//             PDF only • Max 10MB
//           </div>
//         </div>
        
//         {isLoading && (
//           <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         )}
//       </div>
      
//       {error && (
//         <div className="material-card elevation-2 bg-red-50 border-l-4 border-red-500 p-4 flex items-center rounded-r-md">
//           <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
//           <span className="text-red-700 font-medium">
//             {error}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeUploader;



























import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, AlertTriangle, UploadCloud } from 'lucide-react';
import { Toast , toast} from 'react-hot-toast';

interface ResumeUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ 
  onFileSelect, 
  isLoading 
}) => {
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a PDF file only (max 10MB)');
      toast('Please upload a PDF file only (max 10MB)')
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
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
    <div className="w-full space-y-6">
      <div
        {...getRootProps()}
        className={`
          relative cursor-pointer transition-all duration-300
          border-4 border-dashed p-10
          flex flex-col items-center justify-center text-center
          min-h-[300px]
          ${isDragActive 
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
            : 'border-black dark:border-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
          }
          ${isLoading 
            ? 'opacity-50 cursor-not-allowed grayscale' 
            : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-1'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {/* Icon Layer */}
        <div className={`
          mb-6 p-4 border-4 rounded-full
          ${isDragActive 
            ? 'bg-blue-500 border-blue-700 text-white animate-bounce' 
            : 'bg-gray-100 dark:bg-gray-700 border-black dark:border-gray-400 text-gray-800 dark:text-gray-200'
          }
        `}>
          {isDragActive ? (
            <UploadCloud className="w-12 h-12" />
          ) : (
            <FileText className="w-12 h-12" />
          )}
        </div>
        
        {/* Text Layer */}
        <div className="space-y-2">
          <h3 className={`text-2xl font-black uppercase tracking-tighter ${isDragActive ? 'text-blue-700 dark:text-blue-400' : 'text-black dark:text-white'}`}>
            {isLoading ? 'Scanning Document...' : 'Upload Your Resume'}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 font-bold text-lg">
            {isDragActive 
              ? 'Drop it like it\'s hot!' 
              : 'Drag & drop PDF here or click to browse'
            }
          </p>
          
          <div className="inline-block mt-4 px-3 py-1 bg-black dark:bg-gray-200 text-white dark:text-black text-xs font-black uppercase tracking-widest">
            PDF • Max 10MB
          </div>
        </div>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/90 dark:bg-gray-900/90 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-8 border-black dark:border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black text-xl uppercase animate-pulse dark:text-white">Analyzing...</p>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-4 border-red-600 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 shrink-0" />
          <div>
            <h4 className="font-black text-red-800 dark:text-red-300 uppercase">Upload Failed</h4>
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;