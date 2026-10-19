import styles from './ReplacementDesign.module.css'
import {type Verdict, type Device, type State, type Request, updateStatus, getFaultyDevices, getRequests} from '../hooks/useDevices'


type selectedReq = {
    selectedDevice: Device | null,
    selectedRequest: Request | null,
}

export function RequestDetail({selectedDevice, selectedRequest} : selectedReq) {

    return (
        <>
            <div className={styles['requestInfoBox']}>
                <div className={styles.requestHeader}>
                    <h2 className={styles.requestID}>Request Information</h2>
                    <p>
                        <span
                            className={
                            selectedRequest?.Status == "Requested"? styles.requestedBG : 
                                (selectedRequest?.Status == "Approved"? styles.approvedBG : 
                                    (selectedRequest?.Status == "In Progress"? styles.progressBG : 
                                        (selectedRequest?.Status == "Delivered"? styles.deliveredBG : styles.normalBG))) 
                            }
                        >
                        {selectedRequest?.Status}
                        </span>  
                    </p>
                </div>
                <h3 className={styles.deviceID}>Pendant {selectedDevice?.DeviceID}</h3>
                <p><b>Location:</b> {selectedDevice?.location}</p>
                <p><b>Recorded fault:</b> {selectedDevice?.faultVerdict}</p>
                <p><b>Offline since:</b> {selectedDevice?.datetime.toDateString()} {selectedDevice?.datetime.toTimeString()}</p>
                <br></br>
                <h4 className={styles.replacementProgress}>Replacement progress</h4>

                <ProgressBar 
                selectedRequest={selectedRequest}
                />

                <RequestOption 
                selectedRequest={selectedRequest}
                />
            </div>
        </>
    )
}

type selectedReqOnly = {
    selectedRequest: Request | null,
}

export function ProgressBar({selectedRequest} : selectedReqOnly) {

    const stages = ['Requested', 'Approved', 'In Progress', 'Delivered']

    const currentStep = stages.indexOf(selectedRequest?.Status ?? '')

    return (
        <>
            <div className={styles.steps}>
                <div className={currentStep >= 0 ? styles['stepFilled'] : styles['step']}></div>
                <div className={currentStep >= 1 ? styles['stepFilled'] : styles['step']}></div>
                <div className={currentStep >= 2 ? styles['stepFilled'] : styles['step']}></div>
                <div className={currentStep >= 3 ? styles['stepFilled'] : styles['step']}></div>
            </div>
            <div className={styles.stepsLabel}>
                <p>Requested</p>
                <p>Approved</p>
                <p>In Progress</p>
                <p>Delivered</p>
            </div>
        </>
    )
}

export function RequestOption({selectedRequest} : selectedReqOnly) {

    if (!selectedRequest) return null

    return (
        <>
            <div className={styles['requestOptions']}>
                {selectedRequest.Status === 'Requested' && (
                    <>
                        <button className={styles['rounded-box-is-active']} onClick={() => updateStatus(selectedRequest.DeviceID, "Approved")}>
                            Approve request
                        </button>

                        <button className={styles['rounded-box']}>
                            Reject request
                        </button>
                    </>
                )}

                {selectedRequest.Status === 'Approved' && (
                    <>
                        <button className={styles['rounded-box-is-active']} onClick={() => updateStatus(selectedRequest.DeviceID, "In Progress")}>
                            Mark as In Progress
                        </button>
                    </>
                )}

                {selectedRequest.Status === 'In Progress' && (
                    <>
                        <button className={styles['rounded-box-is-active']} onClick={() => updateStatus(selectedRequest.DeviceID, "Delivered")}>
                            Confirm Delivered
                        </button>
                    </>
                )}
            </div>
        </>
    )
}
