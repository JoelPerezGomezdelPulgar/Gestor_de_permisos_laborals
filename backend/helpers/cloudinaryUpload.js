import multer from 'multer';

// Usamos almacenamiento en memoria para no guardar el archivo en disco
// Esto nos permite utilizar la memoria de RAM para guardar los archivos subidos con Multer para que se borren automáticamente después
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * Sube un buffer de imagen a Cloudinary usando el preset público (unsigned upload).
 * Útil cuando solo tenemos CLOUD_NAME y UPLOAD_PRESET en el backend.
 */
export async function uploadToCloudinary(fileBuffer, mimetype) {
    const cloudName = process.env.CLOUD_NAME;
    const uploadPreset = process.env.UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Faltan las variables CLOUD_NAME o UPLOAD_PRESET en el .env");
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // Convert buffer to Base64 data URI
    const base64Image = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;

    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en Cloudinary: ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();
    return data.secure_url;
}
