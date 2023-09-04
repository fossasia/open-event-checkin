import { useApiStore } from '@/stores/api'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userDetails = ref(null)

  async function getUserId() {
    try {
      const res = await useApiStore().get(true, `users/user-details/get-user-id`)
      return res.user_id
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function getUserDetails(userId) {
    try {
      let id = ''
      if (userId === undefined) {
        id = await getUserId()
      } else {
        id = userId
      }

      const res = await useApiStore().get(true, `users/${id}`)
      userDetails.value = res.data
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const userName = computed(() => {
    if (userDetails.value) {
      const firstName = userDetails.value.attributes['first-name']
      if (firstName !== null) {
        return firstName
      }
    }
    return ''
  })

  return { getUserId, getUserDetails, userName }
})
