import styles from '../styles/components/TaskItem.module.css'

export default function TaskItem({title}){

  return(
    <div className={styles.task_item_wrapper}>
      <h2>{title}</h2>

      <ul>
        {
          // subtasks.map((i)=>(
          //   <li key={id + i}>{i}</li>
          // ))
        }
      </ul>
    </div>
  )
}