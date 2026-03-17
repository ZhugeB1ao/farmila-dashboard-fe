import { supabase } from "./client";

export const uploadProfileImage = async (file: File, employeeId: string) => {
  const folderPath = `avatars/${employeeId}`;
  
  // 1. List existing files in the folder
  const { data: existingFiles, error: listError } = await supabase.storage
    .from('avatars')
    .list(employeeId);

  if (listError) {
    console.error("Error listing existing avatars:", listError);
  }

  // 2. Delete existing files if any
  if (existingFiles && existingFiles.length > 0) {
    const filesToDelete = existingFiles.map(f => `${employeeId}/${f.name}`);
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove(filesToDelete);
    
    if (deleteError) {
      console.error("Error deleting old avatars:", deleteError);
    }
  }

  // 3. Upload new file
  const fileExt = file.name.split('.').pop();
  const filePath = `${folderPath}/image.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true
    });

  if (uploadError) {
    throw uploadError;
  }

  // 4. Get public URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

