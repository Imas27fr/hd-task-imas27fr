'use client'

import { useState } from 'react'
import styles from './ReplacementDesign.module.css'

export default function Replacement() {
    return (
        <main>
        <h1 className={styles.heading}>Device Replacement Requests</h1>

        <Filters />


        </main>
    )
}

export function Filters() {
    const [selectedFilter, setSelectedFilter] = useState('Approved')
    return (
        <>
            <div>
                <button 
                    onClick={() => setSelectedFilter('All')}
                    className={selectedFilter === 'All' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >All
                </button>
            
                <button 
                    onClick={() => setSelectedFilter('Requested')}
                    className={selectedFilter === 'Requested' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >Requested
                </button>
            
                <button 
                    onClick={() => setSelectedFilter('Approved')}
                    className={selectedFilter === 'Approved' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >Approved
                </button>
            
                <button 
                    onClick={() => setSelectedFilter('In Progress')}
                    className={selectedFilter === 'In Progress' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >In Progress
                </button>
            
                <button 
                    onClick={() => setSelectedFilter('Delivered')}
                    className={selectedFilter === 'Delivered' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >Delivered
                </button>
            
                <button 
                    onClick={() => setSelectedFilter('Rejected')}
                    className={selectedFilter === 'Rejected' ? styles['rounded-box-is-active'] : styles['rounded-box'] }
                    >Rejected
                </button>
            </div>
        </>
    )
}