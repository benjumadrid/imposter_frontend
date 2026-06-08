// src/components/UserCard.jsx
export default function UserCard() {
  return (
    <div className="max-w-sm mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex items-center px-6 py-4">
        <img
          className="w-13 h-13 object-cover rounded-full"
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="User avatar"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-semibold text-gray-800">Benju Habtamu</h2>
          <p className="text-gray-600 text-sm">Frontend Developer</p>
          <span className="inline-block mt-2 px-8 py-1 text-xs text-white bg-green-500 rounded-full">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
