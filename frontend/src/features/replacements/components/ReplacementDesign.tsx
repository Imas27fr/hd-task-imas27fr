'use client'

import { useState } from 'react'
import styles from './ReplacementDesign.module.css'

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
                    <h2 className={styles.requestID}>Request REP-001</h2>
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

    return (
        <>
            <div className={styles['requestsBox']}>
                <h2 className={styles.heading2}>Replacement Requests</h2>
                
                <table className={styles.requestsTable}>
                    
                    <tr>
                        <th>Device</th>
                        <th>Request</th>
                        <th>Created</th>
                        <th>Status</th>
                    </tr>
                    
                    <tbody>
                        <tr>
                            <td>PND-0142</td>
                            <td>REP-001</td>
                            <td>18 Oct, 09:10</td>
                            <td>Requested</td>
                        </tr>
                        
                        <tr>
                            <td>PND-0188</td>
                            <td>REP-002</td>
                            <td>18 Oct, 09:10</td>
                            <td>Requested</td>
                        </tr>

                        <tr>
                            <td>PND-0205</td>
                            <td>REP-003</td>
                            <td>18 Oct, 09:10</td>
                            <td>Approved</td>
                        </tr>
                        
                        <tr>
                            <td>PND-0107</td>
                            <td>REP-004</td>
                            <td>18 Oct, 09:10</td>
                            <td>Delivered</td>
                        </tr>
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