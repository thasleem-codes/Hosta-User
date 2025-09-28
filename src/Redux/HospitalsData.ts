import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConsultingSchedule {
  day: string;
  start_time: string;
  end_time: string;
}

export interface Doctor {
  _id?: string;
  name: string;
  consulting: ConsultingSchedule[];
  qualification: string;
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
  user_id: string;
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
    updateDoctorConsulting: (
      state,
      action: PayloadAction<{
        hospitalId: string;
        specialtyId: string;
        doctorId: string;
        consulting: ConsultingSchedule[];
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

    // Add a new schedule to a doctor
    addConsultingSchedule: (
      state,
      action: PayloadAction<{
        hospitalId: string;
        specialtyId: string;
        doctorId: string;
        schedule: ConsultingSchedule;
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
