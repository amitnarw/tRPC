import { useState } from "react";
import "./App.css";
import { trpc } from "./utils/trpc";

function App() {
  const [inputData, setInputData] = useState<{
    id: null | number;
    name: string;
    email: string;
  }>({
    id: null,
    name: "",
    email: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    success: string | null;
    error: string | null;
  }>({
    success: "",
    error: "",
  });

  const [searchData, setSearchData] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const handleSearchUser = async () => {
    setStatus({
      success: "",
      error: "",
    });
    setSearchData(null);
    try {
      setIsLoading(true);

      let type: "id" | "name" | "email";
      let value: string | number;

      if (inputData?.id) {
        type = "id";
        value = inputData?.id;
      } else if (inputData?.name) {
        type = "name";
        value = inputData?.name;
      } else {
        type = "email";
        value = inputData?.email;
      }
      const result = await trpc.getUser.query({
        type,
        value,
      });
      if (result?.data?.id) {
        setSearchData({
          id: Number(result?.data?.id),
          name: result?.data?.name || "",
          email: result?.data?.email || "",
        });
      } else {
        setStatus({ success: null, error: "User not found" });
      }
    } catch (err) {
      if (err instanceof Error) {
        setStatus({ success: null, error: err?.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    setStatus({
      success: "",
      error: "",
    });
    setSearchData(null);
    try {
      setIsSaving(true);
      const result = await trpc.createUser.mutate({
        name: inputData?.name,
        email: inputData?.email,
      });
      setStatus({ success: result?.data?.id?.toString(), error: null });
    } catch (err) {
      if (err instanceof Error) {
        setStatus({ success: null, error: err?.message });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="h-screen w-full px-20">
      <div className="flex flex-col items-center gap-2">
        <h2>Find user with:</h2>
        <div>
          <p>Id</p>
          <input
            type="number"
            value={inputData?.id || undefined}
            onChange={(e) =>
              setInputData((prevData) => ({
                ...prevData,
                id: Number(e.target.value),
              }))
            }
            className="rounded-md border-0 outline-none bg-gray-100 p-1 px-2"
          ></input>
        </div>
        <div>
          <p>Name</p>
          <input
            type="text"
            value={inputData?.name}
            onChange={(e) =>
              setInputData((prevData) => ({
                ...prevData,
                name: e.target.value,
              }))
            }
            className="rounded-md border-0 outline-none bg-gray-100 p-1 px-2"
          ></input>
        </div>
        <div>
          <p>Email</p>
          <input
            type="email"
            value={inputData?.email}
            onChange={(e) =>
              setInputData((prevData) => ({
                ...prevData,
                email: e.target.value,
              }))
            }
            className="rounded-md border-0 outline-none bg-gray-100 p-1 px-2"
          ></input>
        </div>
        {isSaving ? (
          <p>Adding ...</p>
        ) : (
          <div className="flex flex-row gap-2 mt-2">
            <button
              onClick={handleSearchUser}
              className="border rounded-lg px-4 py-2 text-md cursor-pointer hover:bg-black hover:text-white duration-300"
            >
              Search User
            </button>
            <button
              onClick={handleAddUser}
              className="border rounded-lg px-4 py-2 text-md cursor-pointer hover:bg-black hover:text-white duration-300"
            >
              Add User
            </button>
          </div>
        )}

        {isLoading ? (
          <p>Searching ...</p>
        ) : searchData?.id && searchData?.name && searchData?.email ? (
          <p className="flex flex-col gap-2">
            <span>ID: {searchData?.id}</span>
            <span>Name: {searchData?.name}</span>
            <span>Email: {searchData?.email}</span>
          </p>
        ) : null}
        {status?.error ? (
          <p className="text-red-400">{status?.error}</p>
        ) : status?.success ? (
          <p className="text-green-400">{status?.success}</p>
        ) : null}
      </div>
    </main>
  );
}

export default App;
