'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { collection, onSnapshot, type QuerySnapshot, type DocumentData } from 'firebase/firestore'
import styles from './ReplacementDesign.module.css'
import {Filters} from './ReplacementFilters'
import {Requests} from './ReplacementList'
import {RequestDetail} from './ReplacementDetails'
import { type Device, type Request, getValidRequests, createReplacementRequests, getValidDevices} from '../hooks/useDevices'
import { getClientDb } from '@/lib/firebase/client'

export default function Replacement() {
    const [selectedFilter, setSelectedFilter] = useState('All')

    const [devices, setDevices] = useState<Device[]>([])
    const [requests, setRequests] = useState<Request[]>([])
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

    const [requestsLoading, setRequestsLoading] = useState(true)
    const [devicesLoading, setDevicesLoading] = useState(true)
    const isLoading = requestsLoading || devicesLoading

    const [requestsError, setRequestsError] = useState(false)
    const [devicesError, setDevicesError] = useState(false)
    const isDbError = requestsError || devicesError

    const { user, loading } = useAuth()

    async function loadDevicesRequests(snapshot: QuerySnapshot<DocumentData>) {
            try {
                const loadedDevices = getValidDevices(snapshot)
                const filteredDevices = loadedDevices.filter(device => device.faultVerdict === "Device fault")
                await createReplacementRequests(filteredDevices);
                setDevices(loadedDevices)
                setDevicesError(false)
                setDevicesLoading(false)
            } catch (error) {
                setDevicesError(true)
                setDevicesLoading(false)
                console.error('Failed to load devices and requests:', error)
            }
        }


    useEffect(() => {
        if (loading || !user) return

        const unsubscribe = onSnapshot(collection(getClientDb(), "requests"),

            (snapshot) => {

                const updatedRequests: Request [] = getValidRequests(snapshot);
                setRequests(updatedRequests)
                setRequestsError(false)
                setRequestsLoading(false)
                setSelectedRequest(currentRequest => {
                    if (!currentRequest) return null

                    return updatedRequests.find(
                        request => request.DeviceID === currentRequest.DeviceID
                    ) ?? null
                })
            },

            (error) => {
                setRequestsError(true)
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
                loadDevicesRequests(snapshot)
            },

            (error) => {
                setDevicesError(true)
                setDevicesLoading(false)
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

        {isLoading && 
            <div className={styles.loading}>
                <p>Loading requests...</p>
            </div>
        }

        {!isLoading &&
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






