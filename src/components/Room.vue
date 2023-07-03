<script setup>
const rooms = [
  {
    name: 'Main Room',
    description: 'This is the main room',
    imageSVG:
      'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  },
  {
    name: 'Chat Room',
    description: 'This is a chat room',
    imageSVG:
      'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
  },
]
</script>

<template>
  <div class="w-96 mx-auto">
    <ul role="list" class="divide-y divide-gray-100">
      <li v-for="room in rooms" :key="room" class="flex justify-between gap-x-6 py-5">
        <!--Icon and name-->
        <div class="flex gap-x-4 pl-4">
          <div class="w-8 flex items-center">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2 h-2">
              <path strokeLinecap="round" strokeLinejoin="round" :d="room.imageSVG" />
            </svg>
          </div>
          <div class="flex-auto">
            <p class="text-sm font-semibold leading-6 text-gray-900">{{ room.name }}</p>
            <p class="mt-1 truncate text-xs leading-5 text-gray-500">{{ room.description }}</p>
          </div>
        </div>

        <div class="flex items-center pr-4">
          <button type="button" class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Enter</button>
        </div>
        
      </li>
    </ul>  
  </div>
</template>