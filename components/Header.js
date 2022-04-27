import { FiGithub } from 'react-icons/fi'

import styles from '../styles/components/Header.module.css'

export default function Header(){
  return(
    <div className={styles.header_wrapper}>
      <h1>NOTION</h1>
      <div className={styles.header_inner_wrapper}>
        <h3>API USAGE FOR PERSONAL ORGANIZATION </h3> 
        <a href="https://github.com/matheusschreiber/notion-api-v2"><FiGithub /> matheusschreiber</a>
      </div>
    </div>
  )
}