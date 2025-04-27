import React, { useState, useEffect } from "react";
import { Search, Droplet, MapPin } from "lucide-react";
import BloodGroupSelector, { BloodGroup, Donor } from "../Components/BloodGroupSelector";
import DonorCard, { SearchParams } from "../Components/DonorCard";
import Navbar from "../Components/Navbar";

const FindBloodPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    bloodGroup: "",
    location: "",
  });

  const [donors, setDonors] = useState<Donor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Initialize sample data on first load
  useEffect(() => {
    // initializeSampleData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);

    // Simulate network delay for better UX
    setTimeout(() => {
    //   const results = filterDonors(------------------------------------------------------------(2)
    //     searchParams.bloodGroup,
    //     searchParams.location
    //   );
    //   setDonors(results);
      setIsSearching(false);
    }, 800);
  };

  const handleBloodGroupChange = (value: BloodGroup | "") => {
    setSearchParams((prev) => ({ ...prev, bloodGroup: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({ ...prev, location: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-green-800">
              Find Blood Donors
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Blood Group
                </label>
                <BloodGroupSelector
                  value={searchParams.bloodGroup}
                  onChange={handleBloodGroupChange}
                  includeEmpty
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City, State or Zip
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    value={searchParams.location}
                    onChange={handleLocationChange}
                    placeholder="Search by location"
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Find Donors
                    </>
                  )}
                </button>
              </div>
            </form>

            {hasSearched && !isSearching && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  {donors.length === 0
                    ? "No donors found matching your criteria. Try different search parameters."
                    : `Found ${donors.length} donor${
                        donors.length === 1 ? "" : "s"
                      } matching your search criteria.`}
                </p>
              </div>
            )}
          </div>

          {hasSearched && !isSearching && donors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          )}

          {hasSearched && !isSearching && donors.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-4">
                <Droplet className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Donors Found
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any donors matching your search criteria.
                Please try with different parameters or check back later.
              </p>
            </div>
          )}

          {!hasSearched && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <Droplet className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Blood Donation Saves Lives
                </h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  Use the search form above to find blood donors in your area.
                  You can search by blood group and location to find compatible
                  donors near you.
                </p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                  {["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"].map(
                    (group) => (
                      <div
                        key={group}
                        className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center"
                      >
                        <span className="text-xl font-bold text-red-600">
                          {group}
                        </span>
                        <span className="text-xs text-gray-500">
                          Blood Group
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FindBloodPage;
