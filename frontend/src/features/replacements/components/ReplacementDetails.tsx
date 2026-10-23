import styles from './ReplacementDesign.module.css'
import {type Verdict, type Device, type State, type Request, updateStatus, setRejected} from '../hooks/useDevices'
import { useState } from 'react'


type selectedReq = {
    selectedDevice: Device | null,
    selectedRequest: Request | null,
    isDbError: boolean
}

export function RequestDetail({selectedDevice, selectedRequest, isDbError} : selectedReq) {

    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    if (isDbError || selectedDevice === null) {
        return (
            <>
                <div className={styles['requestInfoBox']}>
                    <div className={styles.requestHeader}>
                        <h2 className={styles.requestID}>Request Information</h2>
                    </div>
                        <p className={styles.selectReqMsg}>
                            {isDbError
                                ? 'Request details are unavailable until requests can be loaded.'
                                : 'Select a request to view its details'}
                        </p>
                </div>
            </>
        )
    }

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
                <p style={{fontWeight: currentStep === 0 ? 'bold' : 'normal'}}>Requested</p>
                <p style={{fontWeight: currentStep === 1 ? 'bold' : 'normal'}}>Approved</p>
                <p style={{fontWeight: currentStep === 2 ? 'bold' : 'normal'}}>In Progress</p>
                <p style={{fontWeight: currentStep === 3 ? 'bold' : 'normal'}}>Delivered</p>
            </div>
        </>
    )
}

type selectedReqandReject = {
    selectedRequest: Request | null,
    onRejectSelect: (isRejecting: boolean) => void
}

export function RequestOption({selectedRequest, onRejectSelect} : selectedReqandReject) {
    const [saveError, setSaveError] = useState<string | null>(null)

    if (!selectedRequest) return null

    async function handleStatusChange(nextStatus: State) {
        if (!selectedRequest) return

        setSaveError(null)

        try {
            await updateStatus(selectedRequest.DeviceID, nextStatus)
        } catch (error) {
            setSaveError('Could not save the change. Please try again.')
            console.error('Status update failed:', error)
        }
    }

    return (
        <>      

            {selectedRequest.Status === 'Rejected' && (
                    <>
                        <br></br>
                        <div className={styles.rejectionReason}>
                            <h2>Rejection Reason</h2>
                            <p>{selectedRequest.Reason}</p>
                        </div>
                        <p>This request is closed. No further progress actions are available.</p>

                    </>
                )}

            {selectedRequest.Status === 'Approved' && (
                    <>
                        <br></br>
                        <div className={styles.approvedMsg}>Request approved and saved.</div>
                    </>
                )}

            {selectedRequest.Status === 'In Progress' && (
                    <>  
                        <br></br>
                        <p>Replacement arrangements are underway. Confirm delivery before completing.</p>
                    </>
                )}

            {selectedRequest.Status === 'Delivered' && (
                    <>
                        <br></br>
                        <div className={styles.approvedMsg}>Delivery confirmed by the coordinator. Request completed.</div>
                    </>
                )}

            <div className={styles['requestOptions']}>
                {saveError && (
                    <p role="alert" className={styles.rejectionError}>
                        {saveError}
                    </p>
                )}

                {selectedRequest.Status === 'Requested' && (
                    <>
                        <button className={styles['rounded-box-is-active']} onClick={() => handleStatusChange('Approved')}>
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
                        <button className={styles['rounded-box-is-active']} onClick={() => handleStatusChange('In Progress')}>
                            Mark as In Progress
                        </button>
                    </>
                )}

                {selectedRequest.Status === 'In Progress' && (
                    <>  
                        <button className={styles['rounded-box-is-active']} onClick={() => handleStatusChange('Delivered')}>
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
    const [saveError, setSaveError] = useState<string | null>(null)


    if (!selectedRequest) return null

    async function handleReject() {
        if (!selectedRequest || reason.trim().length === 0) return
        setSaveError(null)

        try {

            await setRejected(
                selectedRequest.DeviceID,
                'Rejected',
                reason.trim()
            )

            setReason('')
            setIsRejecting(false)
        } catch (error) {
            setSaveError('Could not save the rejection. Please try again.')
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
                onChange={event => {setReason(event.target.value)}}
                rows={3}
                placeholder="Enter the reason for your decision"
                className={reason.trim() !== ""? styles.textbox : styles.textboxError}
            />
            { reason.trim() === "" && <p className={styles.rejectionError}>Enter a reason before rejecting</p> }

            {saveError && (
                <p role="alert" className={styles.rejectionError}>
                    {saveError}
                </p>
            )}

            {selectedRequest.Status === 'Requested' && (
                    <>
                        <div className={styles['rejectOptions']}>
                            <button className={styles['rounded-box-is-active']} onClick={handleReject}>
                                Confirm Rejection
                            </button>

                            <button className={styles['rounded-box']} onClick={() => {setIsRejecting(false); setReason("")}}>
                                Cancel
                            </button>
                        </div>
                    </>
                )}

        </>
    )
}