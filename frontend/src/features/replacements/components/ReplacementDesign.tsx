'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import styles from './ReplacementDesign.module.css'
import {Filters} from './ReplacementFilters'
import {Requests} from './ReplacementList'
import {RequestDetail, RequestOption,  ProgressBar} from './ReplacementDetails'
import {type Verdict, type Device, type State, type Request, getFaultyDevices, getRequests} from '../hooks/useDevices'

export default function Replacement() {
    const [selectedFilter, setSelectedFilter] = useState('All')
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

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
            selectedDevice={selectedDevice}
            onDeviceSelect={setSelectedDevice}
            selectedRequest={selectedRequest}
            onRequestSelect={setSelectedRequest}
            />

            <RequestDetail 
            selectedDevice={selectedDevice}
            selectedRequest={selectedRequest}
            />
        </div>


        </main>
    )
}






