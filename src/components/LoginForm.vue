<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import { useApiStore } from '@/stores/api'
import StandardButton from '@/components/Shared/StandardButton.vue'

// form fields
const email = ref('')
const password = ref('')

// error handling
const showError = ref(false)

// stores
const loadingStore = useLoadingStore()
loadingStore.show = false
// router
const router = useRouter()

async function submitLogin() {
  loadingStore.show = true

  const payload = {
    email: email.value,
    password: password.value
  }

  await useApiStore()
    .post(true, 'auth/login', payload, false)
    .then(async (res) => {
      localStorage.setItem('token', Object(res).access_token)
      showError.value = false
      loadingStore.show = false
      router.push({
        name: 'stationSelector'
      })
    })
    .catch((err) => {
      loadingStore.show = false
      showError.value = true
    })
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center my-auto h-screen m-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="text-center">Sign in to your account</h2>
      <form class="space-y-3 mt-10" @submit.prevent="submitLogin">
        <div>
          <label for="email">Email address</label>
          <div class="mt-2">
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required="true"
              class="block w-full"
            />
          </div>
        </div>

        <div>
          <label for="password">Password</label>
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required="true"
              class="block w-full"
            />
          </div>
        </div>

        <div>
          <StandardButton
            type="submit"
            text="Login"
            class="w-full mt-6 justify-center btn-primary"
          />
        </div>

        <div v-if="showError">
          <p class="text-sm text-danger">Wrong credentials or account does not exist</p>
        </div>
      </form>

      <p class="mt-10 text-center text-sm">
        <span>Forgot password?</span>
        {{ ' ' }}
        <a href="https://eventyay.com/reset-password" class="font-medium leading-6 text-primary"
          >Click here to reset password</a
        >
      </p>
    </div>
  </div>
</template>
