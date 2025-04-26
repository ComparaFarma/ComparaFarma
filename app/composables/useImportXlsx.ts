import readXlsxFile from "read-excel-file";

export const useImportXlsx = () => {
  const { $i18n } = useNuxtApp()

  const importXlsx = async (file: File) => {
    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      throw new Error($i18n.t("text.composables.importXlsx.invalidFileType"));
    }
    // Read the file
    const rows = await readXlsxFile(file, { sheet: 1 });

    return rows;
  };

  return {
    importXlsx,
  };
};
