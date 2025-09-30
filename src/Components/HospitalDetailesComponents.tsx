import { Calendar, Mail, MapPin, Phone, Send, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hospital, Review, updateHospitalData } from "../Redux/HospitalsData";
import { apiClient } from "./Axios";
import { useDispatch, useSelector } from "react-redux";

// Button for Information, Specialties, Hours, Location, Review
export const Button = ({
  activeTab,
  purpose,
  content,
  OnClick,
}: {
  activeTab?: string;
  purpose?: string;
  content?: string;
  OnClick?: any;
}) => {
  return (
    <button
      className={`px-4 py-2 font-medium whitespace-nowrap ${
        activeTab === purpose
          ? "text-green-600 border-b-2 border-green-600"
          : "text-green-500"
      }`}
      onClick={OnClick}
    >
      {content}
    </button>
  );
};

// Information window

interface InfoProps {
  hospital: Hospital;
}

export const Info: React.FC<InfoProps> = ({ hospital }) => {
  const ratingPercentage =
    hospital?.reviews.length > 0
      ? (hospital.reviews.reduce((sum, review) => sum + review.rating, 0) /
          (hospital.reviews.length * 5)) *
        100
      : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contact Info */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6 space-y-3 sm:space-y-0 text-green-700">
        {/* Address */}
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <MapPin className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-sm sm:text-base break-words">
            {hospital?.address}
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <Phone className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-sm sm:text-base">{hospital?.phone}</span>
        </div>

        {/* Email */}
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <Mail className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-sm sm:text-base break-words">
            {hospital?.email}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <Star className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-sm sm:text-base">
            {!ratingPercentage ? 0 : ((ratingPercentage / 100) * 5).toFixed(1)}{" "}
            out of 5 stars ({hospital?.reviews.length || 0} reviews)
          </span>
        </div>
      </div>

      {/* About Section */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-2">
          About Us
        </h3>
        <p className="text-green-600 text-sm sm:text-base leading-relaxed">
          {hospital?.about || "No description available."}
        </p>
      </div>
    </div>
  );
};

// Specialties window

interface SpecialtiesProps {
  hospital: Hospital;
}

export const Specialties: React.FC<SpecialtiesProps> = ({ hospital }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {hospital?.specialties.map((dept, index) => (
        <div
          key={index}
          className="flex flex-col justify-between border border-green-200 rounded-2xl p-4 bg-white shadow-sm hover:shadow-lg hover:bg-green-50 transition-all cursor-pointer"
          onClick={() =>
            navigate(
              `/services/doctors?hospitalId=${hospital?._id}&specialtyId=${dept._id}`
            )
          }
        >
          {/* Department Name */}
          <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2 truncate">
            {dept.name}
          </h3>

          {/* Department Info */}
          <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
            {dept.department_info}
          </p>
        </div>
      ))}
    </div>
  );
};

//Working Houres
export const convertTo12HourFormat = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
};

interface WorkingHoursProps {
  hospital: Hospital;
}

export const WorkingHours: React.FC<WorkingHoursProps> = ({ hospital }) => {
  return (
    <div className="space-y-2">
      {hospital.working_hours.map((day, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 border-b border-green-100 last:border-b-0"
        >
          <span className="font-medium text-green-700 flex items-center mb-1 sm:mb-0">
            <Calendar className="h-4 w-4 mr-2" />
            {day.day}
          </span>
          <span className="text-green-600 text-sm sm:text-base">
            {day.is_holiday
              ? "Holiday"
              : `${convertTo12HourFormat(
                  day.opening_time
                )} - ${convertTo12HourFormat(day.closing_time)}`}
          </span>
        </div>
      ))}
    </div>
  );
};

// import React from "react";
// import { Edit2, ChevronDown, ChevronUp } from "lucide-react";

// import { ReviewButton, Textarea } from "./Common";
// import { RootState } from "../Redux/Store";
// import { ISTTime } from "./IndianTime";

// export const ReviewComponent = ({ hospital }: { hospital: Hospital }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { _id } = useSelector((state: RootState) => state.userLogin);

//   const [newReview, setNewReview] = useState<
//     Omit<Review, "_id" | "user_id" | "date">
//   >({
//     rating: 0,
//     comment: "",
//   });
//   const [editingReview, setEditingReview] = useState<string | null>(null);
//   const [showAllReviews, setShowAllReviews] = useState(false);

