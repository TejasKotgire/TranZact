import axios from "axios"
import BottomWarning from "../components/BottomWarning"
import Button from "../components/Button"
import Heading from "../components/Heading"
import InputBox from "../components/InputBox"
import SubHeading from "../components/SubHeading"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Signin = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  async function signin(){
    const response = await axios.post(`${apiUrl}/user/signin`, {
      username,
      password
    })
    localStorage.setItem("token", response.data.token)
    if(response.status == 200){
      navigate('/dashboard')
    }
  }

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={e=> setUsername(e.target.value)} placeholder="harkirat@gmail.com" label={"Email"} />
        <InputBox onChange={e=> setPassword(e.target.value)} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={signin} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}

export default Signin;