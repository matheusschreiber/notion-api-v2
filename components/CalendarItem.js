import styles from '../styles/components/CalendarItem.module.css'

export default function CalendarItem({id, date, text}){

  return (
    <div className={styles.calendar_item_wrapper}>
      <div className={styles.date_time_event} id={styles.date}>
        {date.split('-')[2]}/{date.split('-')[1]}
        <span>{text.slice(0,5)}</span>
      </div>
      <div className={styles.date_time_event} id={styles.event}>{text.slice(5).toUpperCase()}</div>
    </div>
  )
}