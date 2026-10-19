
import { getClientDb } from '@/lib/firebase/client'
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, query, where, Timestamp, QuerySnapshot, DocumentData } from 'firebase/firestore'


export type Verdict = "Device fault" | "Network Outage" 

export type Device = {
    DeviceID: string,
    faultVerdict: Verdict,
    datetime: Date,
    location: string
};

export type State = "Requested" | "Approved" | "In Progress" | "Delivered" | "Rejected";

export type Request = {
    DeviceID: string,
    datetime: Date,
    Status: State
}

const db = getClientDb()

export async function updateStatus(deviceID: string, Status: State): Promise<void> {

    await updateDoc(doc(db, "requests", deviceID), { Status });
    console.log("updated")

}

export async function getRequests(): Promise<Request[]> {

    await createReplacementRequests();

    const queryResults = query(
        collection(db, "requests")
    );

    const snapshot = await getDocs(queryResults);

    return getValidRequests(snapshot);
}

export function getValidRequests(snapshot: QuerySnapshot<DocumentData>): Request[] {

    const requests = snapshot.docs;

    const validRequests: Request[] = [];

    for (const requestSnapshot of requests) {
        const request = requestSnapshot.data()

        if (typeof request.DeviceID !== "string" || request.DeviceID.trim() === '') {
            console.log("Invalid Device found. Skipping Device Request");
            continue;
        }
        const deviceID = request.DeviceID

        if (!(request.datetime instanceof Timestamp) || Number.isNaN(request.datetime.toDate().getTime())) {
            console.log("Invalid Date Time. Skipping Device Request");
            continue;
        }
        const date = request.datetime.toDate();
        
        if (typeof request.Status !== "string" || (request.Status !== 'Requested' && request.Status !== 'Approved' && request.Status !== 'In Progress' && request.Status !== 'Delivered' && request.Status !== 'Rejected')) {
            console.log("Invalid Replacement Status. Skipping Device Request");
            continue;
        }
        const status = request.Status;


        const validRequest : Request = {
            DeviceID: deviceID,
            datetime: date,
            Status: status
        }

        validRequests.push(validRequest);

    }

    return validRequests;

}



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

