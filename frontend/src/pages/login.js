import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { axiosInstance } from '../hoc/url';
import useAuth from '../hooks/hookAuth'

export default function Login() {

    const { setAccessToken, setCSRFToken } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const fromLocation = location?.state?.from?.pathname || '/'
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    function onEmailChange(event) {
        setEmail(event.target.value)
    }

    function onPasswordChange(event) {
        setPassword(event.target.value)
    }

    async function onSubmitForm(event) {
        event.preventDefault()

        setLoading(true)

        try {
            const response = await axiosInstance.post('admin/login', JSON.stringify({
                email,
                password
            }))

            setAccessToken(response?.data?.access_token)
            setCSRFToken(response.headers["x-csrftoken"])
            setEmail()
            setPassword()
            setLoading(false)

            navigate(fromLocation, { replace: true })
        } catch (error) {
            setLoading(false)
            // TODO: handle errors
        }
    }

    return (
        <>
          {/* Main Content */}
          <main className="flex flex-col items-center justify-center min-h-screen" style={{
            backgroundRepeat: 'no-repeat',
          }}>
            {/* Login Section */}
            <div className="w-full max-w-lg px-6 py-12 text-center">
              <h2 className="text-5xl font-bold text-white mb-6"> <span style= {{color: '#FFA32C'}} >LOG </span><span style= {{color: '#0BF1B7'}}>IN</span></h2>
            </div>
      
            <form className="w-full max-w-lg bg-black p-8 bg-transparent flex justify-center flex-wrap" onSubmit={onSubmitForm}>
              <input type="email" placeholder="Email" autoComplete='off' className="form-input mb-6 bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" onChange={onEmailChange} />
              <input type="password" placeholder="Password" autoComplete='off' className="form-input mb-6 bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" onChange={onPasswordChange} />
              <button type="submit" disabled={loading} className="w-full text-black font-bold py-3 px-4 rounded-full bg-orange-500 hover:bg-orange-600 focus:outline-none focus:shadow-outline">
                LOG IN
              </button>
            </form>
          </main>
        </>
      );
      
}