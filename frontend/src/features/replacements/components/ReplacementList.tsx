import styles from './ReplacementDesign.module.css'
import {type Verdict, type Device, type State, type Request, getFaultyDevices, getRequests} from '../hooks/useDevices'

type selected = {
    selectedFilter: string,
    onDeviceSelect: (device: Device | null) => void,
    onRequestSelect: (request: Request) => void,
    devices: Device [],
    visibleRequests: Request [],
    selectedRequest: Request | null,
    isDbError: boolean,
}


export function Requests({selectedFilter, onDeviceSelect, onRequestSelect, devices, visibleRequests, selectedRequest, isDbError} : selected) {

    return (
        <>
            <div className={styles['requestsBox']}>
                <h2 className={styles.heading2}>Replacement Requests</h2>
                
                {isDbError ? (
                    <p role="alert" className={`${styles.selectReqMsg} ${styles.rejectionError}`}>
                        Could not load replacement requests. Refresh the page to try again.
                    </p>
                ) : (
                <div className={styles.tablediv}>
                    <table className={styles.requestsTable}>
                        
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>Created</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        
                        
                        <tbody>
                            {
                                visibleRequests.map((request) => {
                                    const device = devices.find(
                                        d => d.DeviceID === request.DeviceID
                                    )

                                    return (
                                        <tr key={request.DeviceID} style={{backgroundColor: selectedRequest?.DeviceID === request.DeviceID? "#E8F1F8": "white"}}>
                                            <td>
                                                <button className={styles.requestlistoption} style={{fontWeight: selectedRequest?.DeviceID === request.DeviceID? "bold": "normal"}} onClick={() => {onRequestSelect(request); onDeviceSelect(device ?? null)}}>
                                                    {request.DeviceID}
                                                </button>
                                            </td>

                                            <td>
                                                {request.datetime.toDateString()}
                                                {' at '}
                                                {request.datetime.toLocaleTimeString('en-AU', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                    timeZone: 'Australia/Sydney'
                                                })}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                    request.Status == "Requested"? styles.requestedBG : 
                                                        (request.Status == "Approved"? styles.approvedBG : 
                                                            (request.Status == "In Progress"? styles.progressBG : 
                                                                (request.Status == "Delivered"? styles.deliveredBG : 
                                                                    (request.Status == "Rejected"? styles.rejectedBG : styles.normalBG)))) 
                                                    }
                                                >
                                                {request.Status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                )}
            </div>

        </>
    )
}
