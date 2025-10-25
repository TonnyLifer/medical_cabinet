<template>
  <div class="bg-background-light font-display text-text-light">
    <div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div class="layout-container flex h-full grow flex-col">
        <div class="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-4xl flex-1">
        
            <!-- Progress Bar -->
            <div class="p-4 mb-6">
              <div class="w-full bg-neutral-light rounded-full h-2.5">
                <div class="bg-primary h-2.5 rounded-full" style="width: 100%"></div>
              </div>
            </div>

            <div class="flex flex-col gap-4 p-4">
              <!-- Header -->
              <div class="flex items-center justify-between">
                <h1 class="text-4xl font-black leading-tight tracking-[-0.033em]">Подтверждение записи</h1>
                <button class="text-text-light">
                  <Icon name="material-symbols:arrow-back" class="w-6 h-6" />
                </button>
              </div>
            </div>

                 <!-- Appointment Info -->
            <div class="bg-neutral-light/50 p-6 rounded-xl shadow-sm space-y-4">
                <div>
                    <p class="text-lg font-bold">{{ appointment.doctorName }}</p>
                    <p class="text-sm text-[#617c89]">{{ appointment.specialty }}</p>
                </div>
                <div class="border-t border-b border-gray-200 py-4 flex justify-between items-center">
                    <p class="font-medium">{{ appointment.service }}</p>
                    <span class="text-white font-bold bg-green-500 px-3 py-1 rounded-full text-sm">{{ appointment.price }} ₽</span>
                </div>
                <div>
                    <p class="text-base">{{ appointment.date }}</p>
                    <p class="text-sm text-[#617c89] flex items-center gap-1.5">
                    <Icon name="material-symbols:location-on" class="text-base" />
                    {{ appointment.location }}
                    </p>
                </div>
            </div>

                <!-- Form -->
            <div class="bg-neutral-light/50 p-6 rounded-xl shadow-sm space-y-4 mt-4">
                <!-- ФИО -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                    <label class="block text-sm font-medium text-[#111618] mb-1" for="lastname">Фамилия</label>
                    <div class="relative">
                        <input 
                        class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-3 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
                        id="lastname" 
                        name="lastname" 
                        placeholder="Иванов" 
                        type="text"
                        v-model="form.lastName"
                        />
                    </div>
                    </div>
                    <div>
                    <label class="block text-sm font-medium text-[#111618] mb-1" for="firstname">Имя</label>
                    <div class="relative">
                        <input 
                        class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-3 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
                        id="firstname" 
                        name="firstname" 
                        placeholder="Иван" 
                        type="text"
                        v-model="form.firstName"
                        />
                    </div>
                    </div>
                    <div>
                    <label class="block text-sm font-medium text-[#111618] mb-1" for="middlename">Отчество</label>
                    <div class="relative">
                        <input 
                        class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-3 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
                        id="middlename" 
                        name="middlename" 
                        placeholder="Иванович" 
                        type="text"
                        v-model="form.middleName"
                        />
                    </div>
                    </div>
                </div>

                <!-- Телефон -->
                <div>
                    <label class="block text-sm font-medium text-[#111618] mb-1" for="phone">Номер телефона</label>
                    <div class="relative">
                    <Icon name="material-symbols:call" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#617c89] w-5 h-5" />
                    <input 
                        class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-10 pr-3.5 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
                        id="phone" 
                        name="phone" 
                        placeholder="+7 (999) 999-99-99" 
                        type="tel"
                        v-model="form.phone"
                    />
                    </div>
                </div>

                <!-- Дата рождения -->
                <div>
                    <label class="block text-sm font-medium text-[#111618] mb-1" for="birthdate">Дата рождения</label>
                    <div class="relative">
                    <Icon name="material-symbols:calendar-today" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#617c89] w-5 h-5" />
                    <input 
                        class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-10 pr-3.5 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
                        id="birthdate" 
                        name="birthdate" 
                        type="date"
                        v-model="form.birthDate"
                    />
                    </div>
                </div>

                <!-- Email (дополнительно) -->
                <div>
                    <label class="block text-sm font-medium text-[#111618] mb-1" for="email">Email (необязательно)</label>
                    <div class="relative">
                    <Icon name="material-symbols:mail" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#617c89] w-5 h-5" />
                    <input 
                        class="w-full rounded-xl border-[#dbe2e6] bg-white/80 pl-10 pr-3.5 py-3.5 text-[#111618] focus:ring-primary focus:border-primary" 
                        id="email" 
                        name="email" 
                        placeholder="ivan@example.com" 
                        type="email"
                        v-model="form.email"
                    />
                    </div>
                </div>
            </div>

            <div class="pt-4">
                <button 
                class="w-full text-white bg-green-500 hover:bg-opacity-90 focus:ring-4 focus:ring-red-500/50 font-bold rounded-xl text-base px-8 py-4 text-center transition-colors" 
                type="submit"
                @click="confirmAppointment"
                >
                Подтвердить запись
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Подтверждение записи'
})

// Данные записи
const appointment = ref({
  doctorName: 'Иванов Иван Иванович',
  specialty: 'Терапевт',
  service: 'Первичный приём',
  price: '2 500',
  date: '25 октября 2024, 14:30',
  location: 'г. Вышний Волочек, ул. Красных печатников, д. 36'
})

// Форма
const form = ref({
  lastName: '',
  firstName: '',
  middleName: '',
  phone: '',
  birthDate: '',
  email: ''
})

// Подтверждение записи
const confirmAppointment = () => {
  console.log('Подтверждение записи:', { appointment: appointment.value, form: form.value })
  // Здесь будет логика подтверждения
}
</script>
