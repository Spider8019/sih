import {gettingData} from "../../globalsetups/api"

async function handler(req,res){
    switch(req.method){
        case 'GET':
                    const data=await gettingData({})
                    res.status(200).json({data})
                    break;
    }
}

export default handler;