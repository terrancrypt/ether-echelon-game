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