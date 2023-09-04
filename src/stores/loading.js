import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const contentLoadComplete = ref(false)
  const navbarLoadComplete = ref(false)

  function contentLoading() {
    contentLoadComplete.value = false
  }

  function contentLoaded() {
    contentLoadComplete.value = true
  }

  function navbarLoading() {
    navbarLoadComplete.value = false
  }

  function navbarLoaded() {
    navbarLoadComplete.value = true
  }

  const loading = computed(() => {
    if (contentLoadComplete.value === false || navbarLoadComplete.value === false) {
      return true
    } else {
      return false
    }
  })

  return {
    loading,
    contentLoadComplete,
    contentLoading,
    contentLoaded,
    navbarLoadComplete,
    navbarLoaded,
    navbarLoading
  }
})
