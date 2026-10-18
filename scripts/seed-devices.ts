import { adminDb } from '../backend/src/lib/firebase.ts'

const devices = adminDb.collection('devices')


type Verdict = "Device fault" | "Network Outage" 

type Device = {
    DeviceID: string,
    faultVerdict: Verdict,
    datetime: Date,
    location: String
}

const Device1: Device = {
    DeviceID: "PND-0001",
    faultVerdict: "Device fault",
    datetime: new Date('2026-10-19T09:30:00+11:00'),
    location: "14 Ben Street, Melbourne, VIC"
}

const Device2: Device = {
    DeviceID: "PND-0002",
    faultVerdict: "Device fault",
    datetime: new Date('2026-10-19T08:30:00+11:00'),
    location: "15 Ben Street, Melbourne, VIC"
}

await devices.doc(Device1.DeviceID).set(Device1)
await devices.doc(Device2.DeviceID).set(Device2)