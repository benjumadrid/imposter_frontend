export default function Card() {
  return (
    <div className="max-w-sm mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src="https://source.unsplash.com/featured/300x200"
        alt="Card Image"
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Beautiful Card</h2>
        <p className="text-gray-600 text-sm mb-4">
          This is a simple card built with Tailwind CSS in React. It's responsive, elegant, and fast to build.
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Learn More with \benju
        </button>
      </div>
    </div>
  );
}
