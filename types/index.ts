export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  medicalHistory?: MedicalRecord[]
}

export interface Doctor {
  id: string
  name: string
  shortName?: string
  speciality: string
  avatar?: string
  rating: number
  reviewsCount: number
  experience: number
  price: number
  fee?: number
  about: string
  education: string[]
  availableSlots: TimeSlot[]
  isOnline: boolean
}

export interface TimeSlot {
  id: string
  date: string
  time: string
  isAvailable: boolean
}

export interface Appointment {
  id: string
  doctorId: string
  doctor: Doctor
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  type: 'online' | 'offline'
  notes?: string
}

export interface MedicalRecord {
  id: string
  date: string
  type: 'prescription' | 'diagnosis' | 'lab_result' | 'report'
  title: string
  description: string
  doctorName: string
  attachments?: string[]
}

export interface Pharmacy {
  id: string
  name: string
  address: string
  distance: number
  rating: number
  isOpen: boolean
  openHours: string
  phone: string
  deliveryAvailable: boolean
}

export interface Medicine {
  id: string
  name: string
  description: string
  price: number
  manufacturer: string
  category: string
  inStock: boolean
  image?: string
  requiresPrescription: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'appointment' | 'reminder' | 'system' | 'promotion'
  timestamp: string
  isRead: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
  type: 'text' | 'image' | 'voice' | 'video_call'
}

export interface Specialty {
  id: string
  name: string
  icon: string
  description: string
  doctorsCount: number
  emoji?: string
  bgColor?: string
}
