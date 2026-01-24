import SummaryApi from "../common/SummeryApi";
import Axios from "./Axios";


export const getAllRooms = async () => {
    try {
        const res = await Axios({
            url:SummaryApi.getAllRooms.url,
            method:SummaryApi.getAllRooms.method,
        })

        if (res.data.success) {
            console.log("Rooms fetched:", res.data.data);
            return res.data.data; 
        }
    } catch (error) {
        console.error("Error fetching rooms:", error);
    }
};