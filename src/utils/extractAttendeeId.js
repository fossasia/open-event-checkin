export default function extractAttendeeId(str) {
  //remove last section of string from ticket id become attendee id
  const regex = /(\d+)$/
  const match = str.match(regex)
  return match ? match[1] : null
}
