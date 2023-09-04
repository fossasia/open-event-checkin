export default function extractOrderId(str) {
  //remove last section of string from ticket id become order
  const regex = /^([\w-]+)-/
  const match = str.match(regex)
  return match ? match[1] : null
}
