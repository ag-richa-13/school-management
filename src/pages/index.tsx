import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center transform transition duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          School Management System
        </h1>
        <p className="text-lg mb-8 text-gray-600">
          Effortlessly add and manage school details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/addSchool"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            ➕ Add School
          </Link>
          <Link
            href="/showSchools"
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            🏫 Show Schools
          </Link>
        </div>
      </div>
    </div>
  );
}
