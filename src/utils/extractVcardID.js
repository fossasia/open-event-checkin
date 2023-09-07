export default function extractVcardID(vcard) {
  // check if EVENTYAY key exist in vcard
  if (!vcard.includes('EVENTYAY')) {
    return false
  }
  // split vcard into array
  const vcardArray = vcard.split('\n')
  // find the index of EVENTYAY key
  const index = vcardArray.findIndex((item) => item.includes('EVENTYAY:'))
  // get value from EVENTYAY key
  const id = vcardArray[index].split(':')[1]

  return id ? id : false
}
