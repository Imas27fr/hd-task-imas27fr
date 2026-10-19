import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import styles from './ReplacementDesign.module.css'
import {type Verdict, type Device, type State, type Request, getFaultyDevices, getRequests} from '../hooks/useDevices'

type selected = {
    selectedFilter: string,
    selectedDevice: Device | null,
    onDeviceSelect: (device: Device | null) => void,
    selectedRequest: Request | null,
    onRequestSelect: (request: Request) => void,
}


export function Requests({selectedFilter, selectedDevice, onDeviceSelect, selectedRequest, onRequestSelect} : selected) {
    const [devices, setDevices] = useState<Device[]>([])
    const [requests, setRequests] = useState<Request[]>([])

    const { user, loading } = useAuth()

    console.log('Authentication loading:', loading)
    console.log('Signed-in user:', user?.uid)
    console.log('Selected Filter:', selectedFilter)

    useEffect(() => {
        if (loading || !user) return

        async function loadDevicesRequests() {
            try {
                const loadedDevices = await getFaultyDevices()
                const loadedRequests = await getRequests()
                setDevices(loadedDevices)
                setRequests(loadedRequests)
                console.log(loadedDevices)
                console.log(loadedRequests)
            } catch (error) {
                console.error('Failed to load devices:', error)
            }
        }

        loadDevicesRequests()
        }, [loading, user])
    
    const visibleRequests = requests.filter(
        request =>
            selectedFilter === 'All' ||
            request.Status === selectedFilter
    )

    return (
        <>
            <div className={styles['requestsBox']}>
                <h2 className={styles.heading2}>Replacement Requests</h2>
                
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
                                    <tr key={request.DeviceID}>
                                        <td>
                                            <button className={styles.requestlistoption} onClick={() => {onRequestSelect(request); onDeviceSelect(device ?? null)}}>
                                                {request.DeviceID}
                                            </button>
                                        </td>

                                        <td>
                                            {request.datetime.toDateString()}
                                            {' '}
                                            {request.datetime.toTimeString()}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                request.Status == "Requested"? styles.requestedBG : 
                                                    (request.Status == "Approved"? styles.approvedBG : 
                                                        (request.Status == "In Progress"? styles.progressBG : 
                                                            (request.Status == "Delivered"? styles.approvedBG : styles.normalBG))) 
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

        </>
    )
}