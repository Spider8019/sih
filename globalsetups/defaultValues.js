export const defaults = {
    baseUrl: "http://localhost:3000",
    baseBackendUrl:"http://localhost:8000",
    accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtpZEtleSJ9.eyJkYXRhIjp7Im5hbWUiOiJQQUZUIiwidXNlcklkIjoxOTgxNSwiYXBwbGljYXRpb25OYW1lIjoiUEFGVCIsImlkIjoxMTAsInR5cGUiOiJ1c2VyLWFwcGxpY2F0aW9uIn0sImlhdCI6MTY2MDUyNjU3OCwiZXhwIjoxOTc1ODg2NTc4LCJhdWQiOiJnZnciLCJpc3MiOiJnZncifQ.nV6lzQQ049tRb56IM_WhjbGRcAxCvCkGc-dkxRMSIAnMf6WUj-Y4wKWOOpTEpbLIfSvtu0D21L9pAIjrAbZxAdSLxmwxo1ws5rgo3PUw7RtyAmAluK6QpxQ-P0H5lI5SHO_5XeJZKtbwXWZDex031L189POtr4sgdjdqxI-qtoyaa-mPmSWlLuOFVvHRSftCpxkXrGTD7bwrnYuAigbzEYl1ltah6TObo7pwDh-QMoo5UWhlRd2goKQ49n08DtJKxbXJJGzkHJSBXFpVtDt-X5LbHA9TDB_R-VEyEekasyzMY0HUCouaEtQ2f1F7ygjhksbU-toWVo7Egd-BaQiEiqe_Miq7kb83kyseU7JQsvGsPn18PlpnbdsfhV8cji4Vtx9qxD-HJVjm-XisVwt2UPBm-EhQl8wqRl60UBZiCfllPSPqMPUjbfAtzHZPJEphlP2QYkzJWnYGoVf-7Vnm3rk9HW1gCfxYtBipO804si4-QoPqMrj5e7y-TrIS5Tjt",
}

export const pageFramer = {
    initial: {
        x: "100vw",
        opacity: 0,
        scale: 0.8
    },
    animate: {
        x: "0",
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        y: "100vh",
        opacity: 0,
        transition: {
            duration: 0.3
        }
    }
}

export const xEntry={
    initial:{
        x:-100,
        opacity:0,
    },
    animate:{
        x:0,
        opacity:1,
        transition:{
            duration:0.3
        }
    }
}
export const xPositiveEntry={
    initial:{
        x:100,
        opacity:0,
    },
    animate:{
        x:0,
        opacity:1,
        transition:{
            duration:0.3
        }
    }
}
export const opacityEntry={
    initial:{
        opacity:0,
    },
    animate:{
        x:0,
        opacity:1,
        transition:{
            delay:0.5,
            delayChildren:0.3,
            duration:0.3
        }
    }
}