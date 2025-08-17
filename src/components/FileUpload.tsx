import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet, AlertCircle, Trash2 } from 'lucide-react';
import Papa from 'papaparse';
import { api, UploadResponse } from '@/lib/api';

type FileType = 'csv' | 'excel' | 'parquet';

interface ParsedData {
  columns: string[];
  data: any[][];
  rowCount: number;
  summary: {
    numerical: number;
    categorical: number;
    datetime: number;
  };
}

interface FileUploadProps {
  onDataUploaded?: (data: ParsedData) => void;
}

export function FileUpload({ onDataUploaded }: FileUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [fileType, setFileType] = useState<FileType>('csv');
  const [delimiterChoice, setDelimiterChoice] = useState<'comma' | 'tab' | 'space' | 'semicolon' | 'colon'>('comma');
  const [xlsxSheet, setXlsxSheet] = useState<string>('');

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [backendInfo, setBackendInfo] = useState<UploadResponse | null>(null);
  const [uploadedData, setUploadedData] = useState<ParsedData | null>(null);

  const delimiterChar = useMemo(() => {
    switch (delimiterChoice) {
      case 'tab': return '\t';
      case 'space': return ' ';
      case 'semicolon': return ';';
      case 'colon': return ':';
      case 'comma':
      default: return ',';
    }
  }, [delimiterChoice]);

  const getFileIcon = (ext: string) => {
    switch (ext) {
      case 'csv':
      case 'xlsx':
      case 'xls':
      case 'parquet':
      case 'txt':
        return <FileSpreadsheet className="w-8 h-8 text-accent" />;
      default:
        return <Upload className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const resetState = () => {
    setUploadedFile(null);
    setUploadedData(null);
    setBackendInfo(null);
    setUploadProgress(0);
    (window as any).__UPLOADED_FILE_PATH__ = undefined;
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) {
      void processUpload(files[0]);
    }
  }, []);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void processUpload(f);
  };

  const parseCSVClient = (file: File): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,                 // <-- use header row as column names
        skipEmptyLines: true,
        delimiter: delimiterChar,     // respects your selected delimiter
        dynamicTyping: false,
        complete: (results) => {
          const rows = results.data as any[]; // array of objects when header:true
          const fields =
            // @ts-expect-error Papa types can be loose
            (results.meta?.fields as string[] | undefined) || [];

          // Fallback to keys of first row if meta.fields is missing
          const columns =
            fields.length > 0
              ? fields.map(String)
              : Object.keys(rows[0] ?? {}).map(String);

          // Optional: build a light preview matrix (kept small)
          const dataPreview: any[][] = rows.slice(0, 50).map((r) =>
            columns.map((c) => r[c])
          );

          resolve({
            columns,
            data: dataPreview,          // keep as [] if you don’t need row preview
            rowCount: rows.length,
            summary: { numerical: 0, categorical: 0, datetime: 0 },
          });
        },
        error: (err) => reject(err),
      });
    });
  };


  const processUpload = async (file: File) => {
    try {
      resetState();
      setIsUploading(true);
      setUploadedFile(file);
      setUploadProgress(5);

      // Simulate progress while the backend processes
      const tick = setInterval(() => {
        setUploadProgress((p) => (p < 90 ? p + 5 : p));
      }, 150);

      // Determine opts based on selected fileType
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const effectiveType: FileType =
        fileType || ((ext === 'xlsx' || ext === 'xls') ? 'excel' : (ext === 'parquet' ? 'parquet' : 'csv'));

      const opts: any = {};
      if (effectiveType === 'csv') opts.delimiter = delimiterChar;
      if (effectiveType === 'excel') opts.sheet_name = xlsxSheet || undefined;

      // Upload to backend
      const backend = await api.upload(file, opts);
      setBackendInfo(backend);
      (window as any).__UPLOADED_FILE_PATH__ = backend.path;

      // Build ParsedData for the app state:
      // - CSV: we can parse client-side using chosen delimiter for an immediate preview.
      // - Excel/Parquet: rely on backend metadata (no heavy parsing in browser).
      let parsed: ParsedData;
      if (effectiveType === 'csv') {
        parsed = await parseCSVClient(file);
      } else {
        parsed = {
          columns: backend.columns || [],
          data: [],
          rowCount: backend.row_count ?? 0,
          summary: { numerical: 0, categorical: 0, datetime: 0 },
        };
      }

      setUploadedData(parsed);
      onDataUploaded?.(parsed);

      clearInterval(tick);
      setUploadProgress(100);

      toast({
        title: 'Upload complete',
        description: `${backend.name} stored on server. (${backend.row_count} rows)`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: err?.message || 'Something went wrong while uploading the file.',
      });
      setIsUploading(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* FILE TYPE & OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-left">
          <Label>File Type</Label>
          <Select value={fileType} onValueChange={(v: any) => setFileType(v as FileType)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel (.xlsx, .xls)</SelectItem>
              <SelectItem value="parquet">Parquet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {fileType === 'csv' && (
          <div className="text-left">
            <Label>Delimiter</Label>
            <Select
              value={delimiterChoice}
              onValueChange={(v: any) => setDelimiterChoice(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delimiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comma">Comma (,)</SelectItem>
                <SelectItem value="tab">Tab (\t)</SelectItem>
                <SelectItem value="space">Space ( )</SelectItem>
                <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                <SelectItem value="colon">Colon (:)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {fileType === 'excel' && (
          <div className="text-left">
            <Label htmlFor="sheet">Sheet Name</Label>
            <Input
              id="sheet"
              value={xlsxSheet}
              onChange={(e) => setXlsxSheet(e.target.value)}
              placeholder="Leave empty for first sheet"
            />
          </div>
        )}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Data Inception
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={[
              'relative rounded-2xl border-2 border-dashed p-10 transition-all duration-200',
              isDragging ? 'border-accent bg-accent/5' : 'border-muted-foreground/25 hover:border-accent',
              'flex flex-col items-center justify-center text-center',
            ].join(' ')}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              {getFileIcon((uploadedFile?.name || '').split('.').pop()?.toLowerCase() || '')}
              <div className="text-left">
                <p className="font-medium">
                  {uploadedFile ? uploadedFile.name : 'Drag & drop your file here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Accepts .csv, .xlsx, .xls, .parquet
                </p>
              </div>
            </div>

            {!uploadedFile ? (
              <Button
                type="button"
                variant="accent"
                className="px-6"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="accent"
                  className="px-6"
                  disabled={isUploading}
                  onClick={() => processUpload(uploadedFile)}
                >
                  Upload
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="px-6"
                  onClick={resetState}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls,.txt,.parquet"
              onChange={handleFilePick}
            />
          </div>

          {/* Progress */}
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Backend info */}
          {backendInfo && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Backend Upload:</strong> Stored file as{' '}
                <code>{backendInfo.path}</code> with {backendInfo.row_count} rows and{' '}
                {backendInfo.columns?.length ?? 0} columns.
              </AlertDescription>
            </Alert>
          )}

          {/* Local quick analysis */}
          {uploadedData && (
            <Alert className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Local Preview:</strong> {uploadedData.rowCount} rows detected.{' '}
                Columns: {uploadedData.columns.slice(0, 6).join(', ')}
                {uploadedData.columns.length > 6 ? '…' : ''}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
