import { adminDb } from '../backend/src/lib/firebase.ts'

const devices = adminDb.collection('devices')

if (process.argv.includes('--reset')) {
    await adminDb.recursiveDelete(adminDb.collection('devices'))
    await adminDb.recursiveDelete(adminDb.collection('requests'))
}


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

const Device3: Device = {
    DeviceID: "PND-0003",
    faultVerdict: "Device fault",
    datetime: new Date('2026-10-19T08:30:00+11:00'),
    location: "15 Ben Street, Melbourne, VIC"
}

const Device4: Device = {
    DeviceID: "PND-0004",
    faultVerdict: "Device fault",
    datetime: new Date('2026-10-19T11:30:00+11:00'),
    location: "15 Ben Street, Melbourne, VIC"
}

const Device5: Device = {
    DeviceID: "PND-0005",
    faultVerdict: "Device fault",
    datetime: new Date('2026-10-19T11:30:00+11:00'),
    location: "17 Ben Street, Melbourne, VIC"
}

const Device6: Device = {
    DeviceID: "PND-0006",
    faultVerdict: "Device fault",
    datetime: new Date('2026-10-19T11:30:00+11:00'),
    location: "18 Ben Street, Melbourne, VIC"
}

await devices.doc(Device1.DeviceID).set(Device1)
await devices.doc(Device2.DeviceID).set(Device2)
await devices.doc(Device3.DeviceID).set(Device3)
await devices.doc(Device4.DeviceID).set(Device4)
await devices.doc(Device5.DeviceID).set(Device5)
await devices.doc(Device6.DeviceID).set(Device6)