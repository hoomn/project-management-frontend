import axios from "axios";

export async function fetchVersion() {
  const res = await axios.get("/version.json");
  return res.data;
}
