import { useFileContext } from "@/context";
import { ChangeEvent } from "react";
import { FileActionType } from "@/constants";
import { uploadFileToServer } from "@/api";

const SingleFileUploader = () => {
  const { state: { file }, dispatch } = useFileContext();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      // Update the file in the FileContext without using useState
      dispatch({ type: FileActionType.SET_UPLOAD_FILE, payload: selectedFile });
    }
  };

  const handleUpload = async () => {
    // Do your upload logic here. Remember to use the FileContext
    if (file) {
      try {
        const response = await uploadFileToServer(file);
        const processedData = response.file;
        dispatch({
          type: FileActionType.SET_FILE_LIST,
          payload: processedData,
        });
        console.log(`File uploaded successfully. ${response}`);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        //dispatch({ type: 'CLEAR_FILE' });
        console.log('End')
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="file" className="sr-only">
          Choose a file
        </label>
        <input
          id="file"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          onChange={handleFileChange}
        />
      </div>
      {file && (
        <section>
          <p className="pb-6">File details:</p>
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}

      {file && (
        <button
          className="rounded-lg bg-green-800 text-white px-4 py-2 border-none font-semibold"
          onClick={handleUpload}
        >
          Upload the file
        </button>
      )}
    </div>
  );
};

export { SingleFileUploader };
