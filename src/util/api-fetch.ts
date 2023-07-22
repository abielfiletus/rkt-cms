import axios, { AxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { router } from '../pages/_app'

export const logoutUser = async () => {
  window.localStorage.removeItem('access')
  window.localStorage.removeItem('name')
  window.localStorage.removeItem('nip')
  window.localStorage.removeItem('id')
  window.localStorage.removeItem('email')
  window.localStorage.removeItem('avatar')
  window.localStorage.removeItem('role_id')
  window.localStorage.removeItem('role_name')

  await router.replace('/login')
}

const baseUrl = process.env.NEXT_PUBLIC_BE_URL

export const apiPost = async (
  url: string,
  body: Record<string, any>,
  headerConfig: AxiosRequestConfig<Record<string, any>> = {},
  useToken = true
) => {
  try {
    if (useToken) {
      const token = window.localStorage.getItem('access')
      headerConfig.headers = { ...headerConfig.headers, ...{} }
      headerConfig.headers.Authorization = 'Bearer ' + token
      headerConfig.headers['Content-Type'] = 'multipart/form-data'
    }

    const res = await axios.post(baseUrl + url, body, headerConfig)

    return res.data
  } catch (err) {
    return errorHandling(err)
  }
}

export const apiPatch = async (
  url: string,
  body: Record<string, any>,
  headerConfig: AxiosRequestConfig<Record<string, any>> = {},
  useToken = true,
  multipart = true
) => {
  try {
    if (useToken) {
      const token = window.localStorage.getItem('access')
      headerConfig.headers = { ...headerConfig.headers, ...{} }
      headerConfig.headers.Authorization = 'Bearer ' + token
    }

    if (multipart) {
      headerConfig.headers = { ...headerConfig.headers, ...{} }
      headerConfig.headers['Content-Type'] = 'multipart/form-data'
    }

    const res = await axios.patch(baseUrl + url, body, headerConfig)

    return res.data
  } catch (err) {
    return errorHandling(err)
  }
}

export const apiGet = async (
  url: string,
  body: Record<string, any> = {},
  headerConfig: AxiosRequestConfig<Record<string, any>> = {},
  useToken = true
) => {
  try {
    if (useToken) {
      const token = window.localStorage.getItem('access')

      if (!token) await logoutUser()

      headerConfig.headers = { ...headerConfig.headers, ...{} }
      headerConfig.headers.Authorization = 'Bearer ' + token
    }

    if (Object.keys(body).length) headerConfig.params = body

    const res = await axios.get(baseUrl + url, headerConfig)

    if (res.status === 401) await logoutUser()
    if (res.status === 403) await router.push('/permission-denied')

    return res.data
  } catch (err) {
    await errorHandling(err)
  }
}

export const apiDelete = async (url: string) => {
  try {
    const token = window.localStorage.getItem('access')

    if (!token) return logoutUser()

    const res = await axios.delete(baseUrl + url, { headers: { Authorization: 'Bearer ' + token } })

    return res.data
  } catch (err) {
    // @ts-ignore
    switch (err?.response?.status) {
      case 401:
        await router.push('/permission-denied')

        return
      case 403:
        await logoutUser()

        return
      default:
        return err
    }
  }
}

const errorHandling = async (err: any) => {
  // @ts-ignore
  switch (err?.response?.status) {
    case 400:
      // @ts-ignore
      toast.warning(err.response.data.error || err.response.data.msg)
      break
    case 401:
      await logoutUser()

      return
    case 403:
      await router.push('/permission-denied')

      return
    case 422:
      // @ts-ignore
      Object.keys(err.response.data.error).map(key => {
        // @ts-ignore
        err.response.data.error[key] = key + ' ' + err.response.data.error[key]
      })

      // @ts-ignore
      return err.response.data
    default:
      return err
  }
}
