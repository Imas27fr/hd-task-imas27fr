import styles from './ReplacementDesign.module.css'
import {type Verdict, type Device, type State, type Request, updateStatus, setRejected, getFaultyDevices, getRequests} from '../hooks/useDevices'
import { useState } from 'react'


type selectedReq = {
    selectedDevice: Device | null,
    selectedRequest: Request | null,
}

export function RequestDetail({selectedDevice, selectedRequest} : selectedReq) {

    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

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
                                        (selectedRequest?.Status == "Delivered"? styles.deliveredBG : 
                                            (selectedRequest?.Status == "Rejected"? styles.rejectedBG : styles.normalBG)))) 
                            }
                        >
                        {selectedRequest?.Status}
                        </span>  
                    </p>
                </div>
                <h3 className={styles.deviceID}>Pendant {selectedDevice?.DeviceID}</h3>
                <p><b>Location:</b> {selectedDevice?.location}</p>
                <p><b>Recorded fault:</b> {selectedDevice?.faultVerdict}</p>
                <p><b>Offline since:</b> {selectedDevice?.datetime.toDateString()} {selectedDevice?.datetime.toLocaleTimeString('en-AU', {hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Australia/Sydney'})}</p>
                <br></br>

                <ProgressBar 
                selectedRequest={selectedRequest}
                isRejecting={isRejecting}
                />

                {isRejecting === false && (
                    <RequestOption 
                    selectedRequest={selectedRequest}
                    onRejectSelect={setIsRejecting}
                    />
                )}

                {isRejecting == true && (
                    <RejectReasonOption 
                    selectedRequest={selectedRequest}
                    setIsRejecting={setIsRejecting}
                    reason={rejectReason}
                    setReason={setRejectReason}
                    />
                )}
                
            </div>
        </>
    )
}

type selectedReqOnly = {
    selectedRequest: Request | null,
    isRejecting: boolean
}

export function ProgressBar({selectedRequest, isRejecting} : selectedReqOnly) {

    const stages = ['Requested', 'Approved', 'In Progress', 'Delivered']

    const currentStep = stages.indexOf(selectedRequest?.Status ?? '')
    if (selectedRequest?.Status === "Rejected" || isRejecting) {
        return;
    }

    return (
        <>
            <h4 className={styles.replacementProgress}>Replacement progress</h4>

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

type selectedReqandReject = {
    selectedRequest: Request | null,
    onRejectSelect: (isRejecting: boolean) => void
}

export function RequestOption({selectedRequest, onRejectSelect} : selectedReqandReject) {

    if (!selectedRequest) return null

    return (
        <>      

            {selectedRequest.Status === 'Rejected' && (
                    <>
                        <br></br>
                        <div className={styles.rejectionReason}>
                            <h2>Rejection Reason</h2>
                            <p>{selectedRequest.Reason}</p>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <p>This request is closed. No further progress actions are available.</p>

                    </>
                )}

            <div className={styles['requestOptions']}>
                {selectedRequest.Status === 'Requested' && (
                    <>
                        <button className={styles['rounded-box-is-active']} onClick={() => updateStatus(selectedRequest.DeviceID, "Approved")}>
                            Approve request
                        </button>

                        <button className={styles['rounded-box']} onClick={() => onRejectSelect(true)
                        }>
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


type selectedReqandRejectReason = {
    selectedRequest: Request | null,
    setIsRejecting: (isRejecting: boolean) => void,
    reason: string
    setReason: (rejectReason: string) => void
}

export function RejectReasonOption({selectedRequest, setIsRejecting, reason, setReason} : selectedReqandRejectReason) {
    const [text,setText] = useState("");


    if (!selectedRequest) return null

    async function handleReject() {
        if (!selectedRequest || reason.trim().length === 0) return

        try {
            await setRejected(
                selectedRequest.DeviceID,
                'Rejected',
                reason.trim()
            )

            setReason('')
            setIsRejecting(false)
        } catch (error) {
            console.error('Rejection could not be saved:', error)
        }
    }

    return (
        <>
            <h2 className={styles.rejecth2}>Reject replacement request</h2>
            <label htmlFor="rejection-reason">Reason for rejection (required)</label>
            <br></br>
            <textarea
                id="rejection-reason"
                value={reason}
                onChange={event => {setReason(event.target.value); setText(event.target.value)}}
                rows={3}
                placeholder="Enter the reason for your decision"
                className={text.trim() !== ""? styles.textbox : styles.textboxError}
            />
            { text.trim() === "" && <p className={styles.rejectionError}>Enter a reason before rejecting</p> }

            {selectedRequest.Status === 'Requested' && (
                    <>
                        <div className={styles['rejectOptions']}>
                            <button className={styles['rounded-box-is-active']} onClick={handleReject}>
                                Confirm Rejection
                            </button>

                            <button className={styles['rounded-box']} onClick={() => setIsRejecting(false)}>
                                Cancel
                            </button>
                        </div>
                    </>
                )}

        </>
    )
}