//   // Handle Review Submit
//   const handleReviewSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!_id) {
//       navigate("/login");
//       return;
//     }
//     try {
//       const result = await apiClient.post(`/api/reviews/${hospital._id}`, {
//         user_id: _id,
//         rating: newReview.rating,
//         comment: newReview.comment,
//         date: ISTTime(),
//       });
//       dispatch(updateHospitalData({ data: result.data.data }));
//       setNewReview({ rating: 0, comment: "" });
//     } catch (err) {
//       console.error("Error submitting review:", err);
//     }
//   };

//   // Handle Review Update
//   const handleReviewUpdate = async (reviewId: string) => {
//     if (!reviewId) return;
//     try {
//       const result = await apiClient.put(
//         `/api/reviews/${hospital._id}/${reviewId}`,
//         {
//           rating: newReview.rating,
//           comment: newReview.comment,
//         }
//       );
//       console.log("Review updated successfully:", result);
//       dispatch(updateHospitalData({ data: result.data.data }));
//       setEditingReview(null);
//       setNewReview({ rating: 0, comment: "" });
//     } catch (err) {
//       console.error("Error updating review:", err);
//     }
//   };

//   const startEditing = (review: Review) => {
//     setEditingReview(review._id as string);
//     setNewReview({ rating: review.rating, comment: review.comment });
//   };

//   const displayedReviews = showAllReviews
//     ? hospital.reviews
//     : hospital.reviews.slice(0, 2);

//   return (
//     <div className="space-y-6">
//       <h3 className="text-xl font-semibold text-green-700">Reviews</h3>

//       {/* Review Form */}
//       <form
//         onSubmit={handleReviewSubmit}
//         className="space-y-4 bg-green-50 p-4 rounded-lg"
//       >
//         <h4 className="text-lg font-medium text-green-700">Write a Review</h4>

//         {/* Rating */}
//         <div>
//           <label className="block text-sm font-medium text-green-700 mb-1">
//             Rating
//           </label>
//           <div className="flex">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Star
//                 key={star}
//                 className={`h-6 w-6 cursor-pointer ${
//                   star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
//                 }`}
//                 onClick={() => setNewReview({ ...newReview, rating: star })}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Comment */}
//         <div>
//           <label
//             htmlFor="comment"
//             className="block text-sm font-medium text-green-700 mb-1"
//           >
//             Comment
//           </label>
//           <Textarea
//             id="comment"
//             value={newReview.comment}
//             onChange={(e) =>
//               setNewReview({ ...newReview, comment: e.target.value })
//             }
//             required
//             rows={3}
//             className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//         </div>

//         <ReviewButton
//           type="submit"
//           className="flex items-center justify-center"
//         >
//           Submit Review
//           <Send className="ml-2 h-4 w-4" />
//         </ReviewButton>
//       </form>

//       {/* Review List */}
//       <div className="space-y-4">
//         {displayedReviews.map((review) => (
//           <div key={review._id} className="border-b border-green-100 pb-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-medium text-green-700">
//                 {review.user_id._id == _id
//                   ? "You"
//                   : review.user_id.name || "Anonymous User"}
//               </span>
//               <span className="text-sm text-green-600">
//                 {new Date(review.date).toLocaleDateString()}
//               </span>
//             </div>

//             {/* Stars */}
//             <div className="flex items-center mb-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   className={`h-4 w-4 ${
//                     star <= review.rating ? "text-yellow-400" : "text-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>

//             {/* Comment or Edit Mode */}
//             {editingReview === review._id ? (
//               <div className="space-y-2">
//                 <div className="flex">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={`h-6 w-6 cursor-pointer ${
//                         star <= newReview.rating
//                           ? "text-yellow-400"
//                           : "text-gray-300"
//                       }`}
//                       onClick={() =>
//                         setNewReview({ ...newReview, rating: star })
//                       }
//                     />
//                   ))}
//                 </div>
//                 <Textarea
//                   value={newReview.comment}
//                   onChange={(e) =>
//                     setNewReview({ ...newReview, comment: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//                 <div className="flex space-x-2">
//                   <ReviewButton
//                     onClick={() => handleReviewUpdate(review._id as string)}
//                     className="flex items-center"
//                   >
//                     Update
//                     <Send className="ml-2 h-4 w-4" />
//                   </ReviewButton>
//                   <ReviewButton
//                     onClick={() => setEditingReview(null)}
//                     variant="outline"
//                   >
//                     Cancel
//                   </ReviewButton>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex justify-between items-start">
//                 <p className="text-green-600">{review.comment}</p>
//                 {review.user_id._id === _id && (
//                   <ReviewButton
//                     onClick={() => startEditing(review)}
//                     variant="ghost"
//                     size="sm"
//                   >
//                     <Edit2 className="h-4 w-4" />
//                   </ReviewButton>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Show More / Less */}
//       {hospital.reviews.length > 2 && (
//         <ReviewButton
//           onClick={() => setShowAllReviews(!showAllReviews)}
//           variant="outline"
//           className="w-full flex items-center justify-center"
//         >
//           {showAllReviews ? (
//             <>
//               Show Less <ChevronUp className="ml-2 h-4 w-4" />
//             </>
//           ) : (
//             <>
//               Show More <ChevronDown className="ml-2 h-4 w-4" />
//             </>
//           )}
//         </ReviewButton>
//       )}
//     </div>
//   );
// };





