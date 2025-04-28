import React, { useState, useEffect } from "react";
import { Search, Droplet, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import BloodGroupSelector, { BloodGroup, Donor } from "../Components/BloodGroupSelector";
import DonorCard from "../Components/DonorCard";
import Navbar from "../Components/Navbar";
import { apiClient } from "../Components/Axios";

export interface SearchParams {
  bloodGroup: BloodGroup | "";
  location: string;
  pincode: string
}

const FindBloodPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    bloodGroup: "",
    location: "",
    pincode: "",
  });

  const [donors, setDonors] = useState<Donor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (hasSearched) {
      fetchDonors();
    }
  }, [page]);

  const fetchDonors = async () => {
    setIsSearching(true);
    try {
      const params: any = {
        page,
        limit: 6, // You can change page size here
        bloodGroup: searchParams.bloodGroup || undefined,
      };

      if (searchParams.location) {
        params.place = searchParams.location;
      }
      if (searchParams.pincode) {
        params.pincode = searchParams.pincode;
      }

      const response = await apiClient.get("/api/donors", { params });
      

      setDonors(response.data.donors);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      console.error(error);
      alert("Failed to fetch donors.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // reset to first page
    setHasSearched(true);
    fetchDonors();
  };

  const handleBloodGroupChange = (value: BloodGroup | "") => {
    setSearchParams((prev) => ({ ...prev, bloodGroup: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({ ...prev, location: e.target.value }));
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({ ...prev, pincode: e.target.value }));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-green-800">Find Blood Donors</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Blood Group */}
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group
                </label>
                <BloodGroupSelector
                  value={searchParams.bloodGroup}
                  onChange={handleBloodGroupChange}
                  includeEmpty
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  City / State
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
                    placeholder="City or State"
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  value={searchParams.pincode}
                  onChange={handlePincodeChange}
                  placeholder="Enter Pincode"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Search Button */}
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
                    ? "No donors found matching your criteria."
                    : `Found ${donors.length} donor${donors.length === 1 ? "" : "s"}.`}
                </p>
              </div>
            )}
          </div>

          {/* Donor Results */}
          {hasSearched && !isSearching && donors.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor, index) => (
                  <DonorCard key={index} donor={donor} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" /> Previous
                </button>
                <span className="text-gray-700 font-medium">{page} / {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Next <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            </>
          )}

          {/* No donors found */}
          {hasSearched && !isSearching && donors.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-4">
                <Droplet className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Donors Found</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Try different blood group, location, or pincode.
              </p>
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <Droplet className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-green-800 mb-2">Blood Donation Saves Lives</h2>
                <p className="text-gray-700 max-w-2xl mx-auto">
                  Use the search form above to find blood donors in your area.
                </p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                  {["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"].map((group) => (
                    <div
                      key={group}
                      className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center"
                    >
                      <span className="text-xl font-bold text-red-600">{group}</span>
                      <span className="text-xs text-gray-500">Blood Group</span>
                    </div>
                  ))}
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
