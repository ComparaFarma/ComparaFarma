import readXlsxFile from "read-excel-file";

export const useImportXlsx = () => {
  const importXlsx = async (file: File) => {
    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      throw new Error("Invalid file type. Please upload an Excel file.");
    }
    // Read the file
    const rows = await readXlsxFile(file, { sheet: 1 });

    return rows;
  };

  return {
    importXlsx,
  };
};
