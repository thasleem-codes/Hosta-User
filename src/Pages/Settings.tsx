import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorToast, successToast } from "../Components/Toastify";
import { ArrowLeft, Trash2, Edit2, Plus } from "lucide-react";
import { apiClient } from "../Components/Axios";
import { updateUserData } from "../Redux/userData";
import { RootState } from "../Redux/Store";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use Redux data if available
  const reduxUser = useSelector((state: RootState) => state.userLogin);
  const [user, setUser] = useState<any>(reduxUser || null);

  const [donor, setDonor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<{ name: string }>({
    name: "",
  });

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || "";

  /** Save edited name */
  const handleSave = async () => {
    try {
      const name = editableData.name.trim();
      if (!name) return errorToast("Name cannot be empty");

      const result = await apiClient.put(
        `/api/users/${user?._id}`,
        { name },
        { withCredentials: true }
      );

      successToast("Profile updated successfully");
      dispatch(updateUserData(result.data.user));
      setUser(result.data.user);
      setIsEditing(false);
    } catch (err: any) {
      errorToast(err.response?.data?.message || "Profile update failed");
    }
  };

  /** Delete donor record */
  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/api/donors/${id}`);
      setDonor(null);
      successToast("Donor deleted successfully");
    } catch (error) {
      console.error("Failed to delete donor", error);
    }
  };

  /** Fetch user and donor info only if Redux does not have it */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let userId = localStorage.getItem("userId");

        // Fetch user only if not in Redux state
        if (!user && userId) {
          const resUser = await apiClient.get(`/api/users/${userId}`);
          setUser(resUser.data.data);
        } else {
          userId = user?._id;
        }

        // Fetch donor info only if user exists
        if (userId) {
          try {
            const resDonor = await apiClient.get(`/api/donors/users/${userId}`);
            setDonor(resDonor.data);
          } catch {
            setDonor(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      {/* Go back */}
      <button
        onClick={() => navigate(-1)}
        className="p-2 bg-white text-green-600 rounded-full shadow hover:bg-green-100 transition-colors mb-5"
        aria-label="Go back"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <div className="max-w-md mx-auto">
        {/* Avatar */}
        <div className="relative flex justify-center mb-5">
          <div className="w-28 h-28 rounded-full bg-green-400 flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-3xl">
              {getInitial(user?.name)}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-5 relative transition-transform hover:scale-[1.02]">
          {!isEditing && (
            <button
              className="absolute top-4 right-4 bg-green-50 rounded-full p-2 shadow-md hover:bg-green-100 transition-colors"
              onClick={() => {
                setEditableData({ name: user?.name || "" });
                setIsEditing(true);
              }}
            >
              <Edit2 size={20} className="text-green-600" />
            </button>
          )}

          {isEditing ? (
            <input
              className="w-full p-3 border border-green-300 rounded-xl mb-3 focus:ring-2 focus:ring-green-500 outline-none"
              value={editableData.name}
              onChange={(e) => setEditableData({ name: e.target.value })}
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {user?.name}
            </h2>
          )}

          <p className="text-gray-600 mb-1 text-center">{user?.email}</p>
          <p className="text-gray-600 mb-1 text-center">{user?.phone}</p>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-center mb-5">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}

        {/* Blood Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 relative transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Blood Information
            </h3>
            <button
              className="flex items-center bg-green-50 p-2 rounded-full shadow hover:bg-green-100 transition-colors"
              onClick={() => {
                donor
                  ? handleDelete(donor._id)
                  : navigate("/services/blood-donation");
              }}
            >
              {donor ? (
                <Trash2 size={20} className="text-red-600" />
              ) : (
                <Plus size={20} className="text-green-600" />
              )}
            </button>
          </div>

          {donor ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Blood Group:</span>
                  <span className="font-semibold text-gray-800">
                    {donor?.bloodGroup}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Born:</span>
                  <span className="font-semibold text-gray-800">
                    {donor?.dateOfBirth
                      ? new Date(donor.dateOfBirth).toLocaleDateString("en-GB")
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Place:</span>
                  <span className="font-semibold text-gray-800">
                    {donor?.address.place}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pin code:</span>
                  <span className="font-semibold text-gray-800">
                    {donor?.address.pincode}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center">
              No blood info added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}