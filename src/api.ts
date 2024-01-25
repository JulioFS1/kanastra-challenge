const SERVER_UPLOAD_ENDPOINT = 'http://localhost:3001/upload';

interface ServerResponse {
  message: string;
  file: File[];
}

const uploadFileToServer = async (file: File): Promise<ServerResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch(SERVER_UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file. Server returned ${response.status}`);
    }

    const responseData: ServerResponse = await response.json();
    console.log(responseData);

    return responseData;

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error uploading file: ${error.message}`);
    } else {
      throw new Error(`Unknown error occurred while uploading file`);
    }
  }
};

export { uploadFileToServer };
