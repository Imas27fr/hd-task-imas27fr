
import { getClientDb } from '@/lib/firebase/client'
import { doc, setDoc, getDoc, collection, getDocs, query, where, Timestamp, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { Request } from '../components/ReplacementDesign';


type Verdict = "Device fault" | "Network Outage" 

type Device = {
    DeviceID: string,
    faultVerdict: Verdict,
    datetime: Date,
    location: string
};

type State = "Requested" | "Approved" | "In Progress" | "Delivered" | "Rejected";

type Request = {
    DeviceID: string,
    datetime: Date,
    Status: State
}

const db = getClientDb()


export async function createReplacementRequests(){

    const requests = collection(db, 'requests')
    const faultyDevices = await getFaultyDevices();
    console.log("Creating Replacement Requests")

    for (const device of faultyDevices) {
        console.log(device.DeviceID)
        
        const requestRef = doc(db, 'requests', device.DeviceID)
        const requestSnapshot = await getDoc(requestRef)

        if (requestSnapshot.exists()) {
            continue;
        }

        const now: Date = new Date();

        const newRequest: Request = {
            DeviceID: device.DeviceID,
            datetime: now,
            Status: "Requested"
        }

        await setDoc(doc(requests, newRequest.DeviceID), newRequest)

    }

    console.log(requests)

    return;

}

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

