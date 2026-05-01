export {};

declare global {
  interface Window {
    api: {
      selectFile: () => string;
      selectFolder: () => string;
      encryptFile: (data: {
        filePath: string;
        password: string;
        outputPath: string;
      }) => Promise<string>;
      decryptFile: (data: {
        filePath: string;
        password: string;
        outputPath: string;
      }) => Promise<string>;
    };
  }
}