import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

    const payload={
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark"
      }

const notify = (msg) => toast(msg,payload);
const notifywarn = (msg) => toast.warn(msg,payload);
const notifysuccess = (msg) => toast.success(msg,payload)
const notifyerror = (msg) => toast.error(msg,payload)

export {notify, notifywarn, notifysuccess, notifyerror};