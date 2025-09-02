import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";

type FormData = {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image: FileList;
};

export default function AddSchool() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image") formData.append(key, data.image[0]);
      else formData.append(key, value as string);
    });

    const res = await fetch("/api/schools/add", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      reset();
    } else {
      const errorData = await res.json();
      alert(errorData.error || "Failed to add school");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Add a New School
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[
            { label: "Name", key: "name", required: true },
            { label: "Address", key: "address", required: true },
            { label: "City", key: "city", required: true },
            { label: "State", key: "state", required: true },
            { label: "Contact", key: "contact", required: false },
            { label: "Email", key: "email_id", required: false },
          ].map((field) => (
            <div key={field.key} className="flex flex-col">
              <label className="text-gray-700 font-medium text-sm mb-1">
                {field.label}
              </label>
              <input
                {...register(field.key as keyof FormData, {
                  required: field.required,
                  pattern: field.key === "email_id" ? /^\S+@\S+$/i : undefined,
                })}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-indigo-400 outline-none text-sm text-black placeholder-gray-500"
              />
              {errors[field.key as keyof FormData] && (
                <p className="text-red-500 text-xs mt-1">
                  {field.label} is required
                </p>
              )}
            </div>
          ))}

          <div className="flex flex-col sm:col-span-2">
            <label className="text-gray-700 font-medium text-sm mb-1">
              School Image
            </label>
            <input
              type="file"
              {...register("image", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 bg-gray-50 text-sm text-black placeholder-gray-500"
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">Image is required</p>
            )}
          </div>

          <div className="sm:col-span-2 flex justify-between mt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
            >
              ← Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-transform duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {success && (
          <p className="text-green-600 text-center font-medium mt-3">
            🎉 School added successfully!
          </p>
        )}
      </div>
    </div>
  );
}
