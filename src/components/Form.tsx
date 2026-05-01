import { useState } from "react";
import UploadIcon from "../../public/Page-1.svg";
import Background from "./Background";
import toast, { Toaster } from "react-hot-toast";

function Form() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [outputPath, setOutputPath] = useState<string>("");
  const [filename, setFilename] = useState<string | undefined>("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState("encryption");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!filePath || !password) return;
    setIsSubmitting(true);
    const promise =
      mode === "encryption"
        ? window.api.encryptFile({
            filePath,
            password,
            outputPath,
          })
        : window.api.decryptFile({
            filePath,
            password,
            outputPath,
          });

    try {
      await toast.promise(promise, {
        loading: `${mode === "encryption" ? "Encrypting" : "Decrypting"} Data...`,
        success: (data: string) =>
          `File successfuly ${mode === "encryption" ? "encrypted" : "decrypted"}.\n\n${mode === "encryption" ? "Encrypted" : "Decrypted"} file saved at: ${data}`,
        error: (err) => err?.message || String(err),
      });
    } catch (error) {
      console.error(`${error}`);
    } finally {
      setIsSubmitting(false);
    }

    setPassword("");
    setFilePath("");
    setOutputPath("");
    setFilename("");
  };

  return (
    <div className="w-full h-full min-h-dvh z-100 flex items-center justify-center max-w-310 mx-auto">
      <Toaster
        toastOptions={{
          className: "",
          duration: 5000,
          removeDelay: 1000,
        }}
        position="bottom-left"
      />
      <div className="flex items-center justify-between gap-50">
        <div className="mb-7 text-white">
          <h1 className="mb-2 text-3xl font-bold">
            File Encryption/Decryption
          </h1>
          <p className="mb-5">
            A simple application for encrypting and decrypting files using
            AES-256-GCM, with PBKDF2 as the key derivation function to make
            passwords resistant to brute-force and rainbow table attacks.
          </p>
        </div>
        <div
          className={`p-7 rounded-2xl bg-[rgba(255,255,255,1)] opacity-95 relative min-w-120 overflow-clip`}
        >
          <Background
            className="-bottom-60 opacity-30 "
            color="#0071CD"
            animationDuration="10s"
          />

          <form
            onSubmit={handleSubmit}
            className="flex items-stretch justify-center flex-col gap-5"
          >
            <div>
              <label htmlFor="mode">Mode</label>

              <select
                className={`border border-[rgba(0,0,0,0.5)] rounded-sm w-full p-2 mt-2`}
                name="mode"
                id="mode"
                onChange={(e) => setMode(e.target.value)}
                value={mode}
              >
                <option value="encryption">Encryption</option>
                <option value="decryption">Decryption</option>
              </select>
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                required
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`border border-[rgba(0,0,0,0.5)] rounded-sm w-full p-2 mt-2`}
                type="password"
              />
            </div>
            <div>
              <div className="min-h-30 relative rounded-sm cursor-pointer mt-2 flex items-stretch justify-center bg-[#007ECD] hover:bg-[#33b1ff] transition-all">
                <div className="w-full  text-white flex items-center gap-2 rounded-sm justify-center flex-col cursor-pointer">
                  <button
                    type="button"
                    onClick={async () => {
                      const path = await window.api.selectFile();
                      if (path) {
                        setFilename(path.split(/[/\\]/).pop());
                        setFilePath(path);
                        if (!outputPath) {
                          setOutputPath(path.replace(/[/\\][^/\\]+$/, ""));
                        }
                      }
                    }}
                    className="w-full h-full flex items-center justify-center flex-col gap-3 cursor-pointer"
                  >
                    {filePath ? (
                      <>{filename}</>
                    ) : (
                      <>
                        <img
                          className="w-10 h-10"
                          src={UploadIcon}
                          alt="Upload"
                        />
                        <p>Upload your file</p>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-stretch justify-center flex-col gap-3">
              <label>
                {mode === "encryption" ? "Encrypted" : "Decrypted"} file output
                folder
              </label>
              <div className="flex items-center justify-between gap-2">
                <input
                  className="border border-[rgba(0,0,0,0.5)] rounded-sm p-2 w-[70%]"
                  type="text"
                  value={outputPath}
                  onChange={(e) => setOutputPath(e.target.value)}
                  placeholder="Set output path"
                />
                <button
                  onClick={async () => {
                    const path = await window.api.selectFolder();
                    if (path) {
                      setOutputPath(path);
                    }
                  }}
                  type="button"
                  className="w-[30%] bg-[#007ECD] hover:bg-[#33b1ff] disabled:bg-[#003e64] disabled:cursor-not-allowed text-white p-2 rounded-sm cursor-pointer transition-all"
                >
                  Choose folder
                </button>
              </div>
            </div>
            <button
              disabled={isSubmitting}
              className="w-full bg-[#007ECD] hover:bg-[#33b1ff] disabled:bg-[#003e64] disabled:cursor-not-allowed text-white p-2 rounded-sm cursor-pointer transition-all"
            >
              {isSubmitting
                ? mode === "encryption"
                  ? "Encrypting data..."
                  : "Decrypting data..."
                : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
