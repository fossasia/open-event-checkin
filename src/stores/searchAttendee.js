import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchAttendeeStore = defineStore('searchAttendee', () => {
  const people = [
    {
      id: 1,
      name: 'Wei Tat Chung',
      email: 'wtc@email.com',
      checkedIn: ref(false),
      info: {
        role: 'Chairperson',
        memberType: 'Organiser',
        organisation: 'SUSS AI-IG'
      }
    },
    {
      id: 2,
      name: 'Don Chia',
      email: 'wtc@email.com',
      checkedIn: ref(false),
      info: {
        role: 'Chairperson',
        memberType: 'Organiser',
        organisation: 'SUSS AI-IG'
      }
    },
    {
      id: 3,
      name: 'Shaun Ming Laclemence',
      email: 'wtc@email.com',
      checkedIn: ref(false),
      info: {
        role: 'Chairperson',
        memberType: 'Organiser',
        organisation: 'SUSS AI-IG'
      }
    },
    {
      id: 4,
      name: 'Very very very very very very very very very very long name',
      email: 'wtc@email.com',
      checkedIn: ref(false),
      info: {
        role: 'Chairperson',
        memberType: 'Organiser',
        organisation: 'SUSS AI-IG'
      }
    }
  ]

  const filterOptions = [
    {
      id: 'filterRole',
      name: 'Role',
      show: ref(false)
    },
    {
      id: 'filterMem',
      name: 'Member type',
      show: ref(false)
    },
    {
      id: 'filterOrg',
      name: 'Organisation',
      show: ref(false)
    }
  ]

  return { people, filterOptions }
})