import { Edit2, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { ReviewButton, Textarea } from "./Common";
import { RootState } from "../Redux/Store";
import { ISTTime } from "./IndianTime";

export const ReviewComponent = ({ hospital }: { hospital: Hospital }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state: RootState) => state.userLogin);

  const [newReview, setNewReview] = useState<Omit<Review, "_id" | "user_id" | "date">>({
    rating: 0,
    comment: "",
  });
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Submit a new review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!_id) {
      navigate("/login");
      return;
    }
    try {
      const result = await apiClient.post(`/api/reviews/${hospital._id}`, {
        user_id: _id,
        rating: newReview.rating,
        comment: newReview.comment,
        date: ISTTime(),
      });
      dispatch(updateHospitalData({ data: result.data.data }));
      setNewReview({ rating: 0, comment: "" });
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  // Update an existing review
  const handleReviewUpdate = async (reviewId: string) => {
    if (!reviewId) return;
    try {
      const result = await apiClient.put(`/api/reviews/${hospital._id}/${reviewId}`, {
        rating: newReview.rating,
        comment: newReview.comment,
      });
      dispatch(updateHospitalData({ data: result.data.data }));
      setEditingReview(null);
      setNewReview({ rating: 0, comment: "" });
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  // Delete a review
  const handleReviewDelete = async (reviewId: string) => {
    try {
      const result = await apiClient.delete(`/api/reviews/${hospital._id}/${reviewId}`);
      dispatch(updateHospitalData({ data: result.data.data }));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const startEditing = (review: Review) => {
    setEditingReview(review._id as string);
    setNewReview({ rating: review.rating, comment: review.comment });
  };

  const displayedReviews = showAllReviews ? hospital.reviews : hospital.reviews.slice(0, 2);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-green-700">Reviews</h3>

      {/* Show form only if not editing */}
      {!editingReview && (
        <form onSubmit={handleReviewSubmit} className="space-y-4 bg-green-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-green-700">Write a Review</h4>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-green-700 mb-1">
              Comment
            </label>
            <Textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
              rows={3}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <ReviewButton type="submit" className="flex items-center justify-center">
            Submit Review
            <Send className="ml-2 h-4 w-4" />
          </ReviewButton>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review._id} className="border-b border-green-100 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-green-700">
                {review.user_id._id === _id ? "You" : review.user_id.name || "Anonymous User"}
              </span>
              <span className="text-sm text-green-600">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>

            {/* Comment or Edit Mode */}
            {editingReview === review._id ? (
              <div className="space-y-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex space-x-2">
                  <ReviewButton onClick={() => handleReviewUpdate(review._id as string)} className="flex items-center">
                    Update
                    <Send className="ml-2 h-4 w-4" />
                  </ReviewButton>
                  <ReviewButton onClick={() => setEditingReview(null)} variant="outline">
                    Cancel
                  </ReviewButton>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <p className="text-green-600">{review.comment}</p>
                {review.user_id._id === _id && (
                  <div className="flex space-x-2">
                    <ReviewButton onClick={() => startEditing(review)} variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </ReviewButton>
                    <ReviewButton
                      onClick={() => handleReviewDelete(review._id as string)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </ReviewButton>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show More / Less */}
      {hospital.reviews.length > 2 && (
        <ReviewButton
          onClick={() => setShowAllReviews(!showAllReviews)}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          {showAllReviews ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </ReviewButton>
      )}
    </div>
  );
};
