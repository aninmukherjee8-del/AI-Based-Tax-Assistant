import React, { useState, useRef, useEffect } from "react";
import { Lock, UploadCloud, Activity, Check, FileCheck2, FileText, Trash2 } from "lucide-react";
import api from "../services/api.js";

const formatVaultDate = (doc) => {
  const date = new Date(doc.createdAt || doc.uploadedAt);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const formatVaultFileSize = (doc) => {
  const bytes = doc.fileSize ?? doc.filesize;
  if (!bytes) return "-";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDocumentType = (doc) => {
  const type = doc.documentType || doc.extractedData?.documentType;
  if (!type) return "Other";
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
};

export default function SecureVaultTab({
  setGrossIncome,
  setDeduction80C,
  setDeduction80D,
  setDeductionNps,
  setDeductionHra,
  customFiles,
  setCustomFiles,
  setActiveTab,
}) {
  const [vaultUploadState, setVaultUploadState] = useState("idle");
  // idle | uploading | complete | exists | error
  const [vaultUploadedFile, setVaultUploadedFile] = useState(null);

  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/documents");
      setDocuments(response.data.documents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
}, []);

  const handleVaultFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVaultUploadedFile(file.name);
    setVaultUploadState("uploading");
    try{
      const formData = new FormData();
      formData.append("document", file);
      const response = await api.post("/documents/parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      const extracted =
      response.data.text?.taxProfile ??
      response.data.document?.extractedData?.taxProfile;
      if (!extracted) {
        console.error("No tax profile returned");
        return;
      }
      if(!response.data.alreadyUploaded){
        const newFile = {
            name: file.name,
            type: response.data.text?.documentType ?? "Document",
            date: new Date().toLocaleDateString(),
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            status: "Parsed & Active",
        };
        setCustomFiles(prev => [newFile, ...prev]);
      }
      if (extracted.grossIncome != null) {
        setGrossIncome(extracted.grossIncome);
      }
      if (extracted.deduction80C != null) {
        setDeduction80C(extracted.deduction80C);
      }
      if (extracted.deduction80D != null) {
        setDeduction80D(extracted.deduction80D);
      }
      if (extracted.npsContribution != null) {
        setDeductionNps(extracted.npsContribution);
      }
      if (extracted.hraExemption != null) {
        setDeductionHra(extracted.hraExemption);
      }
      if (response.data.alreadyUploaded) {
        setVaultUploadState("exists");
      } else {
        setVaultUploadState("complete");
      }
      await fetchDocuments();
    }
    catch (err) {
      console.error(err);
      setVaultUploadState("error");
    }
    finally {
        e.target.value = "";
    }
  };

  return (
    <div className="space-y-6 animate-bubble-fade-in text-xs">
      {/* Upload area with file trigger */}
      <div className="relative overflow-hidden">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleVaultFileSelect}
          className="hidden"
        />

        {vaultUploadState === "idle" && (
          <div
            onClick={() => fileInputRef.current.click()}
            className="border border-dashed border-slate-800 hover:border-emerald-500/20 rounded-3xl p-10 text-center bg-slate-900/30 backdrop-blur-md transition-colors group cursor-pointer"
          >
            <UploadCloud className="w-12 h-12 text-slate-500 mx-auto mb-3 group-hover:text-emerald-400 transition-colors duration-300" />
            <h3 className="text-sm font-bold text-slate-200 mb-1 group-hover:text-white">
              Upload new documents to extract
            </h3>
            <h5 className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Click to select files. Upload Form 16, rent receipts, health
              premium bills, or investment statements.
            </h5>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 border border-emerald-500/20 rounded-xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
              Select File
            </span>
          </div>
        )}

        {vaultUploadState === "uploading" && (
          <div className="border border-emerald-500/20 bg-slate-950/90 rounded-3xl p-10 flex flex-col items-center justify-center h-56">
            <Activity className="w-10 h-10 text-emerald-400 animate-spin mb-4" />

            <h3 className="text-white font-bold text-lg">
              Processing Document...
            </h3>

            <p className="text-slate-400 mt-2 text-center">
              Uploading your document, extracting tax details and securely saving it.
            </p>
          </div>
        )}

        {vaultUploadState === "complete" && (
          <div className="border border-emerald-500/30 bg-emerald-950/10 rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-bounce">
              <FileCheck2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-emerald-400 uppercase tracking-widest">
                Document Parsed and Saved
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                <strong>{vaultUploadedFile}</strong> has been encrypted, saved
                to vault, and scanned for tax optimization.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setVaultUploadState("idle");
                  setActiveTab("command-center");
                }}
                className="text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                View in Command Center
              </button>
              <button
                onClick={() => setVaultUploadState("idle")}
                className="text-[10px] font-bold bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
        {vaultUploadState === "exists" && (
          <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-3xl p-10 text-center">
            <FileCheck2 className="w-10 h-10 text-yellow-400 mx-auto mb-4" />

            <h3 className="text-lg font-bold text-yellow-400">
              Document Already Exists
            </h3>

            <p className="text-slate-300 mt-2">
              <strong>{vaultUploadedFile}</strong> was already uploaded.
              Existing extracted data has been loaded.
            </p>

            <button
              onClick={() => setVaultUploadState("idle")}
              className="mt-5 bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-xl"
            >
              Upload Another
            </button>
          </div>
        )}
        {vaultUploadState === "error" && (
          <div className="border border-red-500/20 bg-red-500/5 rounded-3xl p-10 text-center">
            <h3 className="text-red-400 font-bold text-lg">
              Upload Failed
            </h3>

            <p className="text-slate-300 mt-2">
              Something went wrong while processing your document.
            </p>

            <button
              onClick={() => setVaultUploadState("idle")}
              className="mt-5 bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-xl"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Files Index Table */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Vault Files ({documents.length})</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-bold">
                <th className="pb-3 pr-4">File Name</th>
                <th className="pb-3 pr-4">Document Type</th>
                <th className="pb-3 pr-4">Date Added</th>
                <th className="pb-3 pr-4">File Size</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50">
              {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-500"
                >
                  No documents uploaded yet.
                </td>
              </tr>
            ) : 
              documents.map((doc) => (
                <tr key={doc._id} className="text-slate-300 hover:bg-slate-900/10">
                  <td className="py-4.5 pr-4 font-bold flex items-center space-x-2 text-emerald-400">
                    <FileCheck2 className="w-4 h-4 shrink-0" />
                    <span className="truncate max-w-150px">{doc.originalFileName}</span>
                  </td>
                  <td className="py-4.5 pr-4 font-medium">{formatDocumentType(doc)}</td>
                  <td className="py-4.5 pr-4 text-slate-400">{formatVaultDate(doc)}</td>
                  <td className="py-4.5 pr-4 text-slate-400">{formatVaultFileSize(doc)}</td>
                  <td className="py-4.5 pr-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                      {"Synced"}
                    </span>
                  </td>
                  <td className="py-4.5 text-right">
                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
