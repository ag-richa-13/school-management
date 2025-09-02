import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

type School = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contact?: string;
  email_id?: string;
  image?: string;
};

export default function ShowSchools() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [form, setForm] = useState<Partial<School>>({});

  useEffect(() => {
    fetchSchools();
  }, []);

  async function fetchSchools() {
    try {
      setLoading(true);
      const res = await fetch("/api/schools/get");
      const data: School[] = await res.json();
      if (Array.isArray(data)) setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSchool(id: string) {
    if (!confirm("Are you sure you want to delete this school?")) return;
    try {
      await fetch(`/api/schools/delete?id=${id}`, { method: "DELETE" });
      setSchools(schools.filter((school) => school.id !== id));
    } catch (error) {
      console.error("Error deleting school:", error);
    }
  }

  function startEdit(school: School) {
    setEditingSchool(school);
    setForm(school);
  }

  async function saveEdit() {
    if (!editingSchool) return;
    try {
      await fetch(`/api/schools/edit?id=${editingSchool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingSchool(null);
      fetchSchools();
    } catch (error) {
      console.error("Error updating school:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mr-3"></div>
        Loading schools...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button
        onClick={() => router.push("/")}
        className="mb-4 px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">
        🏫 Schools Directory
      </h1>

      {schools.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No schools found. Please add some!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {schools.map((school) => (
            <div
              key={school.id}
              className="border rounded-xl shadow-md bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition transform"
            >
              {school.image ? (
                <div className="relative w-full h-48">
                  <Image
                    src={school.image}
                    alt={school.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 w-full h-48 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800">
                  {school.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{school.address}</p>
                <p className="text-sm text-gray-600">
                  {school.city}, {school.state}
                </p>
                {school.contact && (
                  <p className="text-sm text-gray-600 mt-1">
                    📞 {school.contact}
                  </p>
                )}
                {school.email_id && (
                  <p className="text-sm text-blue-600 mt-1">
                    ✉️ {school.email_id}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center p-3 border-t bg-gray-50">
                <button
                  onClick={() => startEdit(school)}
                  className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSchool(school.id)}
                  className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-5">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
              Edit School
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["name", "address", "city", "state", "contact", "email_id"].map(
                (field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-gray-600 text-xs font-medium mb-1 capitalize">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type="text"
                      placeholder={field}
                      value={form[field as keyof School] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-black placeholder-gray-500 focus:ring-1 focus:ring-blue-300"
                    />
                  </div>
                )
              )}
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setEditingSchool(null)}
                className="px-4 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-shadow shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-1 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
