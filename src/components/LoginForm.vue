<script setup>
import { RouterLink } from 'vue-router'

function submitForm() {
  console.log('submitting form')
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center p-6 my-auto">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <form class="space-y-6 mt-10" @submit.prevent="submitForm">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900"
            >Email address</label
          >
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required="true"
              class="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label
          >
          <div class="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required="true"
              class="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <RouterLink :to="{ name: 'scanner', params: { scannerType: 'checkin' } }">
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Login
            </button>
          </RouterLink>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        <span class="font-semibold text-blue-500">Forgot password?</span>
        {{ ' ' }}
        <a href="https://eventyay.com/reset-password" class="font-semibold leading-6"
          >Click here to reset password</a
        >
      </p>
    </div>
  </div>
</template>
