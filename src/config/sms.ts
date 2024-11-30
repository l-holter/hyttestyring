export const smsConfig = {
  phoneNumber: '+1234567890', // Replace with your controller's phone number
  commands: {
    turnOn: '#01#',
    turnOff: '#02#',
    status: '#07#'
  }
} as const;