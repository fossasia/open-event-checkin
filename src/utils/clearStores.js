import { useAttendeesStore } from "@/stores/attendees";
import { useCameraStore } from "@/stores/camera";
import { useEventsStore } from "@/stores/events";
import { usePasswordModalStore } from "@/stores/passwordModal";
import { usePrintModalStore } from "@/stores/printModal";
import { useProcessCheckInStore } from "@/stores/processCheckIn";
import { useSessionsStore } from "@/stores/sessions";
import { useStationsStore } from "@/stores/stations";
import { useStationSelectorStore } from "@/stores/stationSelector";
import { useTicketsStore } from "@/stores/tickets";
import { useUserStore } from "@/stores/user";


export default function clearStores() {
    const attendeesStore = useAttendeesStore()
    const cameraStore = useCameraStore()
    const eventsStore = useEventsStore()
    const passwordModalStore = usePasswordModalStore()
    const printModalStore = usePrintModalStore()
    const processCheckInStore = useProcessCheckInStore()
    const sessionsStore = useSessionsStore()
    const stationsStore = useStationsStore()
    const stationSelectorStore = useStationSelectorStore()
    const ticketsStore = useTicketsStore()
    const userStore = useUserStore()

    attendeesStore.$reset()
    cameraStore.$reset()
    eventsStore.$reset()
    passwordModalStore.$reset()
    printModalStore.$reset()
    processCheckInStore.$reset()
    sessionsStore.$reset()
    stationsStore.$reset()
    stationSelectorStore.$reset()
    ticketsStore.$reset()
    userStore.$reset()
}
  