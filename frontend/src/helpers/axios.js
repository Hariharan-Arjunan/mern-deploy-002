import axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcmkiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MzY1NTY5NDMsImV4cCI6MTczNjU1Nzg0M30.vym2Khrl7HIdiFltY3Ega1_PD048S1NCxg7PacczM3g";

const api = axios.create({
  headers: {
    Authorization: token,
  },
});

export default api;
