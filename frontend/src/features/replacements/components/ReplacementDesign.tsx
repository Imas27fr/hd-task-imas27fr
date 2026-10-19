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

    const { user, loading } = useAuth()


    useEffect(() => {
        if (loading || !user) return

        async function loadDevicesRequests() {
            try {
                const loadedDevices = await getFaultyDevices()
                const loadedRequests = await getRequests()
                setDevices(loadedDevices)
                setRequests(loadedRequests)
            } catch (error) {
                console.error('Failed to load devices and requests:', error)
            }
        }

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
                console.error('Could not listen to db:', error)
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

        <div className={styles.parentBody}>
            <Requests 
            selectedFilter={selectedFilter}
            onDeviceSelect={setSelectedDevice}
            onRequestSelect={setSelectedRequest}
            devices={devices}
            visibleRequests={visibleRequests}
            />

            <RequestDetail 
            selectedDevice={selectedDevice}
            selectedRequest={selectedRequest}
            />
        </div>


        </main>
    )
}






