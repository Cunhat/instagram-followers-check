import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type UploadFileProps = {
  setData: (data: { followers: any; following: any }) => void;
};

export default function UploadFile({ setData }: UploadFileProps) {
  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    const followers = acceptedFiles.find((file) =>
      file.webkitRelativePath.includes(
        "connections/followers_and_following/followers_1.json"
      )
    );

    const following = acceptedFiles.find((file) =>
      file.webkitRelativePath.includes(
        "connections/followers_and_following/following.json"
      )
    );

    if (!followers || !following) {
      console.error("Missing required files");
      return;
    }

    const readFileAsJson = async (file: File) => {
      return new Promise<any>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            resolve(json);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });
    };

    Promise.all([readFileAsJson(followers), readFileAsJson(following)])
      .then(([followersData, followingData]) => {
        setData({ followers: followersData, following: followingData });
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col justify-center items-center gap-4 border-2 border-dashed border-gray-300 p-4 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 transition-all duration-300  h-[200px]"
    >
      <input {...getInputProps({ directory: "", webkitdirectory: "" })} />
      <p className="text-sm text-gray-500 font-mono">
        Drag 'n' drop a folder here, or click to select a folder
      </p>
    </div>
  );
}
