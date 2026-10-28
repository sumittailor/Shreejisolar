// Official WhatsApp click-to-chat helper

/**
 * Clean phone number to digits only with country code
 */
export function formatWhatsAppNumber(phone) {
  if (!phone) return '919785002188'; // Fallback placeholder if not set
  const cleaned = phone.replace(/[^\d]/g, '');
  // Default to India (91) if 10 digits provided
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Generate official WhatsApp URL with prefilled URL-encoded message
 */
export function getWhatsAppUrl({
  whatsappNumber,
  referenceNo = null,
  service = 'Solar Installation',
  packageName = null,
  customerName = null,
  capacity = null,
  isGeneral = false
}) {
  const number = formatWhatsAppNumber(whatsappNumber);
  
  let message = '';
  if (isGeneral) {
    message = `Hello Shree Ji Solar Experts, I would like to enquire about your solar energy and cleaning services. Please provide more information.`;
  } else if (referenceNo) {
    message = `Hello Shree Ji Solar Experts, I have submitted an enquiry online. My enquiry reference is [${referenceNo}]. Service: ${service}${packageName ? ` (${packageName})` : ''}. Please contact me with quotation and site survey details.`;
  } else if (packageName) {
    message = `Hello Shree Ji Solar Experts, I am interested in your [${packageName}] (${capacity || 'Solar System'}). Please share the package pricing, subsidy eligibility, and installation timeline.`;
  } else if (service === 'Solar Panel Cleaning') {
    message = `Hello Shree Ji Solar Experts, I would like to book or get a quotation for Solar Panel Cleaning and Maintenance. Please share your service availability and charges.`;
  } else {
    message = `Hello Shree Ji Solar Experts, I would like to enquire about ${service}. Please connect with me.`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedMessage}`;
}
