import React, { useEffect, useState } from 'react'
import Appbar from '../components/Appbar'
import Balance from '../components/Balance'
import Users from '../components/Users'
import axios from 'axios'

const Dashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [balance, setBalance] = useState("")
  async function getBalance(){
    const reponse = await axios.get(`${apiUrl}/account/balance`, {
      headers : {
        Authorization : `Bearer ${localStorage.getItem('token')}`
      }
    })
    setBalance(reponse.data.balance)
  }

  useEffect(()=>{
    getBalance()
  }, [])
  return (
    <div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
  )
}

export default Dashboard