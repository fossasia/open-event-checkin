import { mande, defaults } from 'mande'
import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', () => {
  let instance = mande('https://test-api.eventyay.com/v1/')

  function setToken() {
    const token = localStorage.getItem('token')
    instance.options.headers.Authorization = 'JWT ' + token
  }

  function clearToken() {
    instance.options.headers.Authorization = ''
  }

  function newSession(authenticated) {
    // reinit
    instance = mande('https://test-api.eventyay.com/v1/')
    if (authenticated) {
      setToken()
    } else {
      clearToken()
    }
  }

  async function get(requiresAuth, path, payload) {
    newSession(requiresAuth)
    instance.options.headers['Accept'] = 'application/vnd.api+json'
    try {
      if (payload) {
        return await instance.get(path)
      } else {
        return await instance.get(path, payload)
      }
    } catch (error) {
      return await Promise.reject(error)
    }
  }

  async function post(requiresAuth, path, payload, hasBody) {
    newSession(requiresAuth)
    if (hasBody) {
      delete defaults.headers['Content-Type']
      const options = instance.options
      options['body'] = payload
      try {
        return await instance.post(path)
      } catch (error) {
        return await Promise.reject(error)
      }
    } else {
      if (payload) {
        try {
          return await instance.post(path, payload)
        } catch (error) {
          return await Promise.reject(error)
        }
      } else {
        try {
          return await instance.post(path)
        } catch (error) {
          return await Promise.reject(error)
        }
      }
    }
  }

  async function remove(path) {
    newSession(true)
    try {
      return await instance.delete(path)
    } catch (error) {
      return await Promise.reject(error)
    }
  }

  async function patch(path, payload) {
    newSession(true)
    instance.options.headers['Content-Type'] = 'application/vnd.api+json'
    instance.options.headers['Accept'] = 'application/vnd.api+json'

    try {
      return await instance.patch(path, payload)
    } catch (error) {
      return await Promise.reject(error)
    }
  }
  return { instance, setToken, clearToken, newSession, get, post, remove, patch }
})
