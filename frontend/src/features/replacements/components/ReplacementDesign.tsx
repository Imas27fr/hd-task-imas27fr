'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import styles from './ReplacementDesign.module.css'
import {getFaultyDevices, getRequests} from '../hooks/useDevices'

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

export default function Replacement() {
    const [selectedFilter, setSelectedFilter] = useState('All')
    return (
        <main>
        <h1 className={styles.heading}>Device Replacement Requests</h1>

        <Filters 
            selectedFilter={selectedFilter}
            onSelect={setSelectedFilter}
        />

        <div className={styles.parentBody}>
            <Requests 
            selectedFilter={selectedFilter}
            />

            <Request />
        </div>


        </main>
    )
}
export function Request() {

    return (
        <>
            <div className={styles['requestInfoBox']}>
                <div className={styles.requestHeader}>
                    <h2 className={styles.requestID}>Request Information</h2>
                    <p>Requested</p>
                </div>
                <h3 className={styles.deviceID}>Pendant PND-0142</h3>
                <p>Location: Melbourne - Site A</p>
                <p>Recorded fault: Device fault</p>
                <p>Offline since: 18 Oct 2026, 09:10</p>
                <br></br>
                <h4 className={styles.replacementProgress}>Replacement progress</h4>
                <ProgressBar />

                <RequestOption />
            </div>
        </>
    )
}

export function ProgressBar() {
    return (
        <>
            <div className={styles.steps}>
                <div className={styles.stepFilled}></div>
                <div className={styles.step}></div>
                <div className={styles.step}></div>
                <div className={styles.step}></div>
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

export function RequestOption() {
    const [selectedOption, setSelectedOption] = useState('Approve Request')

    return (
        <>
            <div className={styles['requestOptions']}>
                <button className={styles['rounded-box']}>Approve request</button>
                <button className={styles['rounded-box']}>Reject request</button>
            </div>
        </>
    )
}

export function Requests({selectedFilter} : Filter) {
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
        }, [loading, user, selectedFilter])
    
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
                            visibleRequests.map(
                                (request) => (
                                    <tr key={request.DeviceID}>
                                        <td>{request.DeviceID}</td>
                                        <td>{request.datetime.toDateString()}{request.datetime.toTimeString()}</td>
                                        <td>{request.Status}</td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>

        </>
    )
}

type Filter = {
    selectedFilter: string
}

type FiltersProps = {
  selectedFilter: string
  onSelect: (filter: string) => void
}

export function Filters({ selectedFilter, onSelect }: FiltersProps) {
    return (
        <>
            <div>
                <button 
                    onClick={() => onSelect('All')}
                    className={selectedFilter === 'All' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >All
                </button>
            
                <button 
                    onClick={() => onSelect('Requested')}
                    className={selectedFilter === 'Requested' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >Requested
                </button>
            
                <button 
                    onClick={() => onSelect('Approved')}
                    className={selectedFilter === 'Approved' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >Approved
                </button>
            
                <button 
                    onClick={() => onSelect('In Progress')}
                    className={selectedFilter === 'In Progress' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >In Progress
                </button>
            
                <button 
                    onClick={() => onSelect('Delivered')}
                    className={selectedFilter === 'Delivered' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >Delivered
                </button>
            
                <button 
                    onClick={() => onSelect('Rejected')}
                    className={selectedFilter === 'Rejected' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >Rejected
                </button>
            </div>
        </>
    )
}