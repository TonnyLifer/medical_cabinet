import { defineStore } from 'pinia'

interface BookingData {
  selectedCategory: string | null
  selectedSpecialty: string | null
  selectedDoctor: {
    id: string
    name: string
    specialty: string
    price: number
  } | null
  selectedDate: string | null
  selectedTime: string | null
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingData => ({
    selectedCategory: null,
    selectedSpecialty: null,
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null
  }),

  actions: {
    setSelectedCategory(category: string) {
      this.selectedCategory = category
    },

    setSelectedSpecialty(specialty: string) {
      this.selectedSpecialty = specialty
    },

    setSelectedDoctor(doctor: BookingData['selectedDoctor']) {
      this.selectedDoctor = doctor
    },

    setSelectedDate(date: string) {
      this.selectedDate = date
    },

    setSelectedTime(time: string) {
      this.selectedTime = time
    },

    clearBooking() {
      this.selectedCategory = null
      this.selectedSpecialty = null
      this.selectedDoctor = null
      this.selectedDate = null
      this.selectedTime = null
    }
  }
})
