import { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

const DocumentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setStatus('uploading');
    // In a real app, this would call api.uploadDocument(selectedFile)
    setTimeout(() => {
      console.log('Simulating upload for:', selectedFile.name);
      setStatus('success');
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-brand-accent">Document Upload</h2>
      <p className="mb-4 text-gray-400">Facilitates scanning and uploading of documents (e.g., receipts, Bill of Lading).</p>
      <div className="p-6 border-2 border-dashed border-gray-600 rounded-lg text-center">
        <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
        <label htmlFor="file-upload" className="cursor-pointer">
          <UploadCloud className="w-12 h-12 mx-auto text-gray-500" />
          <p className="mt-2">{selectedFile ? selectedFile.name : 'Select a document to upload'}</p>
        </label>
      </div>
      {selectedFile && (
        <div className="mt-4 text-center">
          <button onClick={handleUpload} disabled={status === 'uploading'} className="bg-brand-accent text-white px-6 py-2 rounded-lg hover:bg-blue-500 disabled:bg-gray-500">
            {status === 'uploading' ? 'Uploading...' : 'Upload Document'}
          </button>
          {status === 'success' && <p className="text-green-400 mt-2">Upload successful!</p>}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;

