import mqtt from 'mqtt' // import namespace "mqtt"
import type { IClientOptions } from 'mqtt'
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'

const options: IClientOptions = {
  protocol: 'wss',
  host: `${import.meta.env.VITE_APP_DOMAIN}`,
  port: Number(import.meta.env.VITE_APP_MQTT_PORT),
  username: `${import.meta.env.VITE_APP_MQTT_USERNAME}`,
  password: `${import.meta.env.VITE_APP_MQTT_PASSWORD}`,
  clientId: uuidv5(`${import.meta.env.VITE_APP_DOMAIN}`, uuidv4()),
  path: '/mqtt'
}

export const client = mqtt.connect(options)