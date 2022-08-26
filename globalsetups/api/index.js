import axios from "axios"
import { defaults } from "../defaultValues"

const callApiAndReturnDataGetMod = async (DATA, URL) => {
    const response = await axios({
        method: "GET",
        url: defaults.baseBackendUrl + URL,
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
        url: defaults.baseBackendUrl  + URL,
        data: DATA
    })
    if (response.status === 200)
        return response.data
    else {
        return { error: "Unable To Fetch" }
    }
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

// export const getProfile = (obj) => callApiAndReturnDataGet(obj,"profile")export const signupProfile = (obj) => callApiAndReturnDataPost(obj, "must/signup/")

export const gettingLatestShip=(obj)=>callApiAndReturnDataGetMod(obj,"/routepred/ships_latest/")
export const gettingShipLocationAtInstanceOfTime=(obj)=>callApiAndReturnDataPost(obj,"/routepred/ship_by_timestamp/")
export const gettingPathOfAParticularShip=(obj)=>callApiAndReturnDataPost(obj,"/routepred/path_of_ship/")
export const gettingShipByCountry=(obj)=>callApiAndReturnDataPost(obj,"/routepred/ship_by_country/")
export const gettingShipByLocation=(obj)=>callApiAndReturnDataPost(obj,"/routepred/ship_in_region/")
export const gettingPredictedRoute=(obj)=>callApiAndReturnDataPost(obj,"/routepred/Route_pred_10/");
export const gettingFishingTrends=(obj)=>callApiAndReturnDataPost(obj,"/routepred/fishing_trends_all/");
// export const gettingFishingTrendsUsingTryCatch=(obj)=>callApiAndReturnDataPostTryCatch(obj,"/routepred/fishing_trends_all/")
export const gettingFishingTrendsOfIndividual=(obj)=>callApiAndReturnDataPost(obj,"/routepred/fishing_trends/")
// ship_by_country - post - country