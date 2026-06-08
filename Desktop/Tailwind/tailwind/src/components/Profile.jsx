import { useState } from "react";

export default function Profile() {
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [otherCountry, setOtherCountry] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const genders = ["Male", "Female"];
  const ageChoices = ["Under 10", "25 - 50", "Above 50"];
  const statuses = ["Worker", "Student", "None"];
  const countries = ["Kenya", "America", "Other"];

  function handleSubmit(e) {
    e.preventDefault();
    const selectedCountry = country === "Other" ? otherCountry : country;
    setSubmittedData({
      gender,
      ageGroup,
      status,
      country: selectedCountry,
    });
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between p-6 gap-8">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-center text-[#E6007E]">
          📝 Personal Info
        </h2>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender:
          </label>
          <div className="flex items-center gap-6">
            {genders.map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={g}
                  onChange={(e) => setGender(e.target.value)}
                  className="accent-[#E6007E] cursor-pointer"
                />
                <span className="text-sm">{g}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Group:
          </label>
          <div className="space-y-2">
            {ageChoices.map((choice) => (
              <label key={choice} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={choice}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="accent-[#E6007E] cursor-pointer"
                />
                <span className="text-sm">{choice}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Status:
          </label>
          <div className="space-y-2">
            {statuses.map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={s}
                  onChange={(e) => setStatus(e.target.value)}
                  className="accent-[#E6007E] cursor-pointer"
                />
                <span className="text-sm">
                  {s === "Worker"
                    ? "👷 Worker"
                    : s === "Student"
                    ? "🎓 Student"
                    : "❌ None"}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country:
          </label>
          <div className="space-y-2">
            {countries.map((c) => (
              <label key={c} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={c}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (e.target.value !== "Other") setOtherCountry("");
                  }}
                  className="accent-[#E6007E] cursor-pointer"
                />
                <span className="text-sm">
                  {c === "Other" ? "🌍 Other" : c}
                </span>
              </label>
            ))}
            {country === "Other" && (
              <input
                type="text"
                placeholder="Enter your country"
                value={otherCountry}
                onChange={(e) => setOtherCountry(e.target.value)}
                className="mt-2 w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6007E]"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#E6007E] hover:bg-pink-700 text-white font-semibold py-2 rounded-lg"
        >
          Submit
        </button>
      </div>

      {/* Table Section */}
      {submittedData && (
        <div className="w-full lg:w-1/2 bg-white shadow-md rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-[#E6007E] mb-4">
            ✅ Submitted Info
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Gender</th>
                <th className="border px-4 py-2">Age</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Country</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">{submittedData.gender}</td>
                <td className="border px-4 py-2">{submittedData.ageGroup}</td>
                <td className="border px-4 py-2">{submittedData.status}</td>
                <td className="border px-4 py-2">{submittedData.country}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}