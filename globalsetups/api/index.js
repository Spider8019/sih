import axios from "axios"
import { defaults } from "../defaultValues"

const callApiWithAccessTokenAndReturnDataGet = async (DATA, URL) => {
    const response = await axios({
        method: "GET",
        url: defaults.baseUrl + "/api/" + URL,
        params: DATA
    })
    return response
}

const callApiAndReturnDataGetMod = async (DATA, URL) => {
    const response = await axios({
        method: "GET",
        url: defaults.baseUrl + "/api/" + URL,
        headers: { Authorization:`Token ${defaults.accessToken}`},
        params: DATA
    })
    if (response.status === 200)
        return response.data
    else {
        return { error: "Unable To Fetch" }
    }
}

const callApiAndReturnDataPost = async (DATA, URL) => {
    const response = await axios({
        method: "POST",
        url: defaults.baseUrl + "/api/" + URL,
        data: DATA
    })

    return response
}
const callApiAndReturnDataPut = async (DATA, URL) => {
    const response = await axios({
        method: "PUT",
        url: defaults.baseUrl + "/api/" + URL,
        data: DATA
    })

    return response
}
const callApiAndReturnDataDelete = async (DATA, URL) => {
    const response = await axios({
        method: "DELETE",
        url: defaultOptions.baseUrl + "/api/" + URL,
        data: DATA
    })

    return response
}

// export const getProfile = (obj) => callApiAndReturnDataGet(obj,"profile")
export const signupProfile = (obj) => callApiAndReturnDataPost(obj, "must/signup/")

export const gettingData=(obj)=>callApiAndReturnDataGetMod(obj,"/letsfind")
