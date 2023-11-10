import axios from "axios";
import React, { useRef, useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  description: string;
}

const CreateAccountPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
  });

  const inputFile = useRef<HTMLInputElement>(null);

  const uploadFile = async (fileToUpload: File | null) => {
    try {
      if (!fileToUpload) return;

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file as any);
      formData.append("name", form.name);
      formData.append("description", "Ether Echelon Account");
      console.log(formData);

      const apiResponse = await axios.post("/api/files", formData);
      const imgHash = apiResponse.data;
      console.log("Image Hash:", imgHash);

      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    uploadFile(file);
  };

  return (
    <div className="container">
      <div className="mt-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Create Your New Account</h1>

          {/* Upload file */}
          <input
            type="file"
            id="file"
            ref={inputFile}
            onChange={handleChange}
            style={{ display: "none" }}
          />

          <button
            disabled={uploading}
            onClick={() => {
              inputFile.current?.click();
            }}
            className="w-[150px] bg-secondary text-light rounded-3xl py-2 px-4 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          {file && (
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="name">Username</label>
                <br />
                <input
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="border border-secondary rounded-md p-2 outline-none text-black"
                  id="name"
                  value={form.name}
                  placeholder="Name"
                />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <br />
                <textarea
                  className="border border-secondary rounded-md p-2 outline-none text-black"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description..."
                />
              </div>
              <button
                className="rounded-lg bg-secondary text-white w-auto p-4"
                type="submit"
              >
                Upload
              </button>
            </form>
          )}
        </div>

        {/* FAQ */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            What is Ether Echelon NFT Account?
          </h2>
          <p className="mt-4">
            By creating an NFT (ERC721) and storing it in your personal wallet,
            you can use this NFT account to log into Ether Echelon games. Each
            NFT Account has its own wallet address to store in-game items and
            currency. If you transfer this NFT to another personal wallet
            address, any items in the NFT Account will move with it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
