import {useState, useEffect} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Swal from 'sweetalert2'
import Router from 'next/router'

import Header from '../components/Header'
import CalendarItem from '../components/CalendarItem'
import TaskItem from '../components/TaskItem'

import { Dots } from "react-activity";
import "react-activity/dist/library.css";

import api from  '../services/api'

export default function Home() {
  const [ tasks, setTasks ] = useState([]);
  const [ calendar, setCalendar ] = useState([]);
  const [ months, setMonths ] = useState([""]);

  const [ loadingTasks, setLoadingTasks ] = useState(false);
  const [ loadingCalendar, setLoadingCalendar ] = useState(false);

  async function getTasks(){
    setLoadingTasks(true)
    const { data } = await api.get('/api/getTasks')

    //The notion api has a sort algorithm, see that later
    // data.sort((a,b)=>{
    //   if (a.done && !b.done) return 1;
    //   else if (!a.done && b.done) return -1;
    //   else return 0
    // })

    setTasks(data)
    setLoadingTasks(false)
  }

  async function getCalendar(){
    setLoadingCalendar(true)

    const {data} = await api.get('/api/getCalendar')
    setCalendar(data) 
    setLoadingCalendar(false)
  }

  function updateMonth(){
    const date = new Date
    let j = date.getMonth()
    let array=[]
    for(let i=0;i<j;i++){
      array.push(j)
      j++;
      if (j==12) j=0
    }
    setMonths(array)
  }

  function integerToMonth(i){
    switch(i){
      case 0: return "JANEIRO";
      case 1: return "FEVEREIRO";
      case 2: return "MARÇO";
      case 3: return "ABRIL";
      case 4: return "MAIO";
      case 5: return "JUNHO";
      case 6: return "JULHO";
      case 7: return "AGOSTO";
      case 8: return "SETEMBRO";
      case 9: return "OUTUBRO";
      case 10: return "NOVEMBRO";
      case 11: return "DEZEMBRO";
    }
  }
  
  async function fetchData(){
    const key = localStorage.getItem('NOTION_API_LOGIN_KEY')
    const {data} = await api.post('/api/autentication', {key:key?key:""})
    if (!data) {
      Swal.fire(
        'Login key error',
        'Login again to access the data',
        'error'
      )
      Router.push('/')
    } else {
      updateMonth()
      getTasks()
      getCalendar()
    }
  }
  
  useEffect(()=>{
    fetchData()
  },[])

  return (
    <div className={styles.parent_container}>
      <Head>
        <title>Notion</title>
        <meta name="description" content="NOTION API Workflow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <aside className={styles.calendar_container}>
          {
            loadingCalendar||calendar==[]?

            <Dots className={styles.loading_icon} />:

            <div className={styles.month_wrapper}>
              <h1 style={{fontSize: '30pt'}}>CALENDAR</h1>
              {
                months.map((i,indexI)=>(
                  <div key={indexI}>
                    <h1 key={i}>{integerToMonth(i)}</h1>
                    {
                      calendar!=[]?
                      calendar.map((c, indexC)=>(
                        (parseInt(c.date.slice(5,7))==i+1)
                        ?
                        <CalendarItem 
                          key={`${indexI}_${indexC}`}
                          date={c.date} 
                          text={c.title}/>
                        :
                        ""
                      )) : ""
                    }
                  </div>
                ))
              }
            </div>
          }
        </aside>

        
        <aside className={styles.tasks_container}>
          {
            loadingTasks?
            <Dots className={styles.loading_icon}/>:
            <div className={styles.tasks_wrapper}>
              <h1>TASKS</h1>
              <div className={styles.tasks_inside_container}>
                {
                  tasks.map((t)=> <TaskItem key={tasks.indexOf(t)} title={t.title}/>)
                }
              </div>
            </div>
          }
        </aside>

      </main>
    </div>
  )
}
