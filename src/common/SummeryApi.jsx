import { updateRoom } from "../../../backend/controllers/room.controller";

export const baseURL = "http://localhost:8080";

const SummaryApi = {
  //  User


  // Create User
  CreateUser:{
    url:baseURL+"/api/user/create-user",
    method:"POST"
  },
  // Verify User 
  verifyUser: {
    url: baseURL + "/api/user/verify-user",     
    method: "POST"
  },
  // Room




  // Create Room
  createRoom: {
    url: baseURL + "/api/room/CreateRoom",
    method: "POST"
  },
  // Get All Rooms
  getAllRooms: {
    url: baseURL + "/api/room/GetAllRooms",
    method: "GET"
  },

  getroomchallengs:{
    url:baseURL+"/api/room/get-room/:id",
    method:"GET"
  },

  deleteRoom:{
    url:baseURL+"/api/room/delete-room/:id",
    method:"DELETE"
  },

  updateRoom:{
    url:baseURL+"/api/room/update-room/:id",
    method:"PUT"
  },

  // Challenge




  // Create Challenge
  createChallenge: {
    url: baseURL + "/api/challenge/CreateChallenge",
    method: "POST"
  },
  // Get Challenges by Room
  getChallengesByRoom: {
    url: baseURL + "/api/challenge/getchallenges/:id",
    method: "GET"
  }
};

export default SummaryApi;
