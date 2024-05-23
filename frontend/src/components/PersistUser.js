import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import useAuthUser from '../hooks/hookAuth'
import useAxiosSecure from '../hooks/hookUrlPrivate'
import useRefreshToken from '../hooks/hookRefresh'

export default function PersistUser() {

    const refresh = useRefreshToken()
    const { accessToken, setUser } = useAuthUser()
    const [load, setload] = useState(true)
    const axiosPrivate = useAxiosSecure()

    useEffect(() => {
        let isMounted = true

        async function verUser() {
            try {
                await refresh()
                const { data } = await axiosPrivate.get('admin/user')
                setUser(data)
            } catch (error) {
                console.log(error?.response)
            } finally {
                isMounted && setload(false)
            }
        }

        !accessToken ? verUser() : setload(false)

        return () => {
            isMounted = false
        }
    }, [])

    return (
        load ? "load" : <Outlet />
    )
}