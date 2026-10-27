import styles from './ReplacementDesign.module.css'


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