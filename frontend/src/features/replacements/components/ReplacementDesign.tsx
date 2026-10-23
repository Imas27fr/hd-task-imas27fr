'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { collection, onSnapshot } from 'firebase/firestore'
import styles from './ReplacementDesign.module.css'
import {Filters} from './ReplacementFilters'
import {Requests} from './ReplacementList'
import {RequestDetail, RequestOption,  ProgressBar} from './ReplacementDetails'
import {type Verdict, type Device, type State, type Request, getFaultyDevices, getRequests, getValidRequests} from '../hooks/useDevices'
import { getClientDb } from '@/lib/firebase/client'

export default function Replacement() {
    const [selectedFilter, setSelectedFilter] = useState('All')

    const [devices, setDevices] = useState<Device[]>([])
    const [requests, setRequests] = useState<Request[]>([])
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
    const [requestsLoading, setRequestsLoading] = useState(true)
    const [isDbError, setisDbError] = useState(false)
    const { user, loading } = useAuth()

    async function loadDevicesRequests() {
            try {
                const loadedDevices = await getFaultyDevices()
                const loadedRequests = await getRequests()
                setDevices(loadedDevices)
                setRequests(loadedRequests)
                setisDbError(false)
                setRequestsLoading(false)
            } catch (error) {
                setisDbError(true)
                setRequestsLoading(false)
                console.error('Failed to load devices and requests:', error)
            }
        }


    useEffect(() => {
        if (loading || !user) return

        const unsubscribe = onSnapshot(collection(getClientDb(), "requests"),

            (snapshot) => {

                const updatedRequests: Request [] = getValidRequests(snapshot);

                loadDevicesRequests()
                
                setSelectedRequest(currentRequest => {
                    if (!currentRequest) return null

                    return updatedRequests.find(
                        request => request.DeviceID === currentRequest.DeviceID
                    ) ?? null
                })
            },

            (error) => {
                setisDbError(true)
                setRequestsLoading(false)
                console.error('Could not listen to requests db:', error)
            }

        )

        return unsubscribe
    }, [loading, user])

    useEffect(() => {
        if (loading || !user) return

        const unsubscribe = onSnapshot(collection(getClientDb(), "devices"),

            (snapshot) => {

                loadDevicesRequests()
                
            },

            (error) => {
                setisDbError(true)
                setRequestsLoading(false)
                console.error('Could not listen to devices db:', error)
            }

        )

        return unsubscribe
    }, [loading, user])

    const visibleRequests = requests.filter(
        request =>
            selectedFilter === 'All' ||
            request.Status === selectedFilter
    )

    return (
        <main>
        <h1 className={styles.heading}>Device Replacement Requests</h1>

        <Filters 
            selectedFilter={selectedFilter}
            onSelect={setSelectedFilter}
        />

        {requestsLoading && 
            <div className={styles.loading}>
                <p>Loading requests...</p>
            </div>
        }

        {!requestsLoading &&
            <div className={styles.parentBody}>
                <Requests 
                selectedFilter={selectedFilter}
                onDeviceSelect={setSelectedDevice}
                onRequestSelect={setSelectedRequest}
                devices={devices}
                visibleRequests={visibleRequests}
                selectedRequest={selectedRequest}
                isDbError={isDbError}
                />

                <RequestDetail 
                key={selectedDevice?.DeviceID ?? 'none'}
                selectedDevice={selectedDevice}
                selectedRequest={selectedRequest}
                isDbError={isDbError}
                />
            </div>
        }


        </main>
    )
}






