-- Create banking-documents storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banking-documents',
  'banking-documents',
  false,
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg']
);

-- Create RLS policies for banking-documents bucket

-- Users can upload their own documents (in their user_id folder)
CREATE POLICY "Users can upload their own banking documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banking-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own documents
CREATE POLICY "Users can view their own banking documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'banking-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own documents
CREATE POLICY "Users can update their own banking documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banking-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own documents
CREATE POLICY "Users can delete their own banking documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'banking-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);