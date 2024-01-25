import { ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFileContext } from "@/context";

function FileList(): ReactElement {
  
  const { state: { fileList }} = useFileContext();
  
  if (!fileList) {
    return (
      <div>
        <p>No file information available.</p>
      </div>
    );
  }

  // Remember to keep the fileList updated after upload a new file

    return (
      <>
        <h1 className="text-2xl font-bold pt-5 text-green-800">File List</h1>

        <Table>
          <TableCaption>A list of your {`files`}.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nome do arquivo</TableHead>
              <TableHead>Tipo de arquivo</TableHead>
              <TableHead className="text-right">Tamanho</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {fileList.map((file: any) => (
            <TableRow key={file.originalname}>
              <TableCell className="font-medium">{file.originalname}</TableCell>
              <TableCell>{file.mimetype}</TableCell>
              <TableCell className="text-right">{file.size}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </>
    )
}

export { FileList };
