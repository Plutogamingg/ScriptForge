import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import useAuth from '../hooks/hookAuth'
import useAxiosPrivate from '../hooks/hookUrlPrivate'
import useLogout from '../hooks/hookLogout'

export default function User() {

    const { user, setUser } = useAuth()
    const axiosPrivateInstance = useAxiosPrivate()
    const navigate = useNavigate()
    const logout = useLogout()
    const [loading, setLoading] = useState(false)

    async function onLogout() {
        setLoading(true)

        await logout()
        navigate('/')
    }

    useEffect(() => {
        async function getUser() {
            const { data } = await axiosPrivateInstance.get('admin/user')
            setUser(data)
        }

        getUser()
    }, [])

    return (
        <div>
            <h3>{user?.username}</h3>
            <h4>{user?.email}</h4>
            <button disabled={loading} type='button' onClick={onLogout}>Logout</button>
        </div>
    )
}