import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export default function serverDateTimeToLocal(serverDateTime) {
  return dayjs(serverDateTime).local().format('HH:mma')
}
