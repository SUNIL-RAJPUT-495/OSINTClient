

export const baseURL = "https://osin-tserver.vercel.app";

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
  // getUser

  getuser: {
    url:baseURL+"/api/user/get-user",
    method:"get"
  },

  // getUserAnalytics
  getUserAnalytics: {
    url:baseURL+"/api/user/get-user-analytics",
    method:"get"
  },

  // Deduct Points
  deductPoints: {
    url: baseURL + "/api/user/deduct-points",
    method: "post"
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
  },
  // Delete Challenge
  deleteChallenge: {
    url: baseURL + "/api/challenge/deletechallenge/:challengeId",
    method: "DELETE"
  },
  // Update Challenge 
  updateChallenge: {
    url: baseURL + "/api/challenge/updatechallenge/:challengeId",
    method: "PUT"   
  },
  // Submit Challenge
  submitChallenge: {
    url: baseURL + "/api/challenge/submitchallenge",
    method: "POST"
  },
};

export default SummaryApi;
