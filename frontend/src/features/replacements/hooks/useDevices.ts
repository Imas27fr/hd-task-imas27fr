
import { getClientDb } from '@/lib/firebase/client'
import { doc, getDoc, collection, getDocs, query, where, Timestamp, QuerySnapshot, DocumentData } from 'firebase/firestore'


type Verdict = "Device fault" | "Network Outage" 

type Device = {
    DeviceID: string,
    faultVerdict: Verdict,
    datetime: Date,
    location: string
};

const db = getClientDb()

export async function getFaultyDevices(): Promise<Device[]> {

    const faultyDevices= query(
        collection(db, "devices"),
        where("faultVerdict", "==", "Device fault")
    );

    const snapshot = await getDocs(faultyDevices);

    return getValidDevices(snapshot);
}

function getValidDevices(snapshot: QuerySnapshot<DocumentData>): Device[] {

    const documents = snapshot.docs;
    const validDevices: Device[] = [];

    for (const deviceSnapshot of documents) {
        const device = deviceSnapshot.data()

        if (typeof device.DeviceID !== "string" || device.DeviceID.trim() === '') {
            console.log("Invalid Device found. Skipping Device");
            continue;
        }
        const deviceID = device.DeviceID

        if (typeof device.faultVerdict !== "string" || (device.faultVerdict !== 'Device fault' && device.faultVerdict !== 'Network Outage')) {
            console.log("Invalid Device Fault. Skipping Device");
            continue;
        }
        const fault = device.faultVerdict;

        if (!(device.datetime instanceof Timestamp) || Number.isNaN(device.datetime.toDate().getTime())) {
            console.log("Invalid Date Time. Skipping Device");
            continue;
        }
        const date = device.datetime.toDate();
        
        if (typeof device.location !== 'string') {
            console.log("Invalid Device Location. Skipping Device");
            continue;
        }
        const loc = device.location;

        const validDevice : Device = {
            DeviceID: deviceID,
            faultVerdict: fault,
            datetime: date,
            location: loc
        }

        validDevices.push(validDevice);

    }

    return validDevices;
}