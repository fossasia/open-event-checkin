<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import StandardButton from '@/components/Common/StandardButton.vue'

// stores
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const showError = ref(false)
const passwordFieldType = ref("password")
const toggleText = ref("Show")

// router
const router = useRouter()

function togglePasswordVisibility(){
  if (passwordFieldType.value==="password") {
    passwordFieldType.value = "text";
    toggleText.value = "Hide";
  }
  else {
    passwordFieldType.value = "password";
    toggleText.value = "Show";
  }
}

async function submitLogin() {
  loadingStore.contentLoading()
  showError.value = false

  const payload = {
    email: email.value,
    password: password.value
  }

  await authStore
    .login(payload)
    .then(async () => {
      await userStore.getUserDetails()
      router.push({
        name: 'selectStation'
      })
    })
    .catch((err) => {
      showError.value = true
    })

  loadingStore.contentLoaded()
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push({
      name: 'selectStation'
    })
  }

  loadingStore.contentLoaded()
})
</script>

<template>
  <div class="-mt-16 flex h-screen flex-col justify-center">
    <div class="my-auto sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="text-center">Sign in to your account</h2>
      <form class="mt-10 space-y-3" @submit.prevent="submitLogin">
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
          <div class="mt-2 relative">
            <input
              id="password"
              v-model="password"
              name="password"
              :type="passwordFieldType"
              autocomplete="current-password"
              required="true"
              class="block w-full"
            />
            <p class="text-xs cursor-pointer mt-2.5 absolute inset-y-0 right-0 pr-3" @click="togglePasswordVisibility">{{toggleText}}</p>
          </div>
        </div>

        <div>
          <StandardButton
            :type="'submit'"
            :text="'Login'"
            class="btn-primary mt-4 w-full justify-center"
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
