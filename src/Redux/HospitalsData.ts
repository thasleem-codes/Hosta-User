import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface ConsultingSchedule {
//   day: string;
//   start_time: string;
//   end_time: string;
// }

// export interface Doctor {
//   _id?: string;
//   name: string;
//   consulting: ConsultingSchedule[];
//   qualification: string;
// }

// Each session inside a day
export interface Session {
  start_time: string;
  end_time: string;
  _id?: string;
}

// Each day with multiple sessions
export interface ConsultingDay {
  day: string;
  sessions: Session[];
  _id?: string;
}

// Doctor structure
export interface Doctor {
  _id?: string;
  name: string;
  qualification: string;
  consulting: ConsultingDay[]; // 👈 updated here
}

// Doctor with hospital schedules
export interface DoctorWithHospitalSchedules extends Doctor {
  specialty: string;
  hospitalSchedules: {
    hospitalId: string;
    hospitalName: string;
    address: string;
    phone: string;
    consulting: ConsultingDay[]; // 👈 updated here
  }[];
}

export interface Specialty {
  name: string;
  _id?: string;
  description: string;
  department_info: string;
  phone: string;
  doctors: Doctor[];
}

export interface Review {
  _id?: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  date: string;
}

export interface WorkingHours {
  day: string;
  opening_time: string;
  closing_time: string;
  is_holiday: boolean;
}

export interface Booking {
  user_name: string;
  mobile: string;
  email: string;
  specialty: string;
  doctor_name: string;
  booking_date: string;
  booking_time: string;
  status: "pending" | "accepted" | "declined";
}

export interface Hospital {
  _id?: string;
  name: string;
  type: string;
  address: string;
  password: string;
  phone: string;
  email: string;
  emergencyContact?: string;
  image: { imageUrl: string; public_id: string };
  latitude?: number;
  longitude?: number;
  about?: string;
  working_hours: WorkingHours[];
  reviews: Review[];
  specialties: Specialty[];
  booking: Booking[];
}

export interface HospitalState {
  hospitals: Hospital[];
}

const initialState: HospitalState = {
  hospitals: [],
};

const hospitalSlice = createSlice({
  name: "hospital",
  initialState,
  reducers: {
    // Replace hospitals
    setHospitalData: (state, action: PayloadAction<{ data: Hospital[] }>) => {
      state.hospitals = action.payload.data;
    },

    // Update one hospital
    updateHospitalData: (state, action: PayloadAction<{ data: Hospital }>) => {
      const index = state.hospitals.findIndex(
        (hospital) => hospital._id === action.payload.data._id
      );
      if (index !== -1) {
        state.hospitals[index] = action.payload.data;
      }
    },

    // Add or update consulting schedule for a doctor
    // Update doctor consulting (replace full consulting schedule)
    updateDoctorConsulting: (
      state,
      action: PayloadAction<{
        hospitalId: string;
        specialtyId: string;
        doctorId: string;
        consulting: ConsultingDay[]; // 👈 changed
      }>
    ) => {
      const { hospitalId, specialtyId, doctorId, consulting } = action.payload;
      const hospital = state.hospitals.find((h) => h._id === hospitalId);
      if (!hospital) return;

      const specialty = hospital.specialties.find((s) => s._id === specialtyId);
      if (!specialty) return;

      const doctor = specialty.doctors.find((d) => d._id === doctorId);
      if (!doctor) return;

      doctor.consulting = consulting;
    },

    // Add a new day (with sessions)
    addConsultingSchedule: (
      state,
      action: PayloadAction<{
        hospitalId: string;
        specialtyId: string;
        doctorId: string;
        schedule: ConsultingDay; // 👈 changed
      }>
    ) => {
      const { hospitalId, specialtyId, doctorId, schedule } = action.payload;
      const hospital = state.hospitals.find((h) => h._id === hospitalId);
      if (!hospital) return;

      const specialty = hospital.specialties.find((s) => s._id === specialtyId);
      if (!specialty) return;

      const doctor = specialty.doctors.find((d) => d._id === doctorId);
      if (!doctor) return;

      doctor.consulting.push(schedule);
    },

    // Remove a specific schedule
    removeConsultingSchedule: (
      state,
      action: PayloadAction<{
        hospitalId: string;
        specialtyId: string;
        doctorId: string;
        index: number;
      }>
    ) => {
      const { hospitalId, specialtyId, doctorId, index } = action.payload;
      const hospital = state.hospitals.find((h) => h._id === hospitalId);
      if (!hospital) return;

      const specialty = hospital.specialties.find((s) => s._id === specialtyId);
      if (!specialty) return;

      const doctor = specialty.doctors.find((d) => d._id === doctorId);
      if (!doctor) return;

      doctor.consulting.splice(index, 1);
    },
  },
});

export const {
  setHospitalData,
  updateHospitalData,
  updateDoctorConsulting,
  addConsultingSchedule,
  removeConsultingSchedule,
} = hospitalSlice.actions;

export default hospitalSlice.reducer;
