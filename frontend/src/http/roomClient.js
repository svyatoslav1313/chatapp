import { createClient } from ".";

export const roomClient = createClient();

roomClient.interceptors.response.use((res) => res.data);
