export const smsConfig = {
  phoneNumber: import.meta.env.VITE_CONTROLLER_PHONE_NUMBER,
  commands: {
    turnOn: '#01#',
    turnOff: '#02#',
    status: '#07#',
    temperatureControlStue: '#23#0#1#',
    temperatureControlStue1: '#66#Stua1#1#',
    temperatureControlStue2: '#66#Stua2#1#',
    temperatureControlSov: '#66#Sov1#1#'
  }
} as const;