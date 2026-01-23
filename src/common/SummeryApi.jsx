
export const baseURL = "http://localhost:8080";

const SummaryApi = {
  //user
  CreateUser:{
    url:baseURL+"/api/user/create-user",
    method:"POST"
  },
  // Verify User 
  verifyUser: {
    url: baseURL + "/api/user/verify-user",
    method: "POST"
  }
  
};

export default SummaryApi;
