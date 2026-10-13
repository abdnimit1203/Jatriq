import React, { useState } from 'react';
import { X, Upload, AlertTriangle, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { TourPackage } from '../../types';
import { validateTourPackagesJson, ValidationResult } from '../../lib/jsonPackageValidator';
import { useLanguage } from '../../context/LanguageContext';

interface AdminJsonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (packages: TourPackage[]) => void;
  currentPackageCount: number;
}

export const AdminJsonImportModal: React.FC<AdminJsonImportModalProps> = ({
  isOpen,
  onClose,
  onConfirmImport,
  currentPackageCount,
}) => {
  const { language } = useLanguage();

  const [fileName, setFileName] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [confirmedWarning, setConfirmedWarning] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError(null);
    setValidationResult(null);
    setConfirmedWarning(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const result = validateTourPackagesJson(parsed);
        setValidationResult(result);
      } catch (err: any) {
        setParseError(`JSON Syntax Error: ${err.message || 'Failed to parse JSON file'}. Please verify syntax.`);
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read the selected file from disk.');
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    if (!validationResult || !validationResult.isValid) return;
    onConfirmImport(validationResult.packages);
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setFileName(null);
    setValidationResult(null);
    setParseError(null);
    setConfirmedWarning(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-800" />
            <h3 className="text-lg font-bold text-stone-900">
              {language === 'bn' ? 'ট্যুর প্যাকেজ JSON ইমপোর্ট' : 'Import Tour Packages (JSON)'}
            </h3>
          </div>
          <button onClick={handleResetAndClose} className="p-1 text-stone-400 hover:text-stone-700 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4 text-xs sm:text-sm">
          {/* File Picker Box */}
          <div className="border-2 border-dashed border-stone-300 hover:border-emerald-700 rounded-xl p-6 text-center transition-colors bg-stone-50/50">
            <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Select .json file from computer</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {fileName && (
              <p className="mt-2 text-xs font-mono text-stone-700 font-medium">
                Selected: {fileName}
              </p>
            )}
            <p className="mt-1 text-[11px] text-stone-400">
              Only standard Jatriq packages array format is accepted.
            </p>
          </div>

          {/* Syntax Error */}
          {parseError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Parsing Failed</span>
                <p>{parseError}</p>
              </div>
            </div>
          )}

          {/* Validation Result */}
          {validationResult && (
            <div className="space-y-3">
              {validationResult.isValid ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      {validationResult.packages.length} Packages Validated Successfully!
                    </span>
                  </div>
                  <p className="text-emerald-800 text-[11px]">
                    All required fields, IDs, slugs, and bilingual structures match Jatriq requirements.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Validation Failed ({validationResult.errors.length} errors found)</span>
                  </div>
                  <ul className="list-disc list-inside max-h-36 overflow-y-auto space-y-0.5 text-[11px]">
                    {validationResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <span className="font-semibold block mb-0.5">Warnings ({validationResult.warnings.length}):</span>
                  <ul className="list-disc list-inside text-[11px]">
                    {validationResult.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Package List Preview */}
              {validationResult.isValid && (
                <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 max-h-40 overflow-y-auto space-y-1 text-xs">
                  <span className="font-bold text-stone-700 block mb-1 text-[11px] uppercase tracking-wide">
                    Import Preview:
                  </span>
                  {validationResult.packages.map((pkg, idx) => (
                    <div key={pkg.id || idx} className="flex items-center justify-between py-1 border-b border-stone-200/60 last:border-0">
                      <span className="font-medium text-stone-900 truncate max-w-[280px]">
                        {pkg.title?.en || pkg.title?.bn}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        BDT {pkg.priceBDT?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Warning Confirmation Box */}
              {validationResult.isValid && (
                <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">
                        Confirm Data Replacement:
                      </span>
                      <p className="text-[11px] text-amber-800">
                        Applying this import will replace your currently loaded {currentPackageCount} package(s) with these {validationResult.packages.length} package(s). Changes persist in your browser and will instantly update the public site.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-1 font-semibold text-amber-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmedWarning}
                      onChange={(e) => setConfirmedWarning(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-800"
                    />
                    <span>Yes, I confirm replacing the current package list</span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!validationResult?.isValid || !confirmedWarning}
            onClick={handleApplyImport}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
          >
            Confirm & Import Packages
          </button>
        </div>
      </div>
    </div>
  );
};